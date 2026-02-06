import fs from 'fs';
import { load } from 'cheerio';

// Wczytanie pliku HTML (z HLTV)
const html = fs.readFileSync('players.html', 'utf8');

// Załaduj HTML do Cheerio
const $ = load(html);

// Tablica na wynik
const players = [];

// Przechodzimy po każdym wierszu tabeli
$('.stats-table.player-ratings-table tbody tr').each((i, el) => {
  const tds = $(el).find('td');

  // Nazwa zawodnika
  const name = $(tds[0]).find('a').text().trim();

  // Drużyna z atrybutu data-sort w td.teamCol
  const team = $(tds[1]).attr('data-sort')?.trim() || 'Unknown';

  // Zdjęcie drużyny (logo)
  const teamLogo = $(tds[1]).find('img.logo').first().attr('src') || '';

  // Flaga kraju
  const flag = $(tds[0]).find('img.flag').attr('src') || '';

  // Statystyki
  const maps = parseInt($(tds[2]).text().replace(/\D/g, ''), 10) || 0;
  const rounds = parseInt($(tds[3]).text().replace(/\D/g, ''), 10) || 0;
  const kdDiff = parseInt($(tds[4]).attr('data-sort'), 10) || 0;
  const kd = parseFloat($(tds[5]).text().replace(',', '.')) || 0;
  const rating = parseFloat($(tds[6]).text().replace(',', '.')) || 0;

  // Link do profilu zawodnika (przydatny jeśli będziesz chciał pobierać zdjęcie gracza w przyszłości)
  const playerLink = $(tds[0]).find('a').attr('href') || '';

  // Dodajemy do tablicy
  players.push({ name, team, teamLogo, flag, maps, rounds, kdDiff, kd, rating, playerLink });
});

// Kategorie do gry Hi-Lo (pobierane z players.json)
const categories = [
  { key: 'rating', label: 'Rating 3.0' },
  { key: 'kd', label: 'K/D Ratio' },
  { key: 'maps', label: 'Maps Played' },
  { key: 'kdDiff', label: 'K-D Difference' }
];

// Zapis do JSON – format { categories, players }
const output = { categories, players };
fs.writeFileSync('players.json', JSON.stringify(output, null, 2));

console.log(`Zapisano ${players.length} graczy i ${categories.length} kategorii do players.json`);
