import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { PostWithAuthor, InsertPost, UpdatePost } from '@shared/schema';

interface PostsQueryParams {
  author?: string;
  status?: string;
  tag?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export function usePosts(params?: PostsQueryParams) {
  const queryParams = new URLSearchParams();
  if (params?.author) queryParams.append('author', params.author);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.tag) queryParams.append('tag', params.tag);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const queryString = queryParams.toString();
  const url = queryString ? `/api/posts?${queryString}` : '/api/posts';

  return useQuery<PostWithAuthor[]>({
    queryKey: [url],
  });
}

export function usePost(id?: string) {
  return useQuery<PostWithAuthor>({
    queryKey: ['/api/posts', id],
    enabled: !!id,
  });
}

export function usePostBySlug(slug?: string) {
  return useQuery<PostWithAuthor>({
    queryKey: ['/api/posts/slug', slug],
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<PostWithAuthor, Error, InsertPost>({
    mutationFn: (post) => 
      apiRequest('POST', '/api/posts', post).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<PostWithAuthor, Error, { id: string; data: UpdatePost }>({
    mutationFn: ({ id, data }) => 
      apiRequest('PATCH', `/api/posts/${id}`, data).then(res => res.json()),
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts', updatedPost.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => 
      apiRequest('DELETE', `/api/posts/${id}`).then(() => {}),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts', postId] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation<{ liked: boolean }, Error, string>({
    mutationFn: (postId) => 
      apiRequest('POST', `/api/posts/${postId}/like`).then(res => res.json()),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts', postId] });
    },
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation<{ unliked: boolean }, Error, string>({
    mutationFn: (postId) => 
      apiRequest('DELETE', `/api/posts/${postId}/like`).then(res => res.json()),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/posts', postId] });
    },
  });
}