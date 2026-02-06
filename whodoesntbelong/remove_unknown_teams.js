import fs from "fs-extra";

const INPUT = "./players.json";
const OUTPUT = "./players_cleaned.json";

(async () => {
  console.log('📦 Wczytuję bazę graczy...');
  
  const players = await fs.readJson(INPUT);
  
  console.log(`✅ Wczytano ${players.length} graczy`);
  
  let totalUnknownRemoved = 0;
  
  players.forEach(player => {
    const originalLength = player.teamHistory.length;
    
    // Usuń wszystkie wpisy z team: "Unknown"
    player.teamHistory = player.teamHistory.filter(team => team.team !== "Unknown");
    
    const removed = originalLength - player.teamHistory.length;
    if (removed > 0) {
      totalUnknownRemoved += removed;
      console.log(`🧹 ${player.nick}: usunięto ${removed} Unknown team(s)`);
    }
  });
  
  // Zapisz wyczyszczoną bazę
  await fs.writeJson(OUTPUT, players, { spaces: 2 });
  
  console.log(`\n✅ Gotowe! Zapisano ${OUTPUT}`);
  console.log(`🧹 Usunięto łącznie ${totalUnknownRemoved} "Unknown" teams`);
  console.log(`💡 Zmień nazwę ${OUTPUT} na players.json i użyj w grze!`);
})();
