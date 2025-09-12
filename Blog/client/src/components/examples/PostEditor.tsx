import PostEditor from '../PostEditor';
import techImageUrl from '@assets/generated_images/Tech_blog_cover_image_553b51f6.png';

export default function PostEditorExample() {
  //todo: remove mock functionality
  const mockInitialData = {
    title: "Building Modern React Applications with TypeScript",
    content: "## Introduction\n\nTypeScript has become an essential tool for building robust React applications. In this comprehensive guide, we'll explore the best practices and patterns that will help you create scalable, maintainable applications.\n\n### Getting Started\n\nFirst, let's set up our development environment with the latest tools and configurations...\n\n### Key Benefits\n\n- **Type Safety**: Catch errors at compile time\n- **Better Developer Experience**: Enhanced IDE support\n- **Maintainability**: Easier refactoring and code understanding\n\n### Conclusion\n\nTypeScript and React make a powerful combination for modern web development.",
    excerpt: "Learn how to create scalable React applications using TypeScript, modern hooks, and best practices for component architecture.",
    tags: ["React", "TypeScript", "Frontend", "JavaScript"],
    coverImage: techImageUrl,
    status: "draft" as const
  };

  const handleSave = (data: any) => {
    console.log('Saving post:', data);
    alert('Post saved as draft!');
  };

  const handlePublish = (data: any) => {
    console.log('Publishing post:', data);
    alert('Post published successfully!');
  };

  const handlePreview = (data: any) => {
    console.log('Previewing post:', data);
    alert('Opening preview...');
  };

  return (
    <div className="min-h-screen bg-background">
      <PostEditor
        initialData={mockInitialData}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
      />
    </div>
  );
}