import fs from "fs-extra";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const INPUT = "./output.json";              
const OUTPUT = "./output_with_logos.json";  

const shortDelay = ms => new Promise(r => setTimeout(r, ms || 2500 + Math.random() * 3000));

(async () => {
  const players = await fs.readJson(INPUT);

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

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    console.log(`⏳ Pobieram drużyny: ${player.nick}`);

    try {
      const url = `https://www.hltv.org/player/${player.id}/${player.nick}`;
      await page.goto(url, { waitUntil: "networkidle2" });

      await shortDelay();

      // ===== WYCIĄGANIE WSZYSTKICH DRUŻYN Z LOGO =====
      const teams = await page.evaluate((placeholderLogo) => {
        const rows = document.querySelectorAll("table.team-breakdown tbody tr");

        return Array.from(rows).map(row => {
          const timeCell = row.querySelector("td.time-period-cell");
          const teamLink = row.querySelector("td.team-name-cell a");

          // Pobierz wszystkie możliwe logo z container
          const logoContainer = teamLink?.querySelector(".team-logo-container");
          const logos = logoContainer ? Array.from(logoContainer.querySelectorAll("img")) : [];
          const logoSrc = logos[0]?.src || placeholderLogo; // bierz pierwszy, jeśli brak → placeholder

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

      player.teams = teams;

      // ===== ZAPIS NA ŻYWO =====
      await fs.writeJson(OUTPUT, players, { spaces: 2 });
      console.log(`✅ Zapisano dane: ${player.nick} (${teams.length} drużyn)`);

    } catch (err) {
      console.error(`❌ Błąd przy ${player.nick}:`, err.message);
      await shortDelay();
    }
  }

  await browser.close();
  console.log(`✅ Gotowe! Wszystkie dane zapisane w ${OUTPUT}`);
})();
