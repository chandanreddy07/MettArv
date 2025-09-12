import PostDetail from '../PostDetail';
import techImageUrl from '@assets/generated_images/Tech_blog_cover_image_553b51f6.png';
import workspaceImageUrl from '@assets/generated_images/Blog_workspace_cover_image_1fda9668.png';
import devAvatarUrl from '@assets/generated_images/Developer_profile_avatar_5119a3ce.png';
import writerAvatarUrl from '@assets/generated_images/Writer_profile_avatar_6ea7b8b9.png';

export default function PostDetailExample() {
  //todo: remove mock functionality
  const mockPost = {
    id: "1",
    title: "Building Modern React Applications with TypeScript",
    content: "## Introduction\n\nTypeScript has become an essential tool for building robust React applications. In this comprehensive guide, we'll explore the best practices and patterns that will help you create scalable, maintainable applications.\n\n### Getting Started\n\nFirst, let's set up our development environment with the latest tools and configurations. TypeScript integration with React has never been easier, thanks to modern build tools and excellent tooling support.\n\n### Key Benefits\n\n- **Type Safety**: Catch errors at compile time rather than runtime\n- **Better Developer Experience**: Enhanced IDE support with autocomplete and refactoring\n- **Maintainability**: Easier refactoring and code understanding for large teams\n- **Documentation**: Types serve as living documentation for your components\n\n### Best Practices\n\nWhen building React applications with TypeScript, follow these proven patterns:\n\n**Component Props**: Always define clear interfaces for your component props. This makes your components more predictable and easier to use.\n\n**Custom Hooks**: Leverage TypeScript's generic types to create reusable custom hooks that work with different data types while maintaining type safety.\n\n**State Management**: Whether you're using Context API, Redux, or other state management solutions, TypeScript helps you maintain consistent state shapes across your application.\n\n### Conclusion\n\nTypeScript and React make a powerful combination for modern web development. The initial setup time is quickly recovered through reduced debugging time and improved developer confidence.",
    coverImage: techImageUrl,
    tags: ["React", "TypeScript", "Frontend", "JavaScript", "Web Development"],
    publishedAt: "2024-01-15",
    readTime: 8,
    author: {
      id: "author-1",
      name: "Sarah Chen",
      avatar: devAvatarUrl,
      bio: "Senior Frontend Developer & Technical Writer"
    },
    stats: {
      likes: 142,
      comments: 23
    },
    isOwnPost: true
  };

  const mockRelatedPosts = [
    {
      id: "2",
      title: "Understanding Web Accessibility: A Developer's Guide",
      excerpt: "A comprehensive guide to implementing accessibility features in web applications, ensuring your content reaches everyone.",
      coverImage: undefined,
      author: {
        name: "Jordan Taylor",
        avatar: devAvatarUrl
      },
      readTime: 12
    },
    {
      id: "3",
      title: "The Art of Remote Work: Finding Balance",
      excerpt: "Discover strategies for maintaining productivity and work-life balance while working remotely.",
      coverImage: workspaceImageUrl,
      author: {
        name: "Marcus Williams",
        avatar: writerAvatarUrl
      },
      readTime: 5
    },
    {
      id: "4",
      title: "CSS Grid vs Flexbox: When to Use What",
      excerpt: "A detailed comparison of CSS Grid and Flexbox layout systems for optimal web layouts.",
      coverImage: techImageUrl,
      author: {
        name: "Alex Kim",
        avatar: devAvatarUrl
      },
      readTime: 6
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PostDetail
        post={mockPost}
        relatedPosts={mockRelatedPosts}
        onBack={() => console.log('Back to posts')}
        onEdit={() => console.log('Edit post')}
        onAuthorClick={(id) => console.log('Author clicked:', id)}
        onTagClick={(tag) => console.log('Tag clicked:', tag)}
        onRelatedPostClick={(id) => console.log('Related post clicked:', id)}
      />
    </div>
  );
}