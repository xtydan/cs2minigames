const fs = require("fs");
const path = "./players.json"; // ścieżka do Twojego pliku

// Wczytaj plik
let players = JSON.parse(fs.readFileSync(path, "utf8"));

// Uzupełnij role tam, gdzie brak
players.forEach(player => {
  if (!player.role || player.role.trim() === "") {
    player.role = "Rifler";
  }
});

// Zapisz z powrotem do pliku
fs.writeFileSync(path, JSON.stringify(players, null, 2), "utf8");

console.log(`Uzupełniono role dla ${players.length} zawodników.`);
