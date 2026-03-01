// ============================================================
//  DODAWANIE NOWYCH ANALIZ
//  Skopiuj obiekt, wklej na górze tablicy i uzupełnij dane.
// ============================================================
// ──────────────────────────────────────────────────────────
  // SZABLON — skopiuj i uzupełnij dla nowej analizy
  // ──────────────────────────────────────────────────────────
  // {
  //   id: "team1-vs-team2-turniej",
  //   date: "YYYY-MM-DD",
  //   tournament: "Nazwa turnieju",
  //   format: "BO3",
  //   team1: { name: "", shortName: "", rank: 0, winChance: 50 },
  //   team2: { name: "", shortName: "", rank: 0, winChance: 50 },
  //   prediction: "",
  //   predictionScore: "2-1",
  //   confidence: 7,
  //   overview: `Opis meczu...`,
  //   data: {
  //     recentForm: { team1: "", team2: "" },
  //     headToHead: "",
  //     lineupStability: "",
  //     mapWinChance: 55,
  //     roundDiff: "",
  //     marketOdds: { team1Odds: 0, impliedProb: 0, modelEdge: "" }
  //   },
  //   bets: [
  //     { tier: 1, label: "Primary Bet", pick: "", minOdds: 0, stake: "", note: "" },
  //     { tier: 2, label: "Safer Alternative", pick: "", minOdds: null, stake: "", note: "" },
  //     { tier: 3, label: "Aggressive Value Play", pick: "", minOdds: null, stake: "", note: "" }
  //   ],
  //   risks: ["", "", ""],
  //   confidenceNote: ""
  //   editorPick: {
  //    pick: "Team Liquid to win the match",
  //    note: "",
  //    stake: "",
  //    odds: "",
  //    confidence: ""
  //  }
  // },

const matches = [
  {
  id: "cybershoke-vs-ex-ruby-nodwin-clutch-series-5",
  date: "2026-03-02",
  tournament: "Nodwin Clutch Series 5",
  format: "BO3",
  team1: { name: "CYBERSHOKE", shortName: "CYBERSHOKE", rank: 64, winChance: 47 },
  team2: { name: "ex-RUBY", shortName: "ex-RUBY", rank: 69, winChance: 53 },
  prediction: "ex-RUBY",
  predictionScore: "2-1",
  confidence: 7.5,
  overview: `CYBERSHOKE and ex-RUBY meet for the first time in a Bo3 setting, highlighting a contrast in styles. CYBERSHOKE is structured, relying on mid-round control, precise utility, and strong Dust2/Mirage performances. ex-RUBY favors aggression, rapid rotations, and flexible map control, with notable strengths on Dust2 and Overpass. Bo3 format emphasizes map veto strategy and momentum swings. Key scenarios include Dust2 mid duels, tempo management, and efficiency on CT sides. CYBERSHOKE can dominate individual maps, but ex-RUBY's adaptability and recent form give them a slight edge for the overall series.`,
  data: {
    recentForm: {
      team1: "W, L, W, L, L — mixed results against mid-tier opposition, strong map-specific wins",
      team2: "W, L, W, L, W — slightly more consistent, capable of taking maps off similarly ranked teams"
    },
    headToHead: "First meeting",
    lineupStability: "Both teams using full rosters, no stand-ins",
    mapWinChance: 49,
    roundDiff: "CYBERSHOKE +5 to +8 / ex-RUBY +4 to +7 (if they win)",
    marketOdds: { team1Odds: 1.75, impliedProb: 57, modelEdge: "~-6% (overvalued)" }
  },
  bets: [
    { tier: 1, label: "Primary Bet", pick: "ex-RUBY to win the match (moneyline)", minOdds: 1.95, stake: "3-5%", note: "Slight edge from recent form and adaptable map play" },
    { tier: 2, label: "Safer Alternative", pick: "ex-RUBY to win at least one map (+1.5 maps)", minOdds: null, stake: "2-3%", note: "Covers winning a single map or series in a decider, lower-risk hedge" },
    { tier: 3, label: "Aggressive Value Play", pick: "Correct score: ex-RUBY 2-1", minOdds: null, stake: "1-2%", note: "CYBERSHOKE expected to pick up at least one map; high-value bet if the series goes the distance" }
  ],
  risks: [
    "Both teams have inconsistent recent form, increasing unpredictability",
    "First-time H2H; no direct historical advantage",
    "Map veto could favor unexpected maps",
    "Limited data for ex-RUBY on Ancient increases variance"
  ],
  confidenceNote: "ex-RUBY holds a slight edge due to map flexibility and better recent consistency. CYBERSHOKE's Dust2/Mirage strength keeps the series competitive. The Bo3 format allows both sides to leverage map-specific strategies, but model favors ex-RUBY in a close contest.",
  editorPick: {
      pick: "Ruby to win",
      note: "Basically a 50/50, worth going the higher odds",
      stake: "5%",
      odds: "1.95",
      confidence: "Medium"
    }
},

];
