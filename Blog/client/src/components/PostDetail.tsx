import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Edit
} from "lucide-react";

interface PostDetailProps {
  post: {
    id: string;
    title: string;
    content: string;
    coverImage?: string;
    tags: string[];
    publishedAt: string;
    readTime: number;
    author: {
      id: string;
      name: string;
      avatar?: string;
      bio?: string;
    };
    stats: {
      likes: number;
      comments: number;
    };
    isOwnPost?: boolean;
  };
  relatedPosts?: Array<{
    id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    author: {
      name: string;
      avatar?: string;
    };
    readTime: number;
  }>;
  onBack?: () => void;
  onEdit?: () => void;
  onAuthorClick?: (authorId: string) => void;
  onTagClick?: (tag: string) => void;
  onRelatedPostClick?: (postId: string) => void;
}

export default function PostDetail({
  post,
  relatedPosts = [],
  onBack,
  onEdit,
  onAuthorClick,
  onTagClick,
  onRelatedPostClick
}: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.stats.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    console.log(`Post ${post.id} ${isLiked ? 'unliked' : 'liked'}`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log(`Post ${post.id} ${isSaved ? 'unsaved' : 'saved'}`);
  };

  const handleShare = () => {
    console.log(`Sharing post ${post.id}`);
    // In a real app, this would copy the URL or open share dialog
    alert('Link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for demo
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{line.substring(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-6 list-disc mb-2">
              {line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </li>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} className="mb-4 leading-relaxed text-lg">
            {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </p>
        );
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
            onBack?.();
            console.log('Back button clicked');
          }}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to posts
        </Button>

        {/* Article */}
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-[16/9] overflow-hidden rounded-lg">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  data-testid="img-post-cover"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight" data-testid="text-post-title">
              {post.title}
            </h1>

            {/* Meta and Author Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover-elevate rounded p-2 -m-2"
                onClick={() => {
                  onAuthorClick?.(post.author.id);
                  console.log(`Author clicked: ${post.author.name}`);
                }}
                data-testid="author-info"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>
                    {post.author.name.charAt(0) || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{post.author.name}</p>
                  {post.author.bio && (
                    <p className="text-muted-foreground text-sm">{post.author.bio}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {post.isOwnPost && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit?.();
                      console.log('Edit post clicked');
                    }}
                    data-testid="button-edit-post"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover-elevate"
                    onClick={() => {
                      onTagClick?.(tag);
                      console.log(`Tag clicked: ${tag}`);
                    }}
                    data-testid={`badge-tag-${tag}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <Separator />

          {/* Content */}
          <div className="prose prose-lg max-w-none" data-testid="post-content">
            {formatContent(post.content)}
          </div>

          <Separator />

          {/* Engagement Actions */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={`${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
                data-testid="button-like"
              >
                <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount} likes</span>
              </Button>
              
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => console.log('Comments clicked')}
                data-testid="button-comments"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                <span>{post.stats.comments} comments</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className={`${isSaved ? 'text-primary' : 'text-muted-foreground'}`}
                data-testid="button-save"
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-muted-foreground"
                data-testid="button-share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card 
                  key={relatedPost.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => {
                    onRelatedPostClick?.(relatedPost.id);
                    console.log(`Related post clicked: ${relatedPost.id}`);
                  }}
                  data-testid={`card-related-${relatedPost.id}`}
                >
                  {relatedPost.coverImage && (
                    <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={relatedPost.author.avatar} alt={relatedPost.author.name} />
                          <AvatarFallback className="text-xs">
                            {relatedPost.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{relatedPost.author.name}</span>
                      </div>
                      <span>{relatedPost.readTime} min read</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}