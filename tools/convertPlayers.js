const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "players.json");
const outputFile = path.join(__dirname, "players-guesswho.json");

/* ---------------- COUNTRY FROM FLAG ---------------- */

const countryMap = {
  DK: "Denmark",
  SE: "Sweden",
  NO: "Norway",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  PL: "Poland",
  RU: "Russia",
  UA: "Ukraine",
  EE: "Estonia",
  LV: "Latvia",
  LT: "Lithuania",
  BA: "Bosnia and Herzegovina",
  TR: "Turkey",
  BR: "Brazil",
  AR: "Argentina",
  US: "United States",
  CA: "Canada",
  AU: "Australia",
  CN: "China",
  KR: "South Korea"
};

function getCountryFromFlag(flagPath) {
  if (!flagPath) return "Unknown";
  const match = flagPath.match(/\/([A-Z]{2})\.gif$/);
  if (!match) return "Unknown";
  return countryMap[match[1]] || "Unknown";
}

/* ---------------- REGION FROM TEAM ---------------- */

const teamRegionMap = {
  // Europe
  "fnatic": "Europe",
  "vitality": "Europe",
  "g2": "Europe",
  "navi": "Europe",
  "spirit": "Europe",
  "faze": "Europe",
  "falcons": "Europe",

  // North America
  "liquid": "North America",
  "complexity": "North America",
  "eg": "North America",

  // South America
  "furia": "South America",
  "imperial": "South America",
  "pain": "South America",

  // Asia
  "the mongolz": "Asia",
  "tyloo": "Asia",

  // Oceania
  "grayhound": "Oceania"
};

function getRegionFromTeam(teamName) {
  if (!teamName) return "Unknown";
  const key = teamName.toLowerCase();
  return teamRegionMap[key] || "Unknown";
}

/* ---------------- MAIN ---------------- */

const raw = fs.readFileSync(inputFile, "utf8");
const players = JSON.parse(raw);

const converted = players.map(p => ({
  name: p.name,
  team: p.team,
  maps: p.maps ?? 0,
  rounds: p.rounds ?? 0,
  kdDiff: p.kdDiff ?? 0,
  kd: p.kd ?? 0,
  rating: p.rating ?? 0,

  country: getCountryFromFlag(p.flag),
  region: getRegionFromTeam(p.team),

  age: null,
  role: "Rifler",
  majorWins: 0
}));

fs.writeFileSync(outputFile, JSON.stringify(converted, null, 2), "utf8");

console.log(`✔ Converted ${converted.length} players`);
console.log("📄 Output: players-guesswho.json");
