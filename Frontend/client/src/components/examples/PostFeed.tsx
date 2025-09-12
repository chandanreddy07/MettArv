import PostFeed from '../PostFeed';
import workspaceImageUrl from '@assets/generated_images/Blog_workspace_cover_image_1fda9668.png';
import techImageUrl from '@assets/generated_images/Tech_blog_cover_image_553b51f6.png';
import devAvatarUrl from '@assets/generated_images/Developer_profile_avatar_5119a3ce.png';
import writerAvatarUrl from '@assets/generated_images/Writer_profile_avatar_6ea7b8b9.png';

export default function PostFeedExample() {
  //todo: remove mock functionality
  const mockPosts = [
    {
      id: "1",
      title: "Building Modern React Applications with TypeScript",
      excerpt: "Learn how to create scalable React applications using TypeScript, modern hooks, and best practices for component architecture. This comprehensive guide covers everything from setup to deployment.",
      coverImage: techImageUrl,
      tags: ["React", "TypeScript", "Frontend", "JavaScript"],
      publishedAt: "2024-01-15",
      readTime: 8,
      author: {
        name: "Sarah Chen",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 142,
        comments: 23
      }
    },
    {
      id: "2",
      title: "The Art of Remote Work: Finding Balance in a Digital World",
      excerpt: "Discover strategies for maintaining productivity and work-life balance while working remotely. Tips from seasoned remote workers and digital nomads.",
      coverImage: workspaceImageUrl,
      tags: ["Remote Work", "Productivity", "Lifestyle", "Career"],
      publishedAt: "2024-01-12",
      readTime: 5,
      author: {
        name: "Marcus Williams",
        avatar: writerAvatarUrl
      },
      stats: {
        likes: 89,
        comments: 15
      }
    },
    {
      id: "3",
      title: "Understanding Web Accessibility: A Developer's Guide",
      excerpt: "A comprehensive guide to implementing accessibility features in web applications, ensuring your content reaches everyone. Learn WCAG guidelines and practical implementation tips.",
      tags: ["Accessibility", "Web Development", "UX", "Frontend"],
      publishedAt: "2024-01-10",
      readTime: 12,
      author: {
        name: "Jordan Taylor",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 67,
        comments: 8
      }
    },
    {
      id: "4",
      title: "CSS Grid vs Flexbox: When to Use What",
      excerpt: "A detailed comparison of CSS Grid and Flexbox layout systems. Learn when to use each approach for optimal web layouts.",
      coverImage: techImageUrl,
      tags: ["CSS", "Web Development", "Layout", "Frontend"],
      publishedAt: "2024-01-08",
      readTime: 6,
      author: {
        name: "Alex Kim",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 134,
        comments: 19
      }
    },
    {
      id: "5",
      title: "Building a Personal Brand as a Developer",
      excerpt: "Learn how to build and maintain a strong personal brand in the tech industry. From social media presence to portfolio creation.",
      tags: ["Career", "Personal Branding", "Tech Industry"],
      publishedAt: "2024-01-05",
      readTime: 7,
      author: {
        name: "Taylor Swift",
        avatar: writerAvatarUrl
      },
      stats: {
        likes: 203,
        comments: 45
      }
    },
    {
      id: "6",
      title: "The Future of JavaScript: ES2024 Features",
      excerpt: "Explore the latest JavaScript features coming in ES2024. From new syntax to improved performance and developer experience.",
      coverImage: techImageUrl,
      tags: ["JavaScript", "ES2024", "Frontend", "Programming"],
      publishedAt: "2024-01-03",
      readTime: 10,
      author: {
        name: "David Park",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 156,
        comments: 32
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Latest Posts</h1>
        <p className="text-muted-foreground">Discover amazing content from our community</p>
      </div>
      
      <PostFeed
        posts={mockPosts}
        onPostClick={(id) => console.log('Post clicked:', id)}
        onAuthorClick={(name) => console.log('Author clicked:', name)}
        onTagClick={(tag) => console.log('Tag clicked:', tag)}
        onLoadMore={() => console.log('Load more posts')}
        hasMore={true}
      />
    </div>
  );
}