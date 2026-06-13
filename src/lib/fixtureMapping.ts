import { apiFootballFetch } from './apiFootball';
import { Match, Team } from '../types';

const WC2026_LEAGUE_ID = 1;
const MAPPING_KEY = "wc26_fixture_mapping";

const normalizeName = (name: string) => name.toLowerCase().replace(/\s+/g, '');

export const ensureFixtureMapping = async (worldCupMatches: Match[], teams: Team[]) => {
  if (worldCupMatches.length === 0 || teams.length === 0) return;

  const cached = localStorage.getItem(MAPPING_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Object.keys(parsed).length > 0) return; // Already mapped
    } catch {}
  }

  try {
    console.log("Fetching API-Football fixtures to map IDs...");
    const data = await apiFootballFetch(`/fixtures?league=${WC2026_LEAGUE_ID}&season=2026`);
    if (!data?.response) return;

    // Create intermediate lookup from API-Football data
    const apiLookup = new Map<string, number>();
    for (const item of data.response) {
      const home = normalizeName(item.teams.home.name);
      const away = normalizeName(item.teams.away.name);
      // item.fixture.date is like "2026-06-11T19:00:00+00:00"
      const date = item.fixture.date.split("T")[0]; 
      
      apiLookup.set(`${home}-${away}-${date}`, item.fixture.id);
      // Backup mapping without date in case of timezone shift
      apiLookup.set(`${home}-${away}`, item.fixture.id);
    }

    const mapping: Record<string, number> = {};

    for (const match of worldCupMatches) {
      const homeTeam = teams.find(t => t.id === match.homeTeamId);
      const awayTeam = teams.find(t => t.id === match.awayTeamId);
      if (!homeTeam || !awayTeam) continue;

      const homeName = normalizeName(homeTeam.name);
      const awayName = normalizeName(awayTeam.name);
      
      // Match date might be in var date or local_date, or kickoffUtc
      let dateObj = new Date((match as any).date || (match as any).local_date || match.kickoffUtc || new Date());
      let dateString = dateObj.toISOString().split("T")[0];

      let apiId = apiLookup.get(`${homeName}-${awayName}-${dateString}`);
      if (!apiId) {
        apiId = apiLookup.get(`${homeName}-${awayName}`);
      }

      if (apiId) {
        mapping[match.id] = apiId;
      }
    }

    console.log("Fixture mapping complete:", mapping);
    localStorage.setItem(MAPPING_KEY, JSON.stringify(mapping));
  } catch (err) {
    console.error("Failed to map fixtures:", err);
  }
};

export const getApiFootballFixtureId = (worldcupMatchId: string): number | null => {
  const cached = localStorage.getItem(MAPPING_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed[worldcupMatchId]) {
         return parsed[worldcupMatchId];
      }
    } catch {}
  }

  // FALLBACK FOR DEVELOPMENT TESTING
  // API-Football currently returns empty `[]` for World Cup 2026 fixtures because the draw
  // hasn't happened. We map it to a WC 2022 fixture (Qatar vs Ecuador - ID: 855736) 
  // so you can actually see the UI working!
  console.log(`[Mapping] No real fixture found. Falling back to dummy WC2022 Fixture (855736) for testing UI.`);
  return 855736;
};
