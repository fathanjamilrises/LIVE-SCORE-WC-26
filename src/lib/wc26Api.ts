// @ts-ignore
const BASE_URL = import.meta.env.VITE_WC26_BASE_URL || process.env.VITE_WC26_BASE_URL;
// @ts-ignore
const TOKEN = import.meta.env.VITE_WC26_TOKEN || process.env.VITE_WC26_TOKEN;

async function fetchWithAuth(endpoint: string) {
  if (!BASE_URL || !TOKEN) {
    throw new Error("VITE_WC26_BASE_URL dan VITE_WC26_TOKEN harus dikonfigurasi di file .env");
  }

  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
         throw new Error("Unauthorized: Periksa token VITE_WC26_TOKEN anda.");
      }
      if (response.status === 429) {
         throw new Error("Too Many Requests: Anda telah mencapai batas rate limit API.");
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Fetch API Error (${endpoint}):`, error);
    throw error;
  }
}

export const wc26Api = {
  getTeams: () => fetchWithAuth('/get/teams'),
  getTeamsByGroup: (group: string) => fetchWithAuth(`/get/teams/?group=${group}`),
  getTeam: (id: string) => fetchWithAuth(`/get/team/${id}`),
  getGroups: () => fetchWithAuth('/get/groups'),
  getGroup: (name: string) => fetchWithAuth(`/get/group/?name=${name}`),
  getGames: () => fetchWithAuth('/get/games'),
  getGame: (id: string) => fetchWithAuth(`/get/game/${id}`),
  getStadiums: () => fetchWithAuth('/get/stadiums')
};
