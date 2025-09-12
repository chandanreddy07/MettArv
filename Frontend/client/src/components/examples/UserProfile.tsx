import UserProfile from '../UserProfile';
import workspaceImageUrl from '@assets/generated_images/Blog_workspace_cover_image_1fda9668.png';
import techImageUrl from '@assets/generated_images/Tech_blog_cover_image_553b51f6.png';
import devAvatarUrl from '@assets/generated_images/Developer_profile_avatar_5119a3ce.png';
import writerAvatarUrl from '@assets/generated_images/Writer_profile_avatar_6ea7b8b9.png';

export default function UserProfileExample() {
  //todo: remove mock functionality
  const mockUser = {
    id: "1",
    name: "Sarah Chen",
    avatar: devAvatarUrl,
    bio: "Senior Frontend Developer & Technical Writer. Passionate about React, TypeScript, and developer experience. Building the future of web development one component at a time.",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    joinedAt: "2022-03-15",
    isOwnProfile: true,
    stats: {
      posts: 24,
      followers: 1250,
      following: 180
    }
  };

  const mockPosts = [
    {
      id: "1",
      title: "Building Modern React Applications with TypeScript",
      excerpt: "Learn how to create scalable React applications using TypeScript, modern hooks, and best practices for component architecture.",
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
      },
      status: "published" as const
    },
    {
      id: "2",
      title: "Understanding Web Accessibility: A Developer's Guide",
      excerpt: "A comprehensive guide to implementing accessibility features in web applications, ensuring your content reaches everyone.",
      tags: ["Accessibility", "Web Development", "UX", "Frontend"],
      publishedAt: "2024-01-10",
      readTime: 12,
      author: {
        name: "Sarah Chen",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 67,
        comments: 8
      },
      status: "published" as const
    },
    {
      id: "3",
      title: "The Future of JavaScript: ES2024 Features",
      excerpt: "Explore the latest JavaScript features coming in ES2024. From new syntax to improved performance and developer experience.",
      coverImage: techImageUrl,
      tags: ["JavaScript", "ES2024", "Frontend", "Programming"],
      publishedAt: "2024-01-03",
      readTime: 10,
      author: {
        name: "Sarah Chen",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 156,
        comments: 32
      },
      status: "published" as const
    },
    {
      id: "4",
      title: "Advanced React Patterns (Draft)",
      excerpt: "Deep dive into advanced React patterns including compound components, render props, and custom hooks.",
      tags: ["React", "Advanced", "Patterns"],
      publishedAt: "2024-01-18",
      readTime: 15,
      author: {
        name: "Sarah Chen",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 0,
        comments: 0
      },
      status: "draft" as const
    },
    {
      id: "5",
      title: "Component Testing Strategies (Draft)",
      excerpt: "Best practices for testing React components with Jest and React Testing Library.",
      tags: ["Testing", "React", "Jest"],
      publishedAt: "2024-01-20",
      readTime: 8,
      author: {
        name: "Sarah Chen",
        avatar: devAvatarUrl
      },
      stats: {
        likes: 0,
        comments: 0
      },
      status: "draft" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UserProfile
        user={mockUser}
        posts={mockPosts}
        onEditProfile={() => console.log('Edit profile clicked')}
        onFollow={() => console.log('Follow/unfollow clicked')}
        onPostClick={(id) => console.log('Post clicked:', id)}
        onTagClick={(tag) => console.log('Tag clicked:', tag)}
      />
      
      {/* Example of non-own profile */}
      <div className="mt-16 border-t pt-16">
        <UserProfile
          user={{
            ...mockUser,
            name: "Marcus Williams",
            avatar: writerAvatarUrl,
            bio: "Content creator and remote work advocate. Helping teams build better work cultures.",
            isOwnProfile: false,
            stats: {
              posts: 15,
              followers: 890,
              following: 150
            }
          }}
          posts={mockPosts.filter(post => post.status === 'published').slice(0, 2)}
          onFollow={() => console.log('Follow clicked')}
          onPostClick={(id) => console.log('Post clicked:', id)}
          onTagClick={(tag) => console.log('Tag clicked:', tag)}
          isFollowing={false}
        />
      </div>
    </div>
  );
}