import fs from "fs-extra";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const STATS_FILE = "./players_stats_700.json";      // Nowi gracze ze statystykami
const EXISTING_TEAMS = "./players2.json";           // Twoja obecna baza z drużynami (210 graczy)
const OUTPUT = "./players_with_teams_700.json";     // Finalna baza

const shortDelay = ms => new Promise(r => setTimeout(r, ms || 2500 + Math.random() * 3000));

(async () => {
  // Wczytaj nowych graczy i obecną bazę
  const newPlayers = await fs.readJson(STATS_FILE);
  let existingPlayers = [];
  
  try {
    existingPlayers = await fs.readJson(EXISTING_TEAMS);
  } catch (err) {
    console.log('⚠️ Brak istniejącej bazy z drużynami, zaczynam od zera.');
  }

  // Stwórz mapę istniejących graczy (po ID)
  const existingIds = new Set(existingPlayers.map(p => p.id));

  // Filtruj tylko nowych graczy (których nie mamy jeszcze w bazie)
  const playersToFetch = newPlayers.filter(p => !existingIds.has(p.id));

  console.log(`📊 Masz już ${existingPlayers.length} graczy z drużynami`);
  console.log(`🆕 Trzeba pobrać drużyny dla ${playersToFetch.length} nowych graczy`);

  if (playersToFetch.length === 0) {
    console.log('✅ Wszystkie drużyny już pobrane!');
    return;
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "C:/cs2games/chrome-profile",
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
  );

  const placeholderLogo = "https://img-cdn.hltv.org/teamlogo/placeholder.png";

  // Połącz istniejących graczy z nowymi (do aktualizacji na żywo)
  const allPlayers = [...existingPlayers];

  for (let i = 0; i < playersToFetch.length; i++) {
    const player = playersToFetch[i];
    console.log(`\n⏳ [${i + 1}/${playersToFetch.length}] Pobieram drużyny: ${player.nick}`);

    try {
      const url = `https://www.hltv.org/player/${player.id}/${player.nick}`;
      await page.goto(url, { waitUntil: "networkidle2" });

      await shortDelay();

      // Wyciąganie drużyn
      const teams = await page.evaluate((placeholderLogo) => {
        const rows = document.querySelectorAll("table.team-breakdown tbody tr");

        return Array.from(rows).map(row => {
          const timeCell = row.querySelector("td.time-period-cell");
          const teamLink = row.querySelector("td.team-name-cell a");

          const logoContainer = teamLink?.querySelector(".team-logo-container");
          const logos = logoContainer ? Array.from(logoContainer.querySelectorAll("img")) : [];
          const logoSrc = logos[0]?.src || placeholderLogo;

          const fromToText = timeCell?.innerText.trim().split(" - ") || [];
          const from = fromToText[0] || null;
          const to = fromToText[1] || null;

          const teamName = logos[0]?.title || teamLink?.innerText.trim() || "Unknown";

          return {
            team: teamName,
            logo: logoSrc,
            from,
            to
          };
        });
      }, placeholderLogo);

      // Dodaj drużyny do gracza
      const playerWithTeams = {
        nick: player.nick,
        id: player.id,
        stats: {
          team: player.team,
          teamLogo: player.teamLogo,
          flag: player.flag,
          photo: player.photo,
          maps: player.maps,
          rounds: player.rounds,
          kdDiff: player.kdDiff,
          kd: player.kd,
          rating: player.rating,
          playerLink: player.playerLink
        },
        teamHistory: teams
      };

      allPlayers.push(playerWithTeams);

      // Zapis na żywo
      await fs.writeJson(OUTPUT, allPlayers, { spaces: 2 });
      console.log(`✅ Zapisano: ${player.nick} (${teams.length} drużyn) | Razem: ${allPlayers.length} graczy`);

    } catch (err) {
      console.error(`❌ Błąd przy ${player.nick}:`, err.message);
      await shortDelay();
    }
  }

  await browser.close();
  console.log(`\n🎉 Gotowe! Zapisano ${allPlayers.length} graczy w ${OUTPUT}`);
})();
