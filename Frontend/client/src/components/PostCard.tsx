import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Share2, User } from "lucide-react";
import { useState } from "react";

interface PostCardProps {
  post: {
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
  };
  onPostClick?: (postId: string) => void;
  onAuthorClick?: (authorName: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function PostCard({ post, onPostClick, onAuthorClick, onTagClick }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.stats.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    console.log(`Post ${post.id} ${isLiked ? 'unliked' : 'liked'}`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    console.log(`Post ${post.id} ${isSaved ? 'unsaved' : 'saved'}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Sharing post ${post.id}`);
  };

  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all duration-200 overflow-hidden group"
      onClick={() => {
        onPostClick?.(post.id);
        console.log(`Viewing post ${post.id}`);
      }}
      data-testid={`card-post-${post.id}`}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-cover-${post.id}`}
          />
        </div>
      )}
      
      <CardContent className="p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs hover-elevate cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                  console.log(`Tag clicked: ${tag}`);
                }}
                data-testid={`badge-tag-${tag}`}
              >
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Title */}
        <h3 
          className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors"
          data-testid={`text-title-${post.id}`}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p 
          className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed"
          data-testid={`text-excerpt-${post.id}`}
        >
          {post.excerpt}
        </p>

        {/* Author and Meta */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover-elevate rounded p-1 -ml-1"
            onClick={(e) => {
              e.stopPropagation();
              onAuthorClick?.(post.author.name);
              console.log(`Author clicked: ${post.author.name}`);
            }}
            data-testid={`author-info-${post.id}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name.charAt(0) || <User className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <div className="text-xs text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })} • {post.readTime} min read
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-1 h-8 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              data-testid={`button-like-${post.id}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Comments for post ${post.id}`);
              }}
              data-testid={`button-comments-${post.id}`}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.stats.comments}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={`h-8 w-8 ${isSaved ? 'text-primary' : 'text-muted-foreground'}`}
              data-testid={`button-save-${post.id}`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-8 w-8 text-muted-foreground"
              data-testid={`button-share-${post.id}`}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}