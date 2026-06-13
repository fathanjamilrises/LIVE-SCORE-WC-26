import { Team, Venue, Match, Player } from "./types";

export const VENUES: Venue[] = [
  { id: "v1", stadiumName: "Estadio Azteca", city: "Mexico City", country: "Mexico", timezone: "CST", capacity: "87,523" },
  { id: "v2", stadiumName: "MetLife Stadium", city: "New York/New Jersey", country: "USA", timezone: "EST", capacity: "82,500" },
  { id: "v3", stadiumName: "BC Place", city: "Vancouver", country: "Canada", timezone: "PST", capacity: "54,500" },
  { id: "v4", stadiumName: "BMO Field", city: "Toronto", country: "Canada", timezone: "EST", capacity: "45,000" },
  { id: "v5", stadiumName: "Estadio BBVA", city: "Monterrey", country: "Mexico", timezone: "CST", capacity: "51,000" },
  { id: "v6", stadiumName: "Estadio Akron", city: "Guadalajara", country: "Mexico", timezone: "CST", capacity: "48,000" },
  { id: "v7", stadiumName: "SoFi Stadium", city: "Los Angeles", country: "USA", timezone: "PST", capacity: "70,240" },
  { id: "v8", stadiumName: "AT&T Stadium", city: "Dallas", country: "USA", timezone: "CST", capacity: "80,000" },
  { id: "v9", stadiumName: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", timezone: "EST", capacity: "71,000" },
  { id: "v10", stadiumName: "Hard Rock Stadium", city: "Miami", country: "USA", timezone: "EST", capacity: "64,767" },
  { id: "v11", stadiumName: "Gillette Stadium", city: "Boston", country: "USA", timezone: "EST", capacity: "65,878" },
  { id: "v12", stadiumName: "NRG Stadium", city: "Houston", country: "USA", timezone: "CST", capacity: "72,220" },
  { id: "v13", stadiumName: "Arrowhead Stadium", city: "Kansas City", country: "USA", timezone: "CST", capacity: "76,416" },
  { id: "v14", stadiumName: "Lincoln Financial Field", city: "Philadelphia", country: "USA", timezone: "EST", capacity: "69,796" },
  { id: "v15", stadiumName: "Levi's Stadium", city: "San Francisco", country: "USA", timezone: "PST", capacity: "68,500" },
  { id: "v16", stadiumName: "Lumen Field", city: "Seattle", country: "USA", timezone: "PST", capacity: "69,000" },
];

export const INITIAL_TEAMS_DATA: Omit<Team, "squad">[] = [
  // Group A
  { id: "team-mex", name: "Mexico", flagCode: "MX", group: "A", fifaRanking: 15, coach: "Javier Aguirre", status: "active" },
  { id: "team-rsa", name: "South Africa", flagCode: "ZA", group: "A", fifaRanking: 59, coach: "Hugo Broos", status: "active" },
  { id: "team-swe", name: "Sweden", flagCode: "SE", group: "A", fifaRanking: 28, coach: "Jon Dahl Tomasson", status: "active" },
  { id: "team-aus", name: "Australia", flagCode: "AU", group: "A", fifaRanking: 24, coach: "Tony Popovic", status: "active" },

  // Group B
  { id: "team-usa", name: "United States", flagCode: "US", group: "B", fifaRanking: 18, coach: "Mauricio Pochettino", status: "active" },
  { id: "team-wal", name: "Wales", flagCode: "GB-WLS", group: "B", fifaRanking: 29, coach: "Craig Bellamy", status: "active" },
  { id: "team-irn", name: "Iran", flagCode: "IR", group: "B", fifaRanking: 19, coach: "Amir Ghalenoei", status: "active" },
  { id: "team-cmr", name: "Cameroon", flagCode: "CM", group: "B", fifaRanking: 49, coach: "Marc Brys", status: "active" },

  // Group C
  { id: "team-can", name: "Canada", flagCode: "CA", group: "C", fifaRanking: 35, coach: "Jesse Marsch", status: "active" },
  { id: "team-per", name: "Peru", flagCode: "PE", group: "C", fifaRanking: 38, coach: "Jorge Fossati", status: "active" },
  { id: "team-aut", name: "Austria", flagCode: "AT", group: "C", fifaRanking: 22, coach: "Ralf Rangnick", status: "active" },
  { id: "team-egy", name: "Egypt", flagCode: "EG", group: "C", fifaRanking: 30, coach: "Hossam Hassan", status: "active" },

  // Group D
  { id: "team-idn", name: "Indonesia", flagCode: "ID", group: "D", fifaRanking: 80, coach: "Shin Tae-yong", status: "active" },
  { id: "team-arg", name: "Argentina", flagCode: "AR", group: "D", fifaRanking: 1, coach: "Lionel Scaloni", status: "active" },
  { id: "team-pol", name: "Poland", flagCode: "PL", group: "D", fifaRanking: 31, coach: "Michał Probierz", status: "active" },
  { id: "team-ksa", name: "Saudi Arabia", flagCode: "SA", group: "D", fifaRanking: 56, coach: "Hervé Renard", status: "active" },

  // Group E
  { id: "team-uru", name: "Uruguay", flagCode: "UY", group: "E", fifaRanking: 11, coach: "Marcelo Bielsa", status: "active" },
  { id: "team-jpn", name: "Japan", flagCode: "JP", group: "E", fifaRanking: 15, coach: "Hajime Moriyasu", status: "active" },
  { id: "team-sen", name: "Senegal", flagCode: "SN", group: "E", fifaRanking: 20, coach: "Pape Thiaw", status: "active" },
  { id: "team-sco", name: "Scotland", flagCode: "GB-SCT", group: "E", fifaRanking: 51, coach: "Steve Clarke", status: "active" },

  // Group F
  { id: "team-bra", name: "Brazil", flagCode: "BR", group: "F", fifaRanking: 5, coach: "Dorival Júnior", status: "active" },
  { id: "team-sui", name: "Switzerland", flagCode: "CH", group: "F", fifaRanking: 15, coach: "Murat Yakin", status: "active" },
  { id: "team-kor", name: "South Korea", flagCode: "KR", group: "F", fifaRanking: 22, coach: "Hong Myung-bo", status: "active" },
  { id: "team-gha", name: "Ghana", flagCode: "GH", group: "F", fifaRanking: 64, coach: "Otto Addo", status: "active" },

  // Group G
  { id: "team-fra", name: "France", flagCode: "FR", group: "G", fifaRanking: 2, coach: "Didier Deschamps", status: "active" },
  { id: "team-mar", name: "Morocco", flagCode: "MA", group: "G", fifaRanking: 13, coach: "Walid Regragui", status: "active" },
  { id: "team-chi", name: "Chile", flagCode: "CL", group: "G", fifaRanking: 40, coach: "Ricardo Gareca", status: "active" },
  { id: "team-irq", name: "Iraq", flagCode: "IQ", group: "G", fifaRanking: 55, coach: "Jesús Casas", status: "active" },

  // Group H
  { id: "team-eng", name: "England", flagCode: "GB-ENG", group: "H", fifaRanking: 4, coach: "Thomas Tuchel", status: "active" },
  { id: "team-ukr", name: "Ukraine", flagCode: "UA", group: "H", fifaRanking: 25, coach: "Serhiy Rebrov", status: "active" },
  { id: "team-alg", name: "Algeria", flagCode: "DZ", group: "H", fifaRanking: 41, coach: "Vladimir Petković", status: "active" },
  { id: "team-nzl", name: "New Zealand", flagCode: "NZ", group: "H", fifaRanking: 94, coach: "Darren Bazeley", status: "active" },

  // Group I
  { id: "team-esp", name: "Spain", flagCode: "ES", group: "I", fifaRanking: 3, coach: "Luis de la Fuente", status: "active" },
  { id: "team-col", name: "Colombia", flagCode: "CO", group: "I", fifaRanking: 10, coach: "Néstor Lorenzo", status: "active" },
  { id: "team-uzb", name: "Uzbekistan", flagCode: "UZ", group: "I", fifaRanking: 58, coach: "Srečko Katanec", status: "active" },
  { id: "team-nga", name: "Nigeria", flagCode: "NG", group: "I", fifaRanking: 36, coach: "Augustine Eguavoen", status: "active" },

  // Group J
  { id: "team-ger", name: "Germany", flagCode: "DE", group: "J", fifaRanking: 11, coach: "Julian Nagelsmann", status: "active" },
  { id: "team-ecu", name: "Ecuador", flagCode: "EC", group: "J", fifaRanking: 27, coach: "Sebastián Beccacece", status: "active" },
  { id: "team-jam", name: "Jamaica", flagCode: "JM", group: "J", fifaRanking: 61, coach: "Steve McClaren", status: "active" },
  { id: "team-pan", name: "Panama", flagCode: "PA", group: "J", fifaRanking: 39, coach: "Thomas Christiansen", status: "active" },

  // Group K
  { id: "team-ita", name: "Italy", flagCode: "IT", group: "K", fifaRanking: 9, coach: "Luciano Spalletti", status: "active" },
  { id: "team-cro", name: "Croatia", flagCode: "HR", group: "K", fifaRanking: 12, coach: "Zlatko Dalić", status: "active" },
  { id: "team-crc", name: "Costa Rica", flagCode: "CR", group: "K", fifaRanking: 50, coach: "Claudio Vivas", status: "active" },
  { id: "team-mli", name: "Mali", flagCode: "ML", group: "K", fifaRanking: 54, coach: "Tom Saintfiet", status: "active" },

  // Group L
  { id: "team-por", name: "Portugal", flagCode: "PT", group: "L", fifaRanking: 7, coach: "Roberto Martínez", status: "active" },
  { id: "team-bel", name: "Belgium", flagCode: "BE", group: "L", fifaRanking: 6, coach: "Domenico Tedesco", status: "active" },
  { id: "team-tun", name: "Tunisia", flagCode: "TN", group: "L", fifaRanking: 47, coach: "Kais Yaâkoubi", status: "active" },
  { id: "team-qat", name: "Qatar", flagCode: "QA", group: "L", fifaRanking: 46, coach: "Tintín Márquez", status: "active" },
];

export const SQUAD_PLAYERS: Record<string, string[]> = {
  "team-mex": ["Santiago Giménez", "Edson Álvarez", "Luis Chávez", "César Montes", "Johan Vásquez", "Luis Malagón", "Orbelín Pineda", "Uriel Antuna", "Roberto Alvarado", "Guillermo Ochoa", "Raúl Jiménez"],
  "team-rsa": ["Percy Tau", "Teboho Mokoena", "Ronwen Williams", "Themba Zwane", "Khuliso Mudau", "Aubrey Modiba", "Mothobi Mvala", "Sphephelo Sithole", "Evidence Makgopa", "Thapelo Morena", "Grant Kekana"],
  "team-swe": ["Viktor Gyökeres", "Alexander Isak", "Dejan Kulusevski", "Emil Forsberg", "Victor Lindelöf", "Robin Olsen", "Ludwig Augustinsson", "Anthony Elanga", "Hugo Larsson", "Stefan Carlgren", "Carl Starfelt"],
  "team-aus": ["Mathew Ryan", "Jackson Irvine", "Harry Souttar", "Craig Goodwin", "Martin Boyle", "Mitchell Duke", "Riley McGree", "Kusini Yengi", "Connor Metcalfe", "Keanu Baccus", "Aziz Behich"],
  "team-usa": ["Christian Pulisic", "Weston McKennie", "Timothy Weah", "Folarin Balogun", "Yunus Musah", "Tyler Adams", "Antonee Robinson", "Matt Turner", "Sergiño Dest", "Chris Richards", "Miles Robinson"],
  "team-cmr": ["Vincent Aboubakar", "André Onana", "Bryan Mbeumo", "Frank Anguissa", "Karl Toko Ekambi", "Christopher Wooh", "Jean-Charles Castelletto", "Georges-Kévin Nkoudou", "Olivier Kemen", "Harold Moukoudi", "Clinton N'Jie"],
  "team-idn": ["Jay Idzes", "Thom Haye", "Ragnar Oratmangoen", "Maarten Paes", "Nathan Tjoe-A-On", "Justin Hubner", "Calvin Verdonk", "Eliano Reijnders", "Rafael Struick", "Rizky Ridho", "Pratama Arhan"],
  "team-arg": ["Lionel Messi", "Lautaro Martínez", "Julian Álvarez", "Alexis Mac Allister", "Enzo Fernández", "Rodrigo De Paul", "Emiliano Martínez", "Cristian Romero", "Nicolas Otamendi", "Lisandro Martínez", "Angel Di Maria"],
};

export function generateSquadForTeam(teamId: string, teamName: string): Player[] {
  const specificPlayers = SQUAD_PLAYERS[teamId];
  const positions: ("GK" | "DF" | "MF" | "FW")[] = [
    "GK", "DF", "DF", "DF", "DF", "MF", "MF", "MF", "FW", "FW", "FW"
  ];
  
  if (specificPlayers) {
    return specificPlayers.map((name, i) => ({
      id: `${teamId}-p-${i + 1}`,
      name,
      shirtNumber: i === 0 && positions[i] === "GK" ? 1 : i === 9 && teamId === "team-arg" ? 10 : Math.floor(Math.random() * 25) + 2,
      position: positions[i] || "MF",
      club: ["EPL", "Serie A", "La Liga", "Bundesliga", "Local League", "Eredivisie"][i % 6] + " Club"
    }));
  }

  // Create robust random players for any other team
  const firstNames = ["James", "Thomas", "Michael", "Ali", "Carlos", "Takashi", "Ken", "Min-Jae", "Luka", "Antoine", "Leroy", "Mateo", "Mohamed", "Kevin", "Gabriel"];
  const lastNames = ["Smith", "Hernandez", "Tanaka", "Park", "Bamba", "Müller", "Silva", "Mbappe", "Salah", "De Bruyne", "Kane", "Modric", "Son", "Gundogan"];

  return Array.from({ length: 11 }).map((_, i) => {
    const fn = firstNames[(i + teamName.charCodeAt(0)) % firstNames.length];
    const ln = lastNames[(i + teamName.length) % lastNames.length];
    return {
      id: `${teamId}-p-${i + 1}`,
      name: `${fn} ${ln}`,
      shirtNumber: i === 0 ? 1 : (i === 9 ? 10 : i + 2),
      position: positions[i],
      club: ["EPL", "La Liga", "Serie A", "Local Club"][i % 4]
    };
  });
}

export const TEAMS: Team[] = INITIAL_TEAMS_DATA.map(t => ({
  ...t,
  squad: generateSquadForTeam(t.id, t.name)
}));

// Setup automatic Round-Robin Matches for All 12 Groups!
export function generateGroupMatches(): Match[] {
  const matches: Match[] = [];
  const groups = Array.from(new Set(TEAMS.map(t => t.group))).sort();
  let matchIdCounter = 1;
  
  // Date schedule sequence spanning June 11 to June 25, 2026.
  // We'll calculate a progressive date of game kickoffs.
  const baseStartDate = new Date("2026-06-11T12:00:00Z");

  groups.forEach((groupChar, groupIndex) => {
    const groupTeams = TEAMS.filter(t => t.group === groupChar);
    if (groupTeams.length < 4) return;

    // Standard Round Robin scheduling pair indexes
    // Each team plays 3 matches. Total matches = 6 per group
    const pairings = [
      [0, 1], [2, 3], // Matchday 1
      [0, 2], [1, 3], // Matchday 2
      [3, 0], [1, 2]  // Matchday 3
    ];

    pairings.forEach((pair, pairIndex) => {
      const home = groupTeams[pair[0]];
      const away = groupTeams[pair[1]];

      // Offset match countdown days. 
      // Spread the matches out evenly across 15 days of group stage
      const dayOffset = Math.floor((groupIndex * 6 + pairIndex) / 5);
      const hourOffset = ((groupIndex * 3 + pairIndex) % 3) * 3 + 13; // kickoffs at 13:00, 16:00, 19:00 UTC
      
      const kickoffDate = new Date(baseStartDate);
      kickoffDate.setUTCDate(baseStartDate.getUTCDate() + dayOffset);
      kickoffDate.setUTCHours(hourOffset);

      // Venue assignment
      const venueIndex = (groupIndex * 6 + pairIndex) % VENUES.length;
      const venue = VENUES[venueIndex];

      // Give some preset resolved scores or simulated scores for already past matches
      // Say the current time is June 13, 2026
      // Match #1: Mex vs RSA (Opening Game June 11) is completed
      // Match #2: Swe vs Aus (June 11) is completed
      // Match #3 onwards are scheduled or live
      let status: Match["status"] = "scheduled";
      let hScore = 0;
      let aScore = 0;
      let events: Match["events"] = [];

      const matchDateString = kickoffDate.toISOString();
      const refDate = new Date("2026-06-13T10:00:00Z"); // current active simulator time

      if (kickoffDate.getTime() < refDate.getTime()) {
        status = "ft";
        // generate a realistic score based on ranking
        const rankDiff = away.fifaRanking - home.fifaRanking; // negative means home has better ranking
        hScore = rankDiff < -20 ? Math.floor(Math.random() * 3) + 2 : (rankDiff > 20 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3));
        aScore = rankDiff > 20 ? Math.floor(Math.random() * 3) + 2 : (rankDiff < -20 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3));
        
        // add 1-2 generic events
        if (hScore > 0) {
          events.push({
            type: "goal",
            minute: Math.floor(Math.random() * 40) + 5,
            teamId: home.id,
            playerName: home.squad[8]?.name || "FW Player"
          });
        }
        if (aScore > 0) {
          events.push({
            type: "goal",
            minute: Math.floor(Math.random() * 45) + 46,
            teamId: away.id,
            playerName: away.squad[9]?.name || "FW Player"
          });
        }
        if (Math.random() > 0.5) {
          events.push({
            type: "yellow_card",
            minute: Math.floor(Math.random() * 85) + 5,
            teamId: home.id,
            playerName: home.squad[3]?.name || "DF Player"
          });
        }
      } else {
        status = "scheduled";
      }

      matches.push({
        id: `m-${matchIdCounter++}`,
        stage: "group",
        group: groupChar,
        homeTeamId: home.id,
        awayTeamId: away.id,
        homeScore: hScore,
        awayScore: aScore,
        status,
        kickoffUtc: matchDateString,
        venueId: venue.id,
        events
      });
    });
  });

  return matches;
}

