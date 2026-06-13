import { useQuery } from '@tanstack/react-query';
import { fetchBatchedFixtures, apiFootballFetch } from '../lib/apiFootball';
import { getQuotaInfo } from '../lib/requestBudget';
import { getApiFootballFixtureId } from '../lib/fixtureMapping';

export function useMatchLineup(worldcupMatchId: string | null, matchStatus?: string, fixtureDate?: string) {
  // calculate if kickoff is > 1 hour away
  const isFarScheduled = () => {
    if (matchStatus !== 'scheduled' || !fixtureDate) return false;
    const kickoff = new Date(fixtureDate).getTime();
    const now = new Date().getTime();
    return (kickoff - now) > 60 * 60 * 1000;
  };

  return useQuery({
    queryKey: ['lineup', worldcupMatchId],
    queryFn: async () => {
      if (!worldcupMatchId) return null;
      const apiFootballId = getApiFootballFixtureId(worldcupMatchId);
      if (!apiFootballId) {
        console.log(`[Mapping] worldcup2026MatchId: ${worldcupMatchId} -> apiFootballFixtureId: null (Not Mapped)`);
        return null;
      }
      
      const data = await apiFootballFetch(`/fixtures/lineups?fixture=${apiFootballId}`);
      console.log(`[Mapping] worldcup2026MatchId: ${worldcupMatchId} -> apiFootballFixtureId: ${apiFootballId} | Lineups found: ${data?.response?.length || 0}`);
      return data?.response || [];
    },
    enabled: !!worldcupMatchId && !isFarScheduled(),
    staleTime: (query) => {
      const data: any = query.state.data;
      if (data && data.length === 2 && data[0].startXI?.length > 0 && data[1].startXI?.length > 0) {
        return Infinity;
      }
      return 10 * 60 * 1000;
    },
    gcTime: Infinity,
  });
}

export function useMatchStats(worldcupMatchId: string | null, isLive: boolean) {
  return useQuery({
    queryKey: ['stats', worldcupMatchId],
    queryFn: async () => {
      if (!worldcupMatchId) return null;
      const apiFootballId = getApiFootballFixtureId(worldcupMatchId);
      if (!apiFootballId) {
        console.log(`[Mapping-Stats] worldcup2026MatchId: ${worldcupMatchId} -> apiFootballFixtureId: null (Not Mapped)`);
        return null;
      }

      const data = await apiFootballFetch(`/fixtures/statistics?fixture=${apiFootballId}`);
      console.log(`[Fetch-Stats] Fixture ${apiFootballId} | Stats length: ${data?.response?.length || 0}`);
      return data?.response || [];
    },
    enabled: !!worldcupMatchId,
    staleTime: isLive ? 15 * 60 * 1000 : Infinity,
    gcTime: Infinity,
    refetchInterval: (query) => {
      if (!isLive) return false;
      const quota = getQuotaInfo();
      if (quota.used >= 90) return false; // Stop polling if budget low
      return 15 * 60 * 1000; // 15 mins if live and budget OK
    },
  });
}

export function useMatchEvents(worldcupMatchId: string | null, status: string | undefined) {
  const isFinished = status === 'finished' || status === 'ft' || status === 'aet' || status === 'pen';
  const isScheduled = status === 'scheduled' || status === 'ns' || status === 'tbd';
  const isLive = status === 'live' || status === 'ht' || status === 'et' || status === '1h' || status === '2h';
  
  return useQuery({
    queryKey: ['events', worldcupMatchId],
    queryFn: async () => {
      if (!worldcupMatchId) return null;
      const apiFootballId = getApiFootballFixtureId(worldcupMatchId);
      if (!apiFootballId) {
        console.log(`[Mapping-Events] worldcup2026MatchId: ${worldcupMatchId} -> apiFootballFixtureId: null (Not Mapped)`);
        return null;
      }

      const data = await apiFootballFetch(`/fixtures/events?fixture=${apiFootballId}`);
      console.log(`[Fetch-Events] Fixture ${apiFootballId} | Events length: ${data?.response?.length || 0}`);
      return data?.response || [];
    },
    enabled: !!worldcupMatchId && !isScheduled,
    staleTime: isFinished ? Infinity : isLive ? 15 * 60 * 1000 : 5 * 60 * 1000,
    gcTime: Infinity,
    refetchInterval: (query) => {
      if (!isLive) return false;
      const quota = getQuotaInfo();
      if (quota.remaining < 20) return false;
      return 15 * 60 * 1000;
    },
  });
}
