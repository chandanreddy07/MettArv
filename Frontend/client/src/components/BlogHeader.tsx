import { Search, PenTool, User, LogIn, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface BlogHeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name: string;
    avatar?: string;
  };
  onCreatePost?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

export default function BlogHeader({
  isAuthenticated = false,
  user,
  onCreatePost,
  onLogin,
  onLogout,
  onSearch
}: BlogHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    console.log("Search triggered:", searchQuery);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    console.log("Dark mode toggled:", !darkMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <PenTool className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">BlogCraft</h1>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-testid="input-search"
              type="search"
              placeholder="Search posts, authors, or tags..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <Button
            data-testid="button-theme-toggle"
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAuthenticated ? (
            <>
              {/* Create Post Button */}
              <Button
                data-testid="button-create-post"
                onClick={() => {
                  onCreatePost?.();
                  console.log("Create post clicked");
                }}
                className="hidden sm:flex"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Write
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    data-testid="button-user-menu"
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name || "User"}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    data-testid="menu-item-profile"
                    onClick={() => console.log("Profile clicked")}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    data-testid="menu-item-posts"
                    onClick={() => console.log("My posts clicked")}
                  >
                    My Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    data-testid="menu-item-drafts"
                    onClick={() => console.log("Drafts clicked")}
                  >
                    Drafts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    data-testid="menu-item-logout"
                    onClick={() => {
                      onLogout?.();
                      console.log("Logout clicked");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              data-testid="button-login"
              onClick={() => {
                onLogin?.();
                console.log("Login clicked");
              }}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}

          {/* Mobile Menu */}
          <Button
            data-testid="button-mobile-menu"
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => console.log("Mobile menu clicked")}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}