// Generates placeholder knockout bracket games for Phase 2
// 32 Besar -> 16 Besar -> QF -> SF -> Final, Juara 3
export function generateKnockoutMatches(): Match[] {
  const matches: Match[] = [];
  const baseStartDate = new Date("2026-06-28T16:00:00Z");
  let matchIdCounter = 100;

  // Let's seed 16 matches of Round of 32 (32 Besar)
  // We reference placeholder or actual computed teams
  for (let i = 1; i <= 16; i++) {
    const kickoff = new Date(baseStartDate);
    kickoff.setUTCDate(baseStartDate.getUTCDate() + Math.floor((i - 1) / 4));
    kickoff.setUTCHours(16 + ((i - 1) % 2) * 4); // 16:00 or 20:00 UTC

    const venue = VENUES[i % VENUES.length];

    // Seed mock matchups. Let's map first place of Group A, etc.
    let homePlaceholder = `Winner Group ${String.fromCharCode(65 + ((i - 1) % 12))}`;
    let awayPlaceholder = `Runner-up Group ${String.fromCharCode(65 + ((i) % 12))}`;
    
    // We can map these placeholder IDs to helper codes
    matches.push({
      id: `ko-32-${i}`,
      stage: "round32",
      homeTeamId: `placeholder-32-h-${i}`,
      awayTeamId: `placeholder-32-a-${i}`,
      homeScore: 0,
      awayScore: 0,
      status: "scheduled",
      kickoffUtc: kickoff.toISOString(),
      venueId: venue.id,
      events: []
    });
  }

  // Round of 16
  for (let i = 1; i <= 8; i++) {
    const kickoff = new Date(baseStartDate);
    kickoff.setUTCDate(baseStartDate.getUTCDate() + 5 + Math.floor((i - 1) / 2));
    kickoff.setUTCHours(18);

    matches.push({
      id: `ko-16-${i}`,
      stage: "round16",
      homeTeamId: `placeholder-16-h-${i}`,
      awayTeamId: `placeholder-16-a-${i}`,
      homeScore: 0,
      awayScore: 0,
      status: "scheduled",
      kickoffUtc: kickoff.toISOString(),
      venueId: VENUES[(i + 3) % VENUES.length].id,
      events: []
    });
  }

  // Quarter Finals (QF)
  for (let i = 1; i <= 4; i++) {
    const kickoff = new Date(baseStartDate);
    kickoff.setUTCDate(baseStartDate.getUTCDate() + 10 + Math.floor((i - 1) / 2));
    kickoff.setUTCHours(18);

    matches.push({
      id: `ko-qf-${i}`,
      stage: "qf",
      homeTeamId: `placeholder-qf-h-${i}`,
      awayTeamId: `placeholder-qf-a-${i}`,
      homeScore: 0,
      awayScore: 0,
      status: "scheduled",
      kickoffUtc: kickoff.toISOString(),
      venueId: VENUES[(i + 5) % VENUES.length].id,
      events: []
    });
  }

  // Semifinals (SF)
  for (let i = 1; i <= 2; i++) {
    const kickoff = new Date(baseStartDate);
    kickoff.setUTCDate(baseStartDate.getUTCDate() + 14 + (i - 1));
    kickoff.setUTCHours(20);

    matches.push({
      id: `ko-sf-${i}`,
      stage: "sf",
      homeTeamId: `placeholder-sf-h-${i}`,
      awayTeamId: `placeholder-sf-a-${i}`,
      homeScore: 0,
      awayScore: 0,
      status: "scheduled",
      kickoffUtc: kickoff.toISOString(),
      venueId: VENUES[(i + 7) % VENUES.length].id,
      events: []
    });
  }

  // 3rd place match
  const kickoff3rd = new Date(baseStartDate);
  kickoff3rd.setUTCDate(baseStartDate.getUTCDate() + 18);
  kickoff3rd.setUTCHours(18);
  matches.push({
    id: `ko-3rd-1`,
    stage: "3rd",
    homeTeamId: `placeholder-3rd-h`,
    awayTeamId: `placeholder-3rd-a`,
    homeScore: 0,
    awayScore: 0,
    status: "scheduled",
    kickoffUtc: kickoff3rd.toISOString(),
    venueId: "v13",
    events: []
  });

  // Final Match!
  const kickoffFinal = new Date(baseStartDate);
  kickoffFinal.setUTCDate(baseStartDate.getUTCDate() + 19);
  kickoffFinal.setUTCHours(19);
  matches.push({
    id: `ko-final-1`,
    stage: "final",
    homeTeamId: `placeholder-final-h`,
    awayTeamId: `placeholder-final-a`,
    homeScore: 0,
    awayScore: 0,
    status: "scheduled",
    kickoffUtc: kickoffFinal.toISOString(),
    venueId: "v2", // MetLife Stadium / New York New Jersey
    events: []
  });

  return matches;
}

