import fs from "fs-extra";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const INPUT = "./players.json";
const OUTPUT = "./players_with_photos.json";

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

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    console.log(`⏳ [${i + 1}/${players.length}] Pobieram zdjęcie: ${player.nick}`);

    try {
      // Budujemy URL ze statystykami gracza
      const url = `https://www.hltv.org${player.stats.playerLink}`;
      await page.goto(url, { waitUntil: "networkidle2" });

      await shortDelay();

      // Wyciągamy zdjęcie gracza
      const photo = await page.evaluate(() => {
        const img = document.querySelector('img.bodyshot-img');
        return img?.src || '';
      });

      // Dodaj zdjęcie do stats
      player.stats.photo = photo;

      // Zapis na żywo
      await fs.writeJson(OUTPUT, players, { spaces: 2 });
      console.log(`✅ Zapisano: ${player.nick} ${photo ? '(ze zdjęciem)' : '(brak zdjęcia)'}`);

    } catch (err) {
      console.error(`❌ Błąd przy ${player.nick}:`, err.message);
      player.stats.photo = '';
      await shortDelay();
    }
  }

  await browser.close();
  console.log(`\n✅ Gotowe! Wszystkie zdjęcia dodane do ${OUTPUT}`);
  console.log('💡 Teraz zmień nazwę pliku na players.json (lub użyj players_with_photos.json w grze)');
})();
