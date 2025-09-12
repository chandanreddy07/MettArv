import PostCard from '../PostCard';
import workspaceImageUrl from '@assets/generated_images/Blog_workspace_cover_image_1fda9668.png';
import techImageUrl from '@assets/generated_images/Tech_blog_cover_image_553b51f6.png';
import devAvatarUrl from '@assets/generated_images/Developer_profile_avatar_5119a3ce.png';
import writerAvatarUrl from '@assets/generated_images/Writer_profile_avatar_6ea7b8b9.png';

export default function PostCardExample() {
  //todo: remove mock functionality
  const mockPosts = [
    {
      id: "1",
      title: "Building Modern React Applications with TypeScript",
      excerpt: "Learn how to create scalable React applications using TypeScript, modern hooks, and best practices for component architecture.",
      coverImage: techImageUrl,
      tags: ["React", "TypeScript", "Frontend"],
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
      excerpt: "Discover strategies for maintaining productivity and work-life balance while working remotely. Tips from seasoned remote workers.",
      coverImage: workspaceImageUrl,
      tags: ["Remote Work", "Productivity", "Lifestyle"],
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
      excerpt: "A comprehensive guide to implementing accessibility features in web applications, ensuring your content reaches everyone.",
      tags: ["Accessibility", "Web Development", "UX"],
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
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Blog Post Cards</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPostClick={(id) => console.log('Post clicked:', id)}
            onAuthorClick={(name) => console.log('Author clicked:', name)}
            onTagClick={(tag) => console.log('Tag clicked:', tag)}
          />
        ))}
      </div>
    </div>
  );
}