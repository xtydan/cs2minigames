const fs = require('fs');
const path = require('path');

// Ścieżki plików
const inputFile = path.join(__dirname, 'players.json');
const outputFile = path.join(__dirname, 'players_guesswho.json');

// Mapowanie drużyn na regiony (kontynenty)
const teamRegions = {
  'Vitality': 'Europe',
  'FURIA': 'South America',
  'Falcons': 'Europe',
  'Spirit': 'Europe',
  'Astralis': 'Europe',
  'Liquid': 'North America',
  'G2': 'Europe',
  'MOUZ': 'Europe',
  'HEROIC': 'Europe',
  'Natus Vincere': 'Europe',
  '3DMAX': 'Europe',
  'B8': 'Europe',
  'Legacy': 'Europe',
  'Passion UA': 'Europe',
  'PARIVISION': 'Europe',
  'Aurora': 'Europe',
  'The MongolZ': 'Asia',
  'Fnatic': 'Europe',
  // Dodaj tutaj inne drużyny w razie potrzeby
};

// Mapowanie flag na kraj zawodnika
const countryFlags = {
  'France': 'France',
  'Latvia': 'Latvia',
  'Estonia': 'Estonia',
  'Russia': 'Russia',
  'Bosnia and Herzegovina': 'Bosnia and Herzegovina',
  'Brazil': 'Brazil',
  'Denmark': 'Denmark',
  'Sweden': 'Sweden',
  'Norway': 'Norway',
  'Poland': 'Poland',
  'Ukraine': 'Ukraine',
  'Turkey': 'Turkey',
  'Finland': 'Finland',
  // Dodaj inne kraje w razie potrzeby
};

try {
  // Wczytanie danych
  const rawData = fs.readFileSync(inputFile, 'utf-8');
  const players = JSON.parse(rawData);

  // Konwersja zawodników na format GuessWho
  const converted = players.map(player => {
    return {
      name: player.name,
      team: player.team,
      maps: player.maps || 0,
      rounds: player.rounds || 0,
      kdDiff: player.kdDiff || 0,
      kd: player.kd || 0,
      rating: player.rating || 0,
      country: countryFlags[player.country] || 'Unknown',
      region: teamRegions[player.team] || 'Unknown',
      age: player.age || 0,          // jeśli brak -> 0
      role: player.role || 'Rifler', // default Rifler
      majorWins: player.majorWins || 0
    };
  });

  // Zapis do pliku
  fs.writeFileSync(outputFile, JSON.stringify(converted, null, 2), 'utf-8');
  console.log(`✅ Conversion complete! ${converted.length} players saved to players_guesswho.json`);
} catch (err) {
  console.error('Error:', err.message);
}
