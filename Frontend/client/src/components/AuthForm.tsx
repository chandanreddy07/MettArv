import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PenTool, Mail, Lock, User, Chrome, AlertCircle, CheckCircle } from "lucide-react";

interface AuthFormProps {
  mode?: "login" | "register";
  onSubmit?: (data: { email: string; password: string; name?: string }) => void;
  onGoogleLogin?: () => void;
  onModeChange?: (mode: "login" | "register") => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
}

export default function AuthForm({
  mode = "login",
  onSubmit,
  onGoogleLogin,
  onModeChange,
  isLoading = false,
  error,
  success
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isLogin = mode === "login";

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        errors.name = "Name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      email: formData.email,
      password: formData.password,
      ...(mode === "register" && { name: formData.name })
    };

    onSubmit?.(submitData);
    console.log(`${mode} form submitted:`, submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <PenTool className="h-8 w-8 text-primary mr-2" />
            <span className="text-2xl font-bold">BlogCraft</span>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Sign in to your account to continue writing"
              : "Join our community of writers and readers"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onGoogleLogin?.();
              console.log('Google login clicked');
            }}
            disabled={isLoading}
            data-testid="button-google-login"
          >
            <Chrome className="h-4 w-4 mr-2" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    data-testid="input-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  data-testid="input-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    data-testid="input-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading 
                ? "Loading..." 
                : isLogin 
                  ? "Sign In" 
                  : "Create Account"
              }
            </Button>
          </form>

          {/* Mode Toggle */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                onModeChange?.(isLogin ? "register" : "login");
                console.log(`Switching to ${isLogin ? 'register' : 'login'} mode`);
              }}
              disabled={isLoading}
              data-testid="button-mode-toggle"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}