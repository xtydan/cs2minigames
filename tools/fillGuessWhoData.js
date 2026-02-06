// fillGuessWhoData.js

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// -----------------------------------
// MAPOWANIE DRUŻYN → REGION
// (dopisuj kolejne drużyny)
const teamRegions = {
  "Vitality": "Europe",
  "FURIA": "South America",
  "G2": "Europe",
  "Liquid": "North America",
  "Astralis": "Europe",
  "Spirit": "Europe",
  "MOUZ": "Europe",
  "Fnatic": "Europe",
  "HEROIC": "Europe",
  "Natus Vincere": "Europe",
  "B8": "Europe",
  "Legacy": "Europe",
  "Falcons": "Europe",
  "paiN": "South America",
  "PARIVISION": "Europe",
  "Passion UA": "Europe",
  "The MongolZ": "Asia"
  // dodaj inne drużyny w razie potrzeby
};

// -----------------------------------
const inputFile = path.join(__dirname, "players_guesswho.json");
const outputFile = path.join(__dirname, "players_guesswho_complete.json");

// Pobieranie danych ze strony Liquipedia
async function fetchLiquipedia(playerName) {
  const safeName = encodeURIComponent(playerName.replace(" ", "_"));
  const url = `https://liquipedia.net/counterstrike/${safeName}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`⚠️  Liquipedia page not found for: ${playerName}`);
      return null;
    }
    const html = await res.text();
    const $ = cheerio.load(html);

    // WIEK (Age)
    let age = null;
    // szukaj 'Date of birth' i sprawdzaj rok
    $("th.infobox-header:contains('Date of birth')").each((i, el) => {
      const val = $(el).next("td").text().trim();
      const match = val.match(/(\d{4})/);
      if (match) {
        const birthYear = parseInt(match[1], 10);
        age = new Date().getFullYear() - birthYear;
      }
    });

    // MAJOR WINS
    let majorWins = 0;
    $("table.infobox tbody tr").each((i, row) => {
      const label = $(row).find("th").text().trim();
      if (/Major Championships/i.test(label)) {
        const text = $(row).find("td").text().trim();
        const m = text.match(/\d+/);
        if (m) {
          majorWins = parseInt(m[0], 10);
        }
      }
    });

    return { age, majorWins };
  } catch (err) {
    console.error(`❌ Error fetching Liquipedia for ${playerName}:`, err.message);
    return null;
  }
}

async function main() {
  let raw;
  try {
    raw = fs.readFileSync(inputFile, "utf-8");
  } catch (err) {
    console.error("❌ Could not read input file:", err.message);
    return;
  }

  let players;
  try {
    players = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Invalid JSON:", err.message);
    return;
  }

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    console.log(`🔎 [${i + 1}/${players.length}] Fetching: ${p.name}`);

    // region domyślny z drużyny
    const region = teamRegions[p.team] || "Unknown";

    // fetch Liquipedia dla age i majorWins
    const info = await fetchLiquipedia(p.name);

    players[i] = {
      ...p,
      region,
      age: info?.age ?? p.age ?? null,
      majorWins: info?.majorWins ?? p.majorWins ?? 0,
      role: p.role || "Rifler"
    };

    // pauza, żeby nie zablokowali nas
    await new Promise(r => setTimeout(r, 2200));
  }

  // zapis
  try {
    fs.writeFileSync(outputFile, JSON.stringify(players, null, 2), "utf-8");
    console.log("✅ All done! Saved to:", outputFile);
  } catch (err) {
    console.error("❌ Could not save output file:", err.message);
  }
}

main();
