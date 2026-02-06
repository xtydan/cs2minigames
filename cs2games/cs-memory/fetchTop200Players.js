import HLTV from '@ma-ve/hltv-api';
import fs from 'fs';

async function fetchTop200Players() {
  try {
    console.log('Pobieranie listy top graczy (z jednej listy)...');
    // getTopPlayers zwraca tablicę zawodników
    const allPlayers = await HLTV.getTopPlayers();

    // Weź tylko pierwsze 200
    const topPlayers = allPlayers.slice(0, 200);

    // Zapisz do JSON
    fs.writeFileSync('top200Players.json', JSON.stringify(topPlayers, null, 2));
    console.log('✅ Top 200 zawodników zapisanych w top200Players.json!');
  } catch (error) {
    console.error('❌ Błąd przy pobieraniu danych:', error);
  }
}

fetchTop200Players();
