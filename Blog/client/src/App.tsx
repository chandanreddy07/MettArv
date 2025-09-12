import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BlogApp from "@/components/BlogApp";
import NotFound from "@/pages/not-found";

// Component examples for development
import BlogHeaderExample from "@/components/examples/BlogHeader";
import PostCardExample from "@/components/examples/PostCard";
import PostFeedExample from "@/components/examples/PostFeed";
import AuthFormExample from "@/components/examples/AuthForm";
import PostEditorExample from "@/components/examples/PostEditor";
import UserProfileExample from "@/components/examples/UserProfile";
import PostDetailExample from "@/components/examples/PostDetail";

function Router() {
  return (
    <Switch>
      {/* Main Blog Application */}
      <Route path="/" component={BlogApp} />
      
      {/* Component Examples for Development */}
      <Route path="/examples/header" component={BlogHeaderExample} />
      <Route path="/examples/post-card" component={PostCardExample} />
      <Route path="/examples/post-feed" component={PostFeedExample} />
      <Route path="/examples/auth" component={AuthFormExample} />
      <Route path="/examples/editor" component={PostEditorExample} />
      <Route path="/examples/profile" component={UserProfileExample} />
      <Route path="/examples/post-detail" component={PostDetailExample} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
