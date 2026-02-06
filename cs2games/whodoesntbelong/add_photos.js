import fs from "fs-extra";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const INPUT = "./players.json";
const OUTPUT = "./players_with_photos.json";

const shortDelay = ms => new Promise(r => setTimeout(r, ms || 2500 + Math.random() * 3000));

(async () => {
  const players = await fs.readJson(INPUT);
  
  console.log(`📦 Wczytano ${players.length} graczy z ${INPUT}`);

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
    console.log(`\n⏳ [${i + 1}/${players.length}] Pobieram zdjęcie: ${player.nick} (ID: ${player.id})`);

    try {
      // Budujemy URL do PROFILU gracza (nie statystyk!)
      const url = `https://www.hltv.org/player/${player.id}/${player.nick}`;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      await shortDelay();

      // Wyciągamy zdjęcie gracza + dodatkowe dane (major wins, prize money, age)
      const playerData = await page.evaluate(() => {
        const result = {
          photo: '',
          majorWins: 0,
          prizeMoney: '',
          age: null
        };
        
        // === ZDJĘCIE ===
        // Zdjęcie jest w .playerBodyshot img.bodyshot-img
        const bodyshotImg = document.querySelector('.playerBodyshot img.bodyshot-img');
        if (bodyshotImg?.src) {
          console.log('[BROWSER] Znaleziono zdjęcie:', bodyshotImg.src);
          result.photo = bodyshotImg.src;
        } else {
          console.log('[BROWSER] Brak zdjęcia gracza');
        }
        
        // === AGE ===
        // Wiek jest w .playerAge .listRight
        const ageElement = document.querySelector('.playerAge .listRight');
        if (ageElement) {
          const ageText = ageElement.textContent.trim();
          // Wyciągnij liczbę z "28 years"
          const ageMatch = ageText.match(/(\d+)/);
          if (ageMatch) {
            result.age = parseInt(ageMatch[1]);
            console.log('[BROWSER] Znaleziono wiek:', result.age);
          }
        }
        
        // === PRIZE MONEY ===
        // Prize money jest w .playerPrizeMoney .listRight
        const prizeElement = document.querySelector('.playerPrizeMoney .listRight');
        if (prizeElement) {
          result.prizeMoney = prizeElement.textContent.trim();
          console.log('[BROWSER] Znaleziono prize money:', result.prizeMoney);
        }
        
        // === MAJOR WINS ===
        // Majory są w .majorWinner
        const majorElement = document.querySelector('.majorWinner');
        if (majorElement) {
          const majorText = majorElement.textContent.trim();
          // Wyciągnij liczbę z "1 x Major winner"
          const majorMatch = majorText.match(/(\d+)\s*x\s*Major/);
          if (majorMatch) {
            result.majorWins = parseInt(majorMatch[1]);
            console.log('[BROWSER] Znaleziono major wins:', result.majorWins);
          }
        } else {
          console.log('[BROWSER] Brak major wins (0)');
        }
        
        console.log('[BROWSER] Zebrane dane:', result);
        return result;
      });
      
      console.log(`🔍 [NODE] Zebrane dane dla ${player.nick}:`);
      console.log(`   📸 Photo: ${playerData.photo ? 'TAK' : 'NIE'}`);
      console.log(`   🏆 Major wins: ${playerData.majorWins}`);
      console.log(`   💰 Prize money: ${playerData.prizeMoney || 'brak'}`);
      console.log(`   👤 Age: ${playerData.age || 'brak'}`);

      // Dodaj dane do stats
      player.stats.photo = playerData.photo || '';
      player.stats.majorWins = playerData.majorWins;
      player.stats.prizeMoney = playerData.prizeMoney || '';
      player.stats.age = playerData.age || null;
      
      if (playerData.photo) {
        console.log(`✅ Komplet danych dla ${player.nick}`);
      } else {
        console.log(`⚠️ Brak zdjęcia dla ${player.nick}, ale inne dane pobrane`);
      }

      // Zapis na żywo (co 10 graczy lub na końcu)
      if ((i + 1) % 10 === 0 || i === players.length - 1) {
        await fs.writeJson(OUTPUT, players, { spaces: 2 });
        console.log(`💾 Zapisano postęp: ${i + 1}/${players.length} graczy`);
      }

    } catch (err) {
      console.error(`❌ Błąd przy ${player.nick}:`, err.message);
      player.stats.photo = '';
      player.stats.majorWins = 0;
      player.stats.prizeMoney = '';
      player.stats.age = null;
      await shortDelay(5000); // Dłuższe opóźnienie po błędzie
    }
  }

  await browser.close();
  
  // Statystyki
  const withPhotos = players.filter(p => p.stats.photo).length;
  const withoutPhotos = players.length - withPhotos;
  const withMajors = players.filter(p => p.stats.majorWins > 0).length;
  const withAge = players.filter(p => p.stats.age).length;
  const withPrizeMoney = players.filter(p => p.stats.prizeMoney).length;
  
  console.log(`\n🎉 Gotowe! Zapisano ${OUTPUT}`);
  console.log(`\n📊 Statystyki:`);
  console.log(`   📸 Ze zdjęciami: ${withPhotos}/${players.length}`);
  console.log(`   🏆 Z majorami: ${withMajors}/${players.length}`);
  console.log(`   👤 Z wiekiem: ${withAge}/${players.length}`);
  console.log(`   💰 Z prize money: ${withPrizeMoney}/${players.length}`);
  console.log(`\n💡 Zmień nazwę ${OUTPUT} na players.json i użyj w grze!`);
})();