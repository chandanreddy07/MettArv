import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { User, UserWithStats, UpdateUser } from '@shared/schema';

export function useUser(id?: string) {
  return useQuery<UserWithStats>({
    queryKey: ['/api/users', id],
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; data: UpdateUser }>({
    mutationFn: ({ id, data }) => 
      apiRequest('PATCH', `/api/users/${id}`, data).then(res => res.json()),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', updatedUser.id] });
    },
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation<{ followed: boolean }, Error, string>({
    mutationFn: (userId) => 
      apiRequest('POST', `/api/users/${userId}/follow`).then(res => res.json()),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation<{ unfollowed: boolean }, Error, string>({
    mutationFn: (userId) => 
      apiRequest('DELETE', `/api/users/${userId}/follow`).then(res => res.json()),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });
}

export function useSearchUsers(query: string, limit?: number) {
  const queryParams = new URLSearchParams();
  queryParams.append('q', query);
  if (limit) queryParams.append('limit', limit.toString());

  return useQuery<User[]>({
    queryKey: ['/api/search/users', { q: query, limit }],
    enabled: query.length > 0,
  });
}