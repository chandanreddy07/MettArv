import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  MapPin,
  Calendar,
  Link as LinkIcon,
  User,
  Heart,
  MessageCircle,
  Settings
} from "lucide-react";
import PostCard from "./PostCard";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinedAt: string;
    isOwnProfile?: boolean;
    stats: {
      posts: number;
      followers: number;
      following: number;
    };
  };
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    publishedAt: string;
    readTime: number;
    author: {
      name: string;
      avatar?: string;
    };
    stats: {
      likes: number;
      comments: number;
    };
    status?: "draft" | "published";
  }>;
  onEditProfile?: () => void;
  onFollow?: () => void;
  onPostClick?: (postId: string) => void;
  onTagClick?: (tag: string) => void;
  isFollowing?: boolean;
}

export default function UserProfile({
  user,
  posts = [],
  onEditProfile,
  onFollow,
  onPostClick,
  onTagClick,
  isFollowing = false
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("published");
  const [following, setFollowing] = useState(isFollowing);

  const publishedPosts = posts.filter(post => post.status !== "draft");
  const draftPosts = posts.filter(post => post.status === "draft");
  const currentPosts = activeTab === "published" ? publishedPosts : draftPosts;

  const handleFollow = () => {
    setFollowing(!following);
    onFollow?.();
    console.log(`${following ? 'Unfollowed' : 'Followed'} ${user.name}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.charAt(0) || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" data-testid="text-user-name">
                    {user.name}
                  </h1>
                  {user.bio && (
                    <p className="text-muted-foreground text-lg" data-testid="text-user-bio">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.joinedAt)}</span>
                  </div>
                  
                  {user.website && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        data-testid="link-user-website"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.stats.posts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center cursor-pointer hover-elevate rounded p-2 -m-2" onClick={() => console.log('Followers clicked')}>
                    <div className="text-2xl font-bold">{user.stats.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center cursor-pointer hover-elevate rounded p-2 -m-2" onClick={() => console.log('Following clicked')}>
                    <div className="text-2xl font-bold">{user.stats.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {user.isOwnProfile ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onEditProfile?.();
                        console.log('Edit profile clicked');
                      }}
                      data-testid="button-edit-profile"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('Settings clicked')}
                      data-testid="button-settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={following ? "outline" : "default"}
                    onClick={handleFollow}
                    data-testid="button-follow"
                  >
                    {following ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="published" data-testid="tab-published">
                Published ({publishedPosts.length})
              </TabsTrigger>
              {user.isOwnProfile && (
                <TabsTrigger value="drafts" data-testid="tab-drafts">
                  Drafts ({draftPosts.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="published" className="mt-6">
              {publishedPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {publishedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onPostClick={onPostClick}
                      onTagClick={onTagClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {user.isOwnProfile ? "You haven't published any posts yet." : "No published posts yet."}
                  </p>
                  {user.isOwnProfile && (
                    <Button className="mt-4" onClick={() => console.log('Create first post')}>
                      Create Your First Post
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            {user.isOwnProfile && (
              <TabsContent value="drafts" className="mt-6">
                {draftPosts.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {draftPosts.map((post) => (
                      <Card key={post.id} className="hover-elevate cursor-pointer relative">
                        <Badge variant="secondary" className="absolute top-4 right-4 z-10">
                          Draft
                        </Badge>
                        <PostCard
                          post={post}
                          onPostClick={onPostClick}
                          onTagClick={onTagClick}
                        />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No drafts found.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start writing and save your work as drafts.
                    </p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}