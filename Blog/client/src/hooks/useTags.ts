import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Tag, InsertTag } from '@shared/schema';

export function useTags() {
  return useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation<Tag, Error, InsertTag>({
    mutationFn: (tag) => 
      apiRequest('POST', '/api/tags', tag).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
    },
  });
}