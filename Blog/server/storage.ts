import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and, ilike, or, count, sql, gt } from "drizzle-orm";
import { 
  type User, type InsertUser, type UpdateUser, type UpsertUser,
  type Post, type InsertPost, type UpdatePost, type PostWithAuthor,
  type Tag, type InsertTag, type UpdateTag,
  type UserSession, type InsertUserSession,
  type PostLike, type InsertPostLike,
  type UserFollow, type InsertUserFollow,
  type PostTag, type InsertPostTag,
  type UserWithStats,
  users, posts, tags, postTags, postLikes, userFollows, userSessions
} from "@shared/schema";
import { randomUUID } from "crypto";
import crypto from "crypto";

// Database connection
const connectionString = process.env.DATABASE_URL!;
const client = neon(connectionString);
const db = drizzle(client);

// Helper function to generate SEO-friendly slugs
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to calculate estimated read time
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: UpdateUser): Promise<User | undefined>;
  getUserWithStats(id: string): Promise<UserWithStats | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  setEmailVerificationToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  verifyUserEmail(userId: string): Promise<User | undefined>;
  searchUsers(query: string, limit?: number): Promise<User[]>;
  
  // Post operations  
  getPost(id: string): Promise<PostWithAuthor | undefined>;
  getPostBySlug(slug: string): Promise<PostWithAuthor | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: UpdatePost): Promise<Post | undefined>;
  deletePost(id: string): Promise<boolean>;
  getPosts(options?: {
    authorId?: string;
    status?: string;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<PostWithAuthor[]>;
  
  // Tag operations
  getTag(id: string): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: string, tag: UpdateTag): Promise<Tag | undefined>;
  getTags(limit?: number): Promise<Tag[]>;
  getPopularTags(limit?: number): Promise<Tag[]>;
  
  // Post-Tag relationships
  addTagToPost(postId: string, tagId: string): Promise<void>;
  removeTagFromPost(postId: string, tagId: string): Promise<void>;
  getPostTags(postId: string): Promise<Tag[]>;
  
  // Like operations
  likePost(userId: string, postId: string): Promise<boolean>;
  unlikePost(userId: string, postId: string): Promise<boolean>;
  isPostLiked(userId: string, postId: string): Promise<boolean>;
  getPostLikes(postId: string): Promise<number>;
  
  // Follow operations
  followUser(followerId: string, followingId: string): Promise<boolean>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  isUserFollowing(followerId: string, followingId: string): Promise<boolean>;
  getUserFollowers(userId: string): Promise<User[]>;
  getUserFollowing(userId: string): Promise<User[]>;
  
  // Session operations
  createSession(session: InsertUserSession): Promise<UserSession>;
  getSessionByToken(token: string): Promise<UserSession | undefined>;
  deleteSession(token: string): Promise<boolean>;
  deleteUserSessions(userId: string): Promise<boolean>;
  
  // Analytics and stats
  updatePostStats(postId: string): Promise<void>;
  updateUserStats(userId: string): Promise<void>;
  updateTagStats(tagId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }
  
  // Required for Replit Auth
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const now = new Date();
    const newUser = {
      ...user,
      id: randomUUID(),
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  }
  
  async updateUser(id: string, user: UpdateUser): Promise<User | undefined> {
    const updatedUser = {
      ...user,
      updatedAt: new Date(),
    };
    
    const result = await db
      .update(users)
      .set(updatedUser)
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }
  
  async getUserWithStats(id: string): Promise<UserWithStats | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    // Get user stats
    const [postsCount, followersCount, followingCount] = await Promise.all([
      db.select({ count: count() }).from(posts).where(eq(posts.authorId, id)),
      db.select({ count: count() }).from(userFollows).where(eq(userFollows.followingId, id)),
      db.select({ count: count() }).from(userFollows).where(eq(userFollows.followerId, id)),
    ]);
    
    return {
      ...user,
      stats: {
        posts: postsCount[0]?.count || 0,
        followers: followersCount[0]?.count || 0,
        following: followingCount[0]?.count || 0,
      }
    };
  }
  
  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    // Hash the token to match stored version
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const result = await db
      .select()
      .from(users)
      .where(and(
        eq(users.emailVerificationToken, hashedToken),
        gt(users.emailVerificationExpires, new Date())
      ))
      .limit(1);
    return result[0];
  }

  async setEmailVerificationToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    await db.update(users).set({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiresAt
    }).where(eq(users.id, userId));
  }

  async verifyUserEmail(userId: string): Promise<User | undefined> {
    const result = await db.update(users).set({
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    }).where(eq(users.id, userId)).returning();
    return result[0];
  }

  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(or(
        ilike(users.firstName, `%${query}%`),
        ilike(users.lastName, `%${query}%`),
        ilike(users.email, `%${query}%`)
      ))
      .limit(limit);
  }
  
  // Post operations
  async getPost(id: string): Promise<PostWithAuthor | undefined> {
    const result = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, id))
      .limit(1);
    
    if (!result[0] || !result[0].author) return undefined;
    
    const postTags = await this.getPostTags(id);
    const likesCount = await this.getPostLikes(id);
    
    return {
      ...result[0].post,
      author: result[0].author,
      tags: postTags,
      stats: {
        likes: likesCount,
        comments: result[0].post.commentsCount || 0,
      }
    };
  }
  
  async getPostBySlug(slug: string): Promise<PostWithAuthor | undefined> {
    const result = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.slug, slug))
      .limit(1);
    
    if (!result[0] || !result[0].author) return undefined;
    
    const postTags = await this.getPostTags(result[0].post.id);
    const likesCount = await this.getPostLikes(result[0].post.id);
    
    return {
      ...result[0].post,
      author: result[0].author,
      tags: postTags,
      stats: {
        likes: likesCount,
        comments: result[0].post.commentsCount || 0,
      }
    };
  }
  
  async createPost(post: InsertPost): Promise<Post> {
    const slug = generateSlug(post.title);
    const readTime = calculateReadTime(post.content);
    const now = new Date();
    
    const newPost = {
      ...post,
      id: randomUUID(),
      slug,
      readTime,
      createdAt: now,
      updatedAt: now,
      publishedAt: post.status === 'published' ? now : null,
    };
    
    const result = await db.insert(posts).values(newPost).returning();
    return result[0];
  }
  
  async updatePost(id: string, post: UpdatePost): Promise<Post | undefined> {
    const updates: any = {
      ...post,
      updatedAt: new Date(),
    };
    
    // Update slug if title changed
    if (post.title) {
      updates.slug = generateSlug(post.title);
    }
    
    // Update read time if content changed
    if (post.content) {
      updates.readTime = calculateReadTime(post.content);
    }
    
    // Set published date if status changed to published
    if (post.status === 'published') {
      updates.publishedAt = new Date();
    }
    
    const result = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();
    
    return result[0];
  }
  
  async deletePost(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount > 0;
  }
  
  async getPosts(options: {
    authorId?: string;
    status?: string;
    tag?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<PostWithAuthor[]> {
    const { authorId, status = 'published', tag, search, limit = 10, offset = 0 } = options;
    
    // Build where conditions
    const conditions = [];
    
    if (authorId) {
      conditions.push(eq(posts.authorId, authorId));
    }
    
    if (status) {
      conditions.push(eq(posts.status, status));
    }
    
    if (search) {
      conditions.push(or(
        ilike(posts.title, `%${search}%`),
        ilike(posts.content, `%${search}%`),
        ilike(posts.excerpt, `%${search}%`)
      ));
    }
    
    let result;
    
    if (tag) {
      // Query with tag filtering
      const tagConditions = [eq(tags.slug, tag), ...conditions];
      result = await db
        .select({
          post: posts,
          author: users,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(postTags, eq(posts.id, postTags.postId))
        .leftJoin(tags, eq(postTags.tagId, tags.id))
        .where(and(...tagConditions))
        .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      // Query without tag filtering
      const baseQuery = db
        .select({
          post: posts,
          author: users,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id));
      
      if (conditions.length > 0) {
        result = await baseQuery
          .where(and(...conditions))
          .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        result = await baseQuery
          .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
          .limit(limit)
          .offset(offset);
      }
    }
    
    // Get tags and stats for each post
    const postsWithDetails = await Promise.all(
      result.map(async ({ post, author }) => {
        if (!author) return null;
        
        const [postTags, likesCount] = await Promise.all([
          this.getPostTags(post.id),
          this.getPostLikes(post.id)
        ]);
        
        return {
          ...post,
          author,
          tags: postTags,
          stats: {
            likes: likesCount,
            comments: post.commentsCount || 0,
          }
        };
      })
    );
    
    return postsWithDetails.filter(Boolean) as PostWithAuthor[];
  }
  
  // Tag operations
  async getTag(id: string): Promise<Tag | undefined> {
    const result = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
    return result[0];
  }
  
  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
    return result[0];
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const slug = generateSlug(tag.name);
    const newTag = {
      ...tag,
      id: randomUUID(),
      slug,
      createdAt: new Date(),
    };
    
    const result = await db.insert(tags).values(newTag).returning();
    return result[0];
  }
  
  async updateTag(id: string, tag: UpdateTag): Promise<Tag | undefined> {
    const updates: any = { ...tag };
    
    if (tag.name) {
      updates.slug = generateSlug(tag.name);
    }
    
    const result = await db
      .update(tags)
      .set(updates)
      .where(eq(tags.id, id))
      .returning();
    
    return result[0];
  }
  
  async getTags(limit: number = 50): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .orderBy(desc(tags.postsCount), tags.name)
      .limit(limit);
  }
  
  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .where(sql`${tags.postsCount} > 0`)
      .orderBy(desc(tags.postsCount))
      .limit(limit);
  }
  
  // Post-Tag relationships
  async addTagToPost(postId: string, tagId: string): Promise<void> {
    const newPostTag = {
      id: randomUUID(),
      postId,
      tagId,
      createdAt: new Date(),
    };
    
    await db.insert(postTags).values(newPostTag);
    await this.updateTagStats(tagId);
  }
  
  async removeTagFromPost(postId: string, tagId: string): Promise<void> {
    await db.delete(postTags).where(
      and(
        eq(postTags.postId, postId),
        eq(postTags.tagId, tagId)
      )
    );
    await this.updateTagStats(tagId);
  }
  
  async getPostTags(postId: string): Promise<Tag[]> {
    const result = await db
      .select({ tag: tags })
      .from(postTags)
      .leftJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(postTags.postId, postId));
    
    return result.map(r => r.tag).filter(Boolean) as Tag[];
  }
  
  // Like operations
  async likePost(userId: string, postId: string): Promise<boolean> {
    try {
      const newLike = {
        id: randomUUID(),
        userId,
        postId,
        createdAt: new Date(),
      };
      
      await db.insert(postLikes).values(newLike);
      await this.updatePostStats(postId);
      return true;
    } catch (error) {
      // Duplicate like, ignore
      return false;
    }
  }
  
  async unlikePost(userId: string, postId: string): Promise<boolean> {
    const result = await db.delete(postLikes).where(
      and(
        eq(postLikes.userId, userId),
        eq(postLikes.postId, postId)
      )
    );
    
    if (result.rowCount > 0) {
      await this.updatePostStats(postId);
      return true;
    }
    return false;
  }
  
  async isPostLiked(userId: string, postId: string): Promise<boolean> {
    const result = await db
      .select({ id: postLikes.id })
      .from(postLikes)
      .where(
        and(
          eq(postLikes.userId, userId),
          eq(postLikes.postId, postId)
        )
      )
      .limit(1);
    
    return result.length > 0;
  }
  
  async getPostLikes(postId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(postLikes)
      .where(eq(postLikes.postId, postId));
    
    return result[0]?.count || 0;
  }
  
  // Follow operations
  async followUser(followerId: string, followingId: string): Promise<boolean> {
    if (followerId === followingId) return false;
    
    try {
      const newFollow = {
        id: randomUUID(),
        followerId,
        followingId,
        createdAt: new Date(),
      };
      
      await db.insert(userFollows).values(newFollow);
      return true;
    } catch (error) {
      // Duplicate follow, ignore
      return false;
    }
  }
  
  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const result = await db.delete(userFollows).where(
      and(
        eq(userFollows.followerId, followerId),
        eq(userFollows.followingId, followingId)
      )
    );
    
    return result.rowCount > 0;
  }
  
  async isUserFollowing(followerId: string, followingId: string): Promise<boolean> {
    const result = await db
      .select({ id: userFollows.id })
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followerId, followerId),
          eq(userFollows.followingId, followingId)
        )
      )
      .limit(1);
    
    return result.length > 0;
  }
  
  async getUserFollowers(userId: string): Promise<User[]> {
    const result = await db
      .select({ user: users })
      .from(userFollows)
      .leftJoin(users, eq(userFollows.followerId, users.id))
      .where(eq(userFollows.followingId, userId));
    
    return result.map(r => r.user).filter(Boolean) as User[];
  }
  
  async getUserFollowing(userId: string): Promise<User[]> {
    const result = await db
      .select({ user: users })
      .from(userFollows)
      .leftJoin(users, eq(userFollows.followingId, users.id))
      .where(eq(userFollows.followerId, userId));
    
    return result.map(r => r.user).filter(Boolean) as User[];
  }
  
  // Session operations
  async createSession(session: InsertUserSession): Promise<UserSession> {
    const newSession = {
      ...session,
      id: randomUUID(),
      createdAt: new Date(),
    };
    
    const result = await db.insert(userSessions).values(newSession).returning();
    return result[0];
  }
  
  async getSessionByToken(token: string): Promise<UserSession | undefined> {
    const result = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.token, token))
      .limit(1);
    
    return result[0];
  }
  
  async deleteSession(token: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.token, token));
    return result.rowCount > 0;
  }
  
  async deleteUserSessions(userId: string): Promise<boolean> {
    const result = await db.delete(userSessions).where(eq(userSessions.userId, userId));
    return result.rowCount > 0;
  }
  
  // Analytics and stats  
  async updatePostStats(postId: string): Promise<void> {
    const likesCount = await this.getPostLikes(postId);
    
    await db
      .update(posts)
      .set({ likesCount })
      .where(eq(posts.id, postId));
  }
  
  async updateUserStats(userId: string): Promise<void> {
    // User stats are calculated dynamically in getUserWithStats
    // This could be used for caching if needed
  }
  
  async updateTagStats(tagId: string): Promise<void> {
    const result = await db
      .select({ count: count() })
      .from(postTags)
      .where(eq(postTags.tagId, tagId));
    
    const postsCount = result[0]?.count || 0;
    
    await db
      .update(tags)
      .set({ postsCount })
      .where(eq(tags.id, tagId));
  }
}

export const storage = new DatabaseStorage();
