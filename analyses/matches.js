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
  // },

];
