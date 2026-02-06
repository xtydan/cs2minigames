const fs = require("fs");
const cheerio = require("cheerio");

const inputFile = "players-guesswho.json"; // Twój plik wejściowy
const outputFile = "players-guesswho-full.json";

const teamRegions = {
  "Vitality": "Europe",
  "FURIA": "South America",
  "Falcons": "Europe",
  "Spirit": "Europe",
  "Astralis": "Europe",
  "G2": "Europe",
  "Liquid": "North America",
  "Fnatic": "Europe",
  "MOUZ": "Europe",
  "HEROIC": "Europe",
  "Natus Vincere": "Europe",
  "B8": "Europe",
  // dodaj tu inne drużyny
};

async function fetchPlayerData(playerName) {
  try {
    const urlName = encodeURIComponent(playerName.replace(" ", "_"));
    const url = `https://liquipedia.net/counterstrike/${urlName}`;

    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed to fetch ${playerName}`);
      return null;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // wiek
    let age = null;
    $("th.infobox-header:contains('Date of birth')").each((i, el) => {
      const birthText = $(el).next("td").text().trim();
      const match = birthText.match(/\d{4}/); // rok urodzenia
      if (match) {
        const birthYear = parseInt(match[0], 10);
        const currentYear = new Date().getFullYear();
        age = currentYear - birthYear;
      }
    });

    // liczba Majorów
    let majorWins = 0;
    $("table.infobox tbody tr").each((i, el) => {
      const thText = $(el).find("th").text().trim();
      if (/Major Championships/i.test(thText)) {
        const tdText = $(el).find("td").text().trim();
        const matches = tdText.match(/\d+/g);
        if (matches && matches.length > 0) {
          majorWins = parseInt(matches[0], 10);
        }
      }
    });

    return { age, majorWins };
  } catch (err) {
    console.error(`Error fetching ${playerName}: ${err}`);
    return null;
  }
}

async function main() {
  const rawData = fs.readFileSync(inputFile);
  const players = JSON.parse(rawData);

  for (let i = 0; i < players.length; i++) {
    const p = players[i];

    const region = teamRegions[p.team] || "Unknown";
    const role = "Rifler";

    const data = await fetchPlayerData(p.name);
    const age = data?.age || null;
    const majorWins = data?.majorWins || 0;

    players[i] = {
      ...p,
      region,
      role,
      age,
      majorWins
    };

    console.log(`Processed ${i + 1}/${players.length}: ${p.name}`);
    await new Promise(r => setTimeout(r, 2000)); // pauza 2 sekundy
  }

  fs.writeFileSync(outputFile, JSON.stringify(players, null, 2));
  console.log(`All done! Saved to ${outputFile}`);
}

main();
