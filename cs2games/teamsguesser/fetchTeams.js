import fs from "fs-extra";
import puppeteer from "puppeteer";

// ====== KONFIG ======
const INPUT = "./players.json";
const OUTPUT = "./output.json";

// losowy delay (zachowanie człowieka)
const humanDelay = async (min = 2000, max = 4500) => {
  const ms = Math.floor(min + Math.random() * (max - min));
  return new Promise(r => setTimeout(r, ms));
};

(async () => {
  const players = await fs.readJson(INPUT);
  const results = [];

  const browser = await puppeteer.launch({
    headless: false, // MUSI być false
    defaultViewport: null,
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled"
    ]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
  );

  // ====== WARM-UP (1 CAPTCHA) ======
  console.log("🧠 Warm-up: jeśli wyskoczy captcha – rozwiąż je ręcznie");
  await page.goto("https://www.hltv.org", { waitUntil: "networkidle2" });
  await humanDelay(6000, 9000);

  // ====== GŁÓWNA PĘTLA ======
  for (const player of players) {
    const url = `https://www.hltv.org/player/${player.id}/${player.nick}`;
    console.log(`⏳ Pobieram: ${player.nick}`);

    try {
      await page.goto(url, { waitUntil: "networkidle2" });
      await humanDelay(1500, 3000); // czas na załadowanie tabeli

      const teams = await page.evaluate(() => {
        const rows = document.querySelectorAll(
          "table.team-breakdown tbody tr"
        );

        return Array.from(rows).map(row => {
          const cols = row.querySelectorAll("td");
          return {
            team: cols[0]?.innerText.trim() || null,
            from: cols[1]?.innerText.trim() || null,
            to: cols[2]?.innerText.trim() || null
          };
        });
      });

      results.push({
        nick: player.nick,
        id: player.id,
        teams
      });

      console.log(`✅ OK: ${player.nick}`);
      await humanDelay(2500, 5000); // przerwa między zawodnikami

    } catch (err) {
      console.log(`❌ Błąd: ${player.nick}`);
      await humanDelay(6000, 9000);
    }
  }

  // ====== ZAPIS ======
  await fs.writeJson(OUTPUT, results, { spaces: 2 });
  console.log("🎉 Gotowe! Dane zapisane do output.json");

  await browser.close();
})();
