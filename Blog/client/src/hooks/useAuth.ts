import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/auth/user'],
    retry: false, // Don't retry auth requests
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/auth/logout'),
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data on logout
      window.location.href = '/api/auth/login'; // Redirect to login
    },
  });

  // Send email verification
  const sendVerificationMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/auth/send-verification'),
  });

  // Verify email
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => 
      apiRequest('POST', '/api/auth/verify-email', { token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    sendVerification: sendVerificationMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    isSendingVerification: sendVerificationMutation.isPending,
    isVerifyingEmail: verifyEmailMutation.isPending,
  };
}