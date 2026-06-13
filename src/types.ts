export interface Team {
  id: string;
  name: string;
  flagCode: string; // ISO 2 letter or custom code for mapping custom visual flags
  group: string; // A to L
  fifaRanking: number;
  coach: string;
  status: "active" | "eliminated" | "qualified_round32" | "qualified_round16" | "qualified_qf" | "qualified_sf" | "qualified_final" | "champion";
  squad: Player[];
  flagUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  shirtNumber: number;
  position: "GK" | "DF" | "MF" | "FW";
  club: string;
}

export interface StandingRow {
  teamId: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  zone: "auto" | "best_third" | "out";
}

export interface MatchEvent {
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "penalty_scored" | "penalty_missed" | "ht" | "ft";
  minute: number;
  teamId: string;
  playerName: string;
  detail?: string;
}

export interface Match {
  id: string;
  stage: "group" | "round32" | "round16" | "qf" | "sf" | "3rd" | "final";
  group?: string; // A - L (only for stage === "group")
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  penaltyHomeScore?: number;
  penaltyAwayScore?: number;
  status: "scheduled" | "live" | "ht" | "ft" | "et" | "pen" | "postponed";
  minute?: number;
  kickoffUtc: string; // ISO string or static formatted date
  venueId: string;
  events: MatchEvent[];
}

export interface Venue {
  id: string;
  stadiumName: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
  timezone: string;
  capacity?: string;
}
