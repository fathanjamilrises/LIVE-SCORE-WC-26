import { useQuery } from '@tanstack/react-query';
import { wc26Api } from '../lib/wc26Api';

export function useStadiums() {
  return useQuery({
    queryKey: ['stadiums'],
    queryFn: wc26Api.getStadiums,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
