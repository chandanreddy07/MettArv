import { useState } from "react";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, Clock, Heart } from "lucide-react";

interface Post {
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
}

interface PostFeedProps {
  posts: Post[];
  onPostClick?: (postId: string) => void;
  onAuthorClick?: (authorName: string) => void;
  onTagClick?: (tag: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export default function PostFeed({
  posts = [],
  onPostClick,
  onAuthorClick,
  onTagClick,
  onLoadMore,
  hasMore = false,
  isLoading = false
}: PostFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"latest" | "trending" | "popular">("latest");

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts based on search and tags
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "trending":
        return (b.stats.likes + b.stats.comments) - (a.stats.likes + a.stats.comments);
      case "popular":
        return b.stats.likes - a.stats.likes;
      default: // latest
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    console.log('Tag filter toggled:', tag);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    console.log('Filters cleared');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="input-feed-search"
            type="search"
            placeholder="Search posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort Tabs */}
        <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="latest" data-testid="tab-latest">
              <Clock className="h-4 w-4 mr-2" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="trending" data-testid="tab-trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="popular" data-testid="tab-popular">
              <Heart className="h-4 w-4 mr-2" />
              Popular
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by tags:</span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs h-6"
                  data-testid="button-clear-filters"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 12).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className="cursor-pointer hover-elevate"
                  onClick={() => toggleTag(tag)}
                  data-testid={`badge-filter-${tag}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {(searchQuery || selectedTags.length > 0) && (
          <div className="text-sm text-muted-foreground">
            Showing {sortedPosts.length} of {posts.length} posts
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedTags.length > 0 && ` with tags: ${selectedTags.join(", ")}`}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {sortedPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostClick={onPostClick}
              onAuthorClick={onAuthorClick}
              onTagClick={(tag) => {
                toggleTag(tag);
                onTagClick?.(tag);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No posts found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && sortedPosts.length > 0 && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => {
              onLoadMore?.();
              console.log('Load more clicked');
            }}
            disabled={isLoading}
            data-testid="button-load-more"
          >
            {isLoading ? "Loading..." : "Load More Posts"}
          </Button>
        </div>
      )}
    </div>
  );
}