// Maps country names to flags using elegant Emoji or custom rendered vector flag-like badges
export const COUNTRY_FLAG_EMOJIS: Record<string, string> = {
  "MX": "🇲🇽",
  "ZA": "🇿🇦",
  "SE": "🇸🇪",
  "AU": "🇦🇺",
  "US": "🇺🇸",
  "GB-WLS": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "IR": "🇮🇷",
  "CM": "🇨🇲",
  "CA": "🇨🇦",
  "PE": "🇵🇪",
  "AT": "🇦🇹",
  "EG": "🇪🇬",
  "ID": "🇮🇩",
  "AR": "🇦🇷",
  "PL": "🇵🇱",
  "SA": "🇸🇦",
  "UY": "🇺🇾",
  "JP": "🇯🇵",
  "SN": "🇸🇳",
  "GB-SCT": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "BR": "🇧🇷",
  "CH": "🇨🇭",
  "KR": "🇰🇷",
  "GH": "🇬🇭",
  "FR": "🇫🇷",
  "MA": "🇲🇦",
  "CL": "🇨🇱",
  "IQ": "🇮🇶",
  "GB-ENG": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "UA": "🇺🇦",
  "DZ": "🇩🇿",
  "NZ": "🇳🇿",
  "ES": "🇪🇸",
  "CO": "🇨🇴",
  "UZ": "🇺🇿",
  "NG": "🇳🇬",
  "DE": "🇩🇪",
  "EC": "🇪🇨",
  "JM": "🇯🇲",
  "PA": "🇵🇦",
  "IT": "🇮🇹",
  "HR": "🇭🇷",
  "CR": "🇨🇷",
  "ML": "🇲🇱",
  "PT": "🇵🇹",
  "BE": "🇧🇪",
  "TN": "🇹🇳",
  "QA": "🇶🇦",
};

