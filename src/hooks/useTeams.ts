import { useQuery } from '@tanstack/react-query';
import { wc26Api } from '../lib/wc26Api';

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: wc26Api.getTeams,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
