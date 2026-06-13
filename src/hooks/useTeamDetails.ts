import { useQuery } from '@tanstack/react-query';
import { wc26Api } from '../lib/wc26Api';

export function useTeamDetails(teamId: string | null) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => wc26Api.getTeam(teamId as string),
    enabled: !!teamId,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
