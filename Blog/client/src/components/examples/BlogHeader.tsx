import BlogHeader from '../BlogHeader';
import devAvatarUrl from '@assets/generated_images/Developer_profile_avatar_5119a3ce.png';

export default function BlogHeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      {/* Authenticated state */}
      <BlogHeader
        isAuthenticated={true}
        user={{
          name: "Alex Johnson",
          avatar: devAvatarUrl
        }}
        onCreatePost={() => console.log('Create post')}
        onLogin={() => console.log('Login')}
        onLogout={() => console.log('Logout')}
        onSearch={(query) => console.log('Search:', query)}
      />
      
      {/* Content placeholder */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <p className="text-muted-foreground">Blog content would appear here...</p>
      </div>
      
      {/* Non-authenticated state for comparison */}
      <div className="mt-8 border-t pt-8">
        <BlogHeader
          isAuthenticated={false}
          onLogin={() => console.log('Login')}
          onSearch={(query) => console.log('Search:', query)}
        />
      </div>
    </div>
  );
}