export const PLACEHOLDER_NAMES: Record<string, string> = {
  "placeholder-32-h-1": "Pemenang Grup A", "placeholder-32-a-1": "Runner-up Grup B",
  "placeholder-32-h-2": "Pemenang Grup C", "placeholder-32-a-2": "Runner-up Grup D",
  "placeholder-32-h-3": "Pemenang Grup E", "placeholder-32-a-3": "Runner-up Grup F",
  "placeholder-32-h-4": "Pemenang Grup G", "placeholder-32-a-4": "Runner-up Grup H",
  "placeholder-32-h-5": "Pemenang Grup I", "placeholder-32-a-5": "Runner-up Grup J",
  "placeholder-32-h-6": "Pemenang Grup K", "placeholder-32-a-6": "Runner-up Grup L",
  "placeholder-32-h-7": "Peringkat 3 Terbaik 1", "placeholder-32-a-7": "Peringkat 3 Terbaik 2",
  "placeholder-32-h-8": "Peringkat 3 Terbaik 3", "placeholder-32-a-8": "Peringkat 3 Terbaik 4",
  "placeholder-32-h-9": "Pemenang Grup B", "placeholder-32-a-9": "Runner-up Grup A",
  "placeholder-32-h-10": "Pemenang Grup D", "placeholder-32-a-10": "Runner-up Grup C",
  "placeholder-32-h-11": "Pemenang Grup F", "placeholder-32-a-11": "Runner-up Grup E",
  "placeholder-32-h-12": "Pemenang Grup H", "placeholder-32-a-12": "Runner-up Grup G",
  "placeholder-32-h-13": "Pemenang Grup J", "placeholder-32-a-13": "Runner-up Grup I",
  "placeholder-32-h-14": "Pemenang Grup L", "placeholder-32-a-14": "Runner-up Grup K",
  "placeholder-32-h-15": "Peringkat 3 Terbaik 5", "placeholder-32-a-15": "Peringkat 3 Terbaik 6",
  "placeholder-32-h-16": "Peringkat 3 Terbaik 7", "placeholder-32-a-16": "Peringkat 3 Terbaik 8",

  "placeholder-16-h-1": "Pemenang R32 #1", "placeholder-16-a-1": "Pemenang R32 #2",
  "placeholder-16-h-2": "Pemenang R32 #3", "placeholder-16-a-2": "Pemenang R32 #4",
  "placeholder-16-h-3": "Pemenang R32 #5", "placeholder-16-a-3": "Pemenang R32 #6",
  "placeholder-16-h-4": "Pemenang R32 #7", "placeholder-16-a-4": "Pemenang R32 #8",
  "placeholder-16-h-5": "Pemenang R32 #9", "placeholder-16-a-5": "Pemenang R32 #10",
  "placeholder-16-h-6": "Pemenang R32 #11", "placeholder-16-a-6": "Pemenang R32 #12",
  "placeholder-16-h-7": "Pemenang R32 #13", "placeholder-16-a-7": "Pemenang R32 #14",
  "placeholder-16-h-8": "Pemenang R32 #15", "placeholder-16-a-8": "Pemenang R32 #16",

  "placeholder-qf-h-1": "Pemenang R16 #1", "placeholder-qf-a-1": "Pemenang R16 #2",
  "placeholder-qf-h-2": "Pemenang R16 #3", "placeholder-qf-a-2": "Pemenang R16 #4",
  "placeholder-qf-h-3": "Pemenang R16 #5", "placeholder-qf-a-3": "Pemenang R16 #6",
  "placeholder-qf-h-4": "Pemenang R16 #7", "placeholder-qf-a-4": "Pemenang R16 #8",

  "placeholder-sf-h-1": "Pemenang QF #1", "placeholder-sf-a-1": "Pemenang QF #2",
  "placeholder-sf-h-2": "Pemenang QF #3", "placeholder-sf-a-2": "Pemenang QF #4",

  "placeholder-3rd-h": "Kalah Semifinal #1", "placeholder-3rd-a": "Kalah Semifinal #2",
  "placeholder-final-h": "Pemenang Semifinal #1", "placeholder-final-a": "Pemenang Semifinal #2",
};
