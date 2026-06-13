import { getQuotaInfo, incrementQuota } from './requestBudget';

const BASE_URL = 'https://v3.football.api-sports.io';
// @ts-ignore
const API_KEY = import.meta.env.VITE_APIFOOTBALL_KEY || process.env.VITE_APIFOOTBALL_KEY;

export const apiFootballFetch = async (endpoint: string) => {
  if (!API_KEY) {
    console.warn("API-Football Key is missing.");
    return null;
  }
  
  if (!endpoint.startsWith('/status')) {
    const info = getQuotaInfo();
    if (info.remaining <= 0) {
      console.warn("API-Football quota exceeded.");
      return null;
    }
    incrementQuota();
  }
  
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'x-apisports-key': API_KEY,
    }
  });
  
  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status}`);
  }
  
  return await res.json();
};

const pendingStatsReqs = new Set<string>();
let statsTimeout: any = null;
const statsResolvers = new Map<string, {resolve: Function, reject: Function}[]>();

export const fetchBatchedFixtures = async (fixtureId: string): Promise<any> => {
   return new Promise((resolve, reject) => {
      if (!statsResolvers.has(fixtureId)) {
         statsResolvers.set(fixtureId, []);
         pendingStatsReqs.add(fixtureId);
      }
      statsResolvers.get(fixtureId)!.push({resolve, reject});
      
      if (!statsTimeout) {
         statsTimeout = setTimeout(async () => {
             const ids = Array.from(pendingStatsReqs).join('-');
             pendingStatsReqs.clear();
             statsTimeout = null;
             
             if (!ids) return;
             
             try {
                 const data = await apiFootballFetch(`/fixtures?ids=${ids}`);
                 const responseArr = data?.response || [];
                 
                 const resMap = new Map();
                 responseArr.forEach((fixt: any) => {
                     // Store using string representation of ID
                     resMap.set(String(fixt.fixture.id), fixt);
                 });
                 
                 const currentResolvers = new Map(statsResolvers);
                 statsResolvers.clear();
                 
                 for (const [id, resolvers] of currentResolvers.entries()) {
                     const fixtData = resMap.get(String(id));
                     resolvers.forEach(r => r.resolve(fixtData || null));
                 }
             } catch (err) {
                 const currentResolvers = new Map(statsResolvers);
                 statsResolvers.clear();
                 for (const [id, resolvers] of currentResolvers.entries()) {
                     resolvers.forEach(r => r.reject(err));
                 }
             }
         }, 50); // 50ms batching window
      }
   });
};
