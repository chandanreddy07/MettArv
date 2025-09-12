import { useState } from "react";
import BlogHeader from "./BlogHeader";
import PostFeed from "./PostFeed";
import PostDetail from "./PostDetail";
import UserProfile from "./UserProfile";
import PostEditor from "./PostEditor";
import AuthForm from "./AuthForm";
import workspaceImageUrl from '@assets/generated_images/Blog_workspace_cover_image_1fda9668.png';
import techImageUrl from '@assets/generated_images/Tech_blog_cover_image_553b51f6.png';
import devAvatarUrl from '@assets/generated_images/Developer_profile_avatar_5119a3ce.png';
import writerAvatarUrl from '@assets/generated_images/Writer_profile_avatar_6ea7b8b9.png';

type ViewType = "feed" | "post" | "profile" | "editor" | "auth";

interface AppState {
  currentView: ViewType;
  selectedPostId?: string;
  selectedUserId?: string;
  editingPostId?: string;
  authMode: "login" | "register";
  isAuthenticated: boolean;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
  };
}

export default function BlogApp() {
  //todo: remove mock functionality
  const [appState, setAppState] = useState<AppState>({
    currentView: "feed",
    authMode: "login",
    isAuthenticated: true, // Start as authenticated for demo
    currentUser: {
      id: "user-1",
      name: "Sarah Chen",
      avatar: devAvatarUrl,
      email: "sarah@example.com"
    }
  });

  // Mock data
  const mockPosts = [
    {
      id: "1",
      title: "Building Modern React Applications with TypeScript",
      excerpt: "Learn how to create scalable React applications using TypeScript, modern hooks, and best practices for component architecture. This comprehensive guide covers everything from setup to deployment.",
      content: "## Introduction\n\nTypeScript has become an essential tool for building robust React applications. In this comprehensive guide, we'll explore the best practices and patterns that will help you create scalable, maintainable applications.\n\n### Getting Started\n\nFirst, let's set up our development environment with the latest tools and configurations...\n\n### Key Benefits\n\n- **Type Safety**: Catch errors at compile time\n- **Better Developer Experience**: Enhanced IDE support\n- **Maintainability**: Easier refactoring and code understanding\n\n### Conclusion\n\nTypeScript and React make a powerful combination for modern web development.",
      coverImage: techImageUrl,
      tags: ["React", "TypeScript", "Frontend", "JavaScript"],
      publishedAt: "2024-01-15",
      readTime: 8,
      author: {
        id: "user-1",
        name: "Sarah Chen",
        avatar: devAvatarUrl,
        bio: "Senior Frontend Developer & Technical Writer"
      },
      stats: {
        likes: 142,
        comments: 23
      },
      status: "published" as const
    },
    {
      id: "2",
      title: "The Art of Remote Work: Finding Balance in a Digital World",
      excerpt: "Discover strategies for maintaining productivity and work-life balance while working remotely. Tips from seasoned remote workers and digital nomads.",
      content: "## Remote Work Revolution\n\nThe pandemic accelerated the remote work revolution, but many are still learning how to thrive in this new environment...\n\n### Creating Boundaries\n\nOne of the biggest challenges is creating clear boundaries between work and personal life...",
      coverImage: workspaceImageUrl,
      tags: ["Remote Work", "Productivity", "Lifestyle", "Career"],
      publishedAt: "2024-01-12",
      readTime: 5,
      author: {
        id: "user-2",
        name: "Marcus Williams",
        avatar: writerAvatarUrl,
        bio: "Content creator and remote work advocate"
      },
      stats: {
        likes: 89,
        comments: 15
      },
      status: "published" as const
    },
    {
      id: "3",
      title: "Understanding Web Accessibility: A Developer's Guide",
      excerpt: "A comprehensive guide to implementing accessibility features in web applications, ensuring your content reaches everyone. Learn WCAG guidelines and practical implementation tips.",
      content: "## Why Accessibility Matters\n\nWeb accessibility ensures that websites and web applications are usable by people with disabilities...\n\n### WCAG Guidelines\n\nThe Web Content Accessibility Guidelines provide the foundation...",
      tags: ["Accessibility", "Web Development", "UX", "Frontend"],
      publishedAt: "2024-01-10",
      readTime: 12,
      author: {
        id: "user-3",
        name: "Jordan Taylor",
        avatar: devAvatarUrl,
        bio: "UX Engineer specializing in accessibility"
      },
      stats: {
        likes: 67,
        comments: 8
      },
      status: "published" as const
    }
  ];

  const mockUsers = [
    {
      id: "user-1",
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
    },
    {
      id: "user-2",
      name: "Marcus Williams",
      avatar: writerAvatarUrl,
      bio: "Content creator and remote work advocate. Helping teams build better work cultures.",
      location: "Austin, TX",
      website: "https://marcuswrites.com",
      joinedAt: "2021-08-20",
      isOwnProfile: false,
      stats: {
        posts: 15,
        followers: 890,
        following: 150
      }
    }
  ];

  // Navigation handlers
  const navigateToFeed = () => {
    setAppState(prev => ({ ...prev, currentView: "feed" }));
  };

  const navigateToPost = (postId: string) => {
    setAppState(prev => ({ ...prev, currentView: "post", selectedPostId: postId }));
  };

  const navigateToProfile = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setAppState(prev => ({ 
        ...prev, 
        currentView: "profile", 
        selectedUserId: userId
      }));
    }
  };

  const navigateToEditor = (postId?: string) => {
    setAppState(prev => ({ 
      ...prev, 
      currentView: "editor", 
      editingPostId: postId 
    }));
  };

  const navigateToAuth = (mode: "login" | "register" = "login") => {
    setAppState(prev => ({ 
      ...prev, 
      currentView: "auth", 
      authMode: mode,
      isAuthenticated: false
    }));
  };

  // Auth handlers
  const handleLogin = (data: { email: string; password: string; name?: string }) => {
    console.log('Login attempt:', data);
    // Simulate successful login
    setAppState(prev => ({
      ...prev,
      isAuthenticated: true,
      currentView: "feed",
      currentUser: {
        id: "user-1",
        name: data.name || "User",
        email: data.email,
        avatar: devAvatarUrl
      }
    }));
  };

  const handleLogout = () => {
    setAppState(prev => ({
      ...prev,
      isAuthenticated: false,
      currentUser: undefined,
      currentView: "auth"
    }));
  };

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    // Simulate Google login
    setAppState(prev => ({
      ...prev,
      isAuthenticated: true,
      currentView: "feed",
      currentUser: {
        id: "user-google",
        name: "Google User",
        email: "user@gmail.com",
        avatar: devAvatarUrl
      }
    }));
  };

  // Content handlers
  const handleSearch = (query: string) => {
    console.log('Search:', query);
    // In a real app, this would filter posts or navigate to search results
  };

  const handleSavePost = (data: any) => {
    console.log('Saving post:', data);
    alert('Post saved as draft!');
  };

  const handlePublishPost = (data: any) => {
    console.log('Publishing post:', data);
    alert('Post published successfully!');
    navigateToFeed();
  };

  // Get current data based on view
  const getCurrentPost = () => {
    if (appState.selectedPostId) {
      const post = mockPosts.find(p => p.id === appState.selectedPostId);
      if (post) {
        return {
          ...post,
          isOwnPost: post.author.id === appState.currentUser?.id
        };
      }
    }
    return null;
  };

  const getCurrentUser = () => {
    if (appState.selectedUserId) {
      const user = mockUsers.find(u => u.id === appState.selectedUserId);
      if (user) {
        return {
          ...user,
          isOwnProfile: user.id === appState.currentUser?.id
        };
      }
    }
    return null;
  };

  const getUserPosts = (userId: string) => {
    return mockPosts.filter(post => post.author.id === userId);
  };

  const getRelatedPosts = (currentPostId: string) => {
    const currentPost = mockPosts.find(p => p.id === currentPostId);
    if (!currentPost) return [];
    
    return mockPosts
      .filter(post => post.id !== currentPostId)
      .filter(post => 
        post.tags.some(tag => currentPost.tags.includes(tag)) ||
        post.author.id === currentPost.author.id
      )
      .slice(0, 3)
      .map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        author: {
          name: post.author.name,
          avatar: post.author.avatar
        },
        readTime: post.readTime
      }));
  };

  // Render content based on current view
  const renderContent = () => {
    if (!appState.isAuthenticated) {
      return (
        <AuthForm
          mode={appState.authMode}
          onSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onModeChange={(mode) => setAppState(prev => ({ ...prev, authMode: mode }))}
        />
      );
    }

    switch (appState.currentView) {
      case "feed":
        return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Latest Posts</h1>
              <p className="text-muted-foreground">Discover amazing content from our community</p>
            </div>
            <PostFeed
              posts={mockPosts}
              onPostClick={navigateToPost}
              onAuthorClick={navigateToProfile}
              onTagClick={(tag) => console.log('Tag clicked:', tag)}
              onLoadMore={() => console.log('Load more posts')}
              hasMore={true}
            />
          </div>
        );

      case "post":
        const currentPost = getCurrentPost();
        if (!currentPost) {
          navigateToFeed();
          return null;
        }
        return (
          <PostDetail
            post={currentPost}
            relatedPosts={getRelatedPosts(currentPost.id)}
            onBack={navigateToFeed}
            onEdit={() => navigateToEditor(currentPost.id)}
            onAuthorClick={navigateToProfile}
            onTagClick={(tag) => console.log('Tag clicked:', tag)}
            onRelatedPostClick={navigateToPost}
          />
        );

      case "profile":
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigateToFeed();
          return null;
        }
        return (
          <UserProfile
            user={currentUser}
            posts={getUserPosts(currentUser.id)}
            onEditProfile={() => console.log('Edit profile')}
            onFollow={() => console.log('Follow/unfollow')}
            onPostClick={navigateToPost}
            onTagClick={(tag) => console.log('Tag clicked:', tag)}
          />
        );

      case "editor":
        const editingPost = appState.editingPostId ? 
          mockPosts.find(p => p.id === appState.editingPostId) : null;
        
        return (
          <PostEditor
            initialData={editingPost ? {
              title: editingPost.title,
              content: editingPost.content,
              excerpt: editingPost.excerpt,
              tags: editingPost.tags,
              coverImage: editingPost.coverImage,
              status: editingPost.status
            } : undefined}
            onSave={handleSavePost}
            onPublish={handlePublishPost}
            onPreview={(data) => console.log('Preview:', data)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {appState.isAuthenticated && (
        <BlogHeader
          isAuthenticated={appState.isAuthenticated}
          user={appState.currentUser}
          onCreatePost={() => navigateToEditor()}
          onLogin={() => navigateToAuth("login")}
          onLogout={handleLogout}
          onSearch={handleSearch}
        />
      )}
      {renderContent()}
    </div>
  );
}