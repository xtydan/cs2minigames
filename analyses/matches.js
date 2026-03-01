// ============================================================
//  DODAWANIE NOWYCH ANALIZ
//  Skopiuj obiekt, wklej na górze tablicy i uzupełnij dane.
// ============================================================

const matches = [

  {
    id: "liquid-vs-passionua-epl-s23",
    date: "2025-03-01",
    tournament: "ESL Pro League Season 23 — Stage 1",
    format: "BO3",

    team1: {
      name: "Team Liquid",
      shortName: "Liquid",
      rank: 15,
      winChance: 66
    },
    team2: {
      name: "Passion UA",
      shortName: "Passion UA",
      rank: 20,
      winChance: 34
    },

    prediction: "Team Liquid",
    predictionScore: "2-1",
    confidence: 7,                  // 1–10

    // ── OVERVIEW ──────────────────────────────────────────
    overview: `The clash between Team Liquid and Passion UA in ESL Pro League Season 23 represents a classic structured favorite vs momentum underdog scenario.

Liquid enters the series with deeper tactical structure, broader map pool coverage, and significantly more experience against higher-tier opposition. Passion UA, on the other hand, thrives in high-variance environments, relying on tempo, aggression, and momentum swings.

In a Bo3 format, structural consistency and adaptation between maps typically carry more weight — a factor that systematically benefits Liquid. The outcome will largely depend on whether Liquid controls pacing and mid-round decisions or whether Passion UA succeeds in accelerating the game into aim-heavy exchanges.`,

    // ── HARD DATA ─────────────────────────────────────────
    data: {
      recentForm: {
        team1: "Mixed results vs stronger opposition",
        team2: "Positive results, primarily vs lower-tier teams"
      },
      headToHead: "Most recent meeting: Passion UA won 2–0",
      lineupStability: "Both teams field full main rosters",
      mapWinChance: 58,             // % team1 na neutralnej mapie
      roundDiff: "+6 to +10 rounds (Liquid winning scenario)",
      marketOdds: {
        team1Odds: 1.65,
        impliedProb: 60.6,
        modelEdge: "~5–6% positive value"
      }
    },

    // ── BETTING PICKS ──────────────────────────────────────
    bets: [
      {
        tier: 1,
        label: "Primary Bet",
        pick: "Team Liquid to win the match (moneyline)",
        minOdds: 1.60,
        stake: "5–6%",
        note: "Structured favorite with measurable value edge"
      },
      {
        tier: 2,
        label: "Safer Alternative",
        pick: "Passion UA +1.5 maps",
        minOdds: null,
        stake: "~5%",
        note: "Underdog has realistic map-winning probability"
      },
      {
        tier: 3,
        label: "Aggressive Value Play",
        pick: "Correct score: Liquid 2–1",
        minOdds: null,
        stake: "2%",
        note: "Aligns with most frequent model simulation outcome"
      }
    ],

    // ── RISK FACTORS ───────────────────────────────────────
    risks: [
      "Previous H2H favors Passion UA",
      "Underdog momentum profile",
      "Swiss stage format increases volatility"
    ],

    // ── CONFIDENCE NOTE ────────────────────────────────────
    confidenceNote: "Liquid holds a structural advantage in a Bo3 environment, but matchup volatility and underdog momentum prevent this from being a high-certainty prediction. This is a controlled value position rather than a low-risk favorite.",

    // ── EDITOR'S PREDICTION (opcjonalne) ──────────────────
    editorPick: {
      pick: "Team Liquid to win the match",
      note: "Liquid strukturalnie lepszy w Bo3. Stawiam na nich mimo H2H.",
      stake: "5%",
      odds: "1.65",
      confidence: "High"
    }
  },
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

];
