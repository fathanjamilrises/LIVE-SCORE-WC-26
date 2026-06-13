import { useQuery } from '@tanstack/react-query';
import { wc26Api } from '../lib/wc26Api';

export function useGroupStandings() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: wc26Api.getGroups,
    staleTime: 30 * 60 * 1000, // cache for 30 minutes
  });
}
