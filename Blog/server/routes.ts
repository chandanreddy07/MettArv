import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPostSchema, updatePostSchema, updateUserSchema, insertTagSchema, type UserWithStats, type User, users } from "../shared/schema";
import { fromZodError } from "zod-validation-error";
import { sendEmail, generateVerificationEmail } from "./sendgrid";
import crypto from 'crypto';
import { db } from "./db";
import { eq } from "drizzle-orm";

// Helper function to sanitize user data for public consumption
function sanitizeUser<T extends User | UserWithStats>(user: T): T {
  const { emailVerificationToken, ...safeUser } = user;
  return safeUser as T;
}

// Helper function to sanitize post data including nested author
function sanitizePost(post: any): any {
  if (post.author) {
    return {
      ...post,
      author: sanitizeUser(post.author)
    };
  }
  return post;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(sanitizeUser(user));
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Test route to verify auth is working
  app.get('/api/test-auth', isAuthenticated, async (req: any, res) => {
    res.json({ 
      message: 'Authenticated successfully', 
      userId: req.user?.claims?.sub 
    });
  });

  // User routes
  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUserWithStats(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(sanitizeUser(user));
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  app.patch('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      if (userId !== req.params.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // Validate request body
      const validationResult = updateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ message: 'Invalid input', details: validationError.message });
      }
      
      const updatedUser = await storage.updateUser(userId, validationResult.data);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(sanitizeUser(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });

  // Posts routes
  app.get('/api/posts', async (req, res) => {
    try {
      const { author, status, tag, search, limit, offset } = req.query;
      const posts = await storage.getPosts({
        authorId: author as string,
        status: status as string,
        tag: tag as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(posts.map(post => sanitizePost(post)));
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Failed to fetch posts' });
    }
  });

  app.get('/api/posts/:id', async (req, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(sanitizePost(post));
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  app.get('/api/posts/slug/:slug', async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(sanitizePost(post));
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Failed to fetch post' });
    }
  });

  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validationResult = insertPostSchema.safeParse({
        ...req.body,
        authorId: userId,
      });
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ message: 'Invalid input', details: validationError.message });
      }
      
      const post = await storage.createPost(validationResult.data);
      res.status(201).json(sanitizePost(post));
    } catch (error) {
      console.error('Error creating post:', error);
      // Handle unique constraint violations
      if ((error as any)?.message?.includes('unique') || (error as any)?.code === '23505') {
        return res.status(409).json({ message: 'A post with this slug already exists' });
      }
      res.status(500).json({ message: 'Failed to create post' });
    }
  });

  app.patch('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const post = await storage.getPost(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      if (post.author.id !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      // Validate request body
      const validationResult = updatePostSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ message: 'Invalid input', details: validationError.message });
      }
      
      const updatedPost = await storage.updatePost(req.params.id, validationResult.data);
      res.json(sanitizePost(updatedPost));
    } catch (error) {
      console.error('Error updating post:', error);
      // Handle unique constraint violations
      if ((error as any)?.message?.includes('unique') || (error as any)?.code === '23505') {
        return res.status(409).json({ message: 'A post with this slug already exists' });
      }
      res.status(500).json({ message: 'Failed to update post' });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const post = await storage.getPost(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      if (post.author.id !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      const deleted = await storage.deletePost(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: 'Failed to delete post' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Failed to delete post' });
    }
  });

  // Tags routes
  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ message: 'Failed to fetch tags' });
    }
  });

  app.post('/api/tags', isAuthenticated, async (req: any, res) => {
    try {
      // Validate request body
      const validationResult = insertTagSchema.safeParse(req.body);
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ message: 'Invalid input', details: validationError.message });
      }
      
      const tag = await storage.createTag(validationResult.data);
      res.status(201).json(tag);
    } catch (error) {
      console.error('Error creating tag:', error);
      // Handle unique constraint violations
      if ((error as any)?.message?.includes('unique') || (error as any)?.code === '23505') {
        return res.status(409).json({ message: 'A tag with this name already exists' });
      }
      res.status(500).json({ message: 'Failed to create tag' });
    }
  });

  // Post likes routes
  app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.likePost(userId, req.params.id);
      res.json({ liked: success });
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ message: 'Failed to like post' });
    }
  });

  app.delete('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.unlikePost(userId, req.params.id);
      res.json({ unliked: success });
    } catch (error) {
      console.error('Error unliking post:', error);
      res.status(500).json({ message: 'Failed to unlike post' });
    }
  });

  // User follow routes
  app.post('/api/users/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.followUser(userId, req.params.id);
      res.json({ followed: success });
    } catch (error) {
      console.error('Error following user:', error);
      res.status(500).json({ message: 'Failed to follow user' });
    }
  });

  app.delete('/api/users/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const success = await storage.unfollowUser(userId, req.params.id);
      res.json({ unfollowed: success });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      res.status(500).json({ message: 'Failed to unfollow user' });
    }
  });

  // Search routes
  app.get('/api/search/users', async (req, res) => {
    try {
      const { q, limit } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query required' });
      }
      
      const users = await storage.searchUsers(
        q as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(users.map(user => sanitizeUser(user)));
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ message: 'Failed to search users' });
    }
  });

  // Email verification routes
  app.post('/api/auth/send-verification', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserWithStats(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }
      
      // Generate secure verification token and save with expiry
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await storage.setEmailVerificationToken(userId, token, expiresAt);
      
      // Send verification email with plain token (not hashed)
      const emailParams = generateVerificationEmail(user.email!, token);
      const success = await sendEmail(emailParams);
      
      if (success) {
        res.json({ message: 'Verification email sent' });
      } else {
        res.status(500).json({ message: 'Failed to send verification email' });
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ message: 'Failed to send verification email' });
    }
  });

  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Token required' });
      }
      
      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }
      
      // Verify the email and clear the token using storage interface
      const verifiedUser = await storage.verifyUserEmail(user.id);
      
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ message: 'Failed to verify email' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}