import { useQuery } from '@tanstack/react-query';
import { wc26Api } from '../lib/wc26Api';

export function useMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: wc26Api.getGames,
    staleTime: 6 * 60 * 60 * 1000,
    refetchInterval: (query) => {
      const data: any = query.state.data;
      const arr = Array.isArray(data) ? data : data?.games || data?.data;
      if (Array.isArray(arr)) {
        const hasUnfinishedMatches = arr.some((match: any) => 
          match.finished === false || String(match.finished).toUpperCase() === 'FALSE'
        );
        // poll 5 minutes if there are live matches
        return hasUnfinishedMatches ? 5 * 60 * 1000 : false;
      }
      return 5 * 60 * 1000;
    },
  });
}
