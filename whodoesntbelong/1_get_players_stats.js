import fs from "fs-extra";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const OUTPUT = "./players_stats_700.json";
const TARGET_PLAYERS = 700;

const shortDelay = ms => new Promise(r => setTimeout(r, ms || 2500 + Math.random() * 3000));

(async () => {
  const allPlayers = [];

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

  let offset = 0;
  const playersPerPage = 50; // HLTV pokazuje ~50 graczy na stronę

  while (allPlayers.length < TARGET_PLAYERS) {
    console.log(`\n⏳ Pobieram graczy: offset=${offset}, dotychczas=${allPlayers.length}`);

    try {
      // URL z offsetem (paginacja)
      const url = `https://www.hltv.org/stats/players?offset=${offset}`;
      await page.goto(url, { waitUntil: "networkidle2" });

      await shortDelay();

      // Wyciąganie danych ze strony
      const players = await page.evaluate(() => {
        const rows = document.querySelectorAll('.stats-table.player-ratings-table tbody tr');
        
        return Array.from(rows).map(row => {
          const tds = row.querySelectorAll('td');

          // Nazwa i link
          const nameLink = tds[0]?.querySelector('a');
          const name = nameLink?.textContent.trim() || 'Unknown';
          const playerLink = nameLink?.getAttribute('href') || '';
          
          // Wyciągamy ID z linka: /stats/players/21167/donk → 21167
          const idMatch = playerLink.match(/\/stats\/players\/(\d+)\//);
          const id = idMatch ? idMatch[1] : null;

          // Drużyna
          const team = tds[1]?.getAttribute('data-sort')?.trim() || 'Unknown';
          const teamLogo = tds[1]?.querySelector('img.logo')?.src || '';

          // Flaga
          const flag = tds[0]?.querySelector('img.flag')?.src || '';

          // Zdjęcie gracza
          const playerImg = tds[0]?.querySelector('img.playerPicture')?.src || '';

          // Statystyki
          const maps = parseInt(tds[2]?.textContent.replace(/\D/g, ''), 10) || 0;
          const rounds = parseInt(tds[3]?.textContent.replace(/\D/g, ''), 10) || 0;
          const kdDiff = parseInt(tds[4]?.getAttribute('data-sort'), 10) || 0;
          const kd = parseFloat(tds[5]?.textContent.replace(',', '.')) || 0;
          const rating = parseFloat(tds[6]?.textContent.replace(',', '.')) || 0;

          return {
            nick: name,
            id: id,
            team: team,
            teamLogo: teamLogo,
            flag: flag,
            photo: playerImg,
            maps: maps,
            rounds: rounds,
            kdDiff: kdDiff,
            kd: kd,
            rating: rating,
            playerLink: playerLink
          };
        });
      });

      if (players.length === 0) {
        console.log('⚠️ Brak więcej graczy na stronie. Kończę.');
        break;
      }

      // Dodaj tylko graczy z ID (pomijamy tych bez ID)
      const validPlayers = players.filter(p => p.id);
      allPlayers.push(...validPlayers);

      console.log(`✅ Pobrano ${validPlayers.length} graczy z tej strony (razem: ${allPlayers.length})`);

      // Zapisz na bieżąco
      await fs.writeJson(OUTPUT, allPlayers, { spaces: 2 });

      // Następna strona
      offset += playersPerPage;

      // Jeśli mamy już wystarczająco, kończymy
      if (allPlayers.length >= TARGET_PLAYERS) {
        console.log(`\n🎉 Osiągnięto cel: ${allPlayers.length} graczy!`);
        break;
      }

    } catch (err) {
      console.error(`❌ Błąd przy offset=${offset}:`, err.message);
      await shortDelay();
    }
  }

  await browser.close();
  console.log(`\n✅ Gotowe! Zapisano ${allPlayers.length} graczy w ${OUTPUT}`);
})();
