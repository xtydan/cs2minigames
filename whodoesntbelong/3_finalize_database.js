import fs from "fs-extra";

const INPUT = "./players_with_teams_700.json";
const OUTPUT = "./merged_players_700.json";

(async () => {
  console.log('📦 Wczytuję bazę graczy...');
  
  const players = await fs.readJson(INPUT);
  
  console.log(`✅ Wczytano ${players.length} graczy`);
  console.log('💾 Zapisuję w formacie merged_players.json...');
  
  // Baza jest już w dobrym formacie (nick, id, stats, teamHistory)
  // ale upewnijmy się że wszystko jest ok
  
  const validPlayers = players.filter(p => {
    return p.nick && p.id && p.stats && p.teamHistory;
  });
  
  console.log(`✅ Zwalidowano: ${validPlayers.length} graczy`);
  
  if (validPlayers.length < players.length) {
    console.log(`⚠️ Odrzucono ${players.length - validPlayers.length} niepełnych wpisów`);
  }
  
  await fs.writeJson(OUTPUT, validPlayers, { spaces: 2 });
  
  console.log(`\n🎉 Gotowe! Zapisano ${validPlayers.length} graczy w ${OUTPUT}`);
  console.log('\n📋 Statystyki bazy:');
  
  // Policz unikalne drużyny
  const allTeams = new Set();
  validPlayers.forEach(p => {
    allTeams.add(p.stats.team);
    p.teamHistory.forEach(t => allTeams.add(t.team));
  });
  
  // Policz unikalne kraje
  const allCountries = new Set();
  validPlayers.forEach(p => {
    const match = p.stats.flag.match(/\/([A-Z]{2})\.gif$/);
    if (match) allCountries.add(match[1]);
  });
  
  console.log(`   🏢 Unikalnych drużyn: ${allTeams.size}`);
  console.log(`   🌍 Krajów: ${allCountries.size}`);
  console.log(`   👥 Graczy: ${validPlayers.length}`);
  
  // Top 10 graczy po ratingu
  const topByRating = validPlayers
    .sort((a, b) => b.stats.rating - a.stats.rating)
    .slice(0, 10);
  
  console.log('\n🏆 Top 10 graczy (rating):');
  topByRating.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.nick} (${p.stats.team}) - ${p.stats.rating.toFixed(2)}`);
  });
})();
