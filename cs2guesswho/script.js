let players = [];
let currentPlayer = null;
let revealedCount = 0;
let wrongGuessesAfterAllRevealed = 0;

const CATEGORIES = [
  { key: "country", label: "Country" },
  { key: "team", label: "Team" },
  { key: "age", label: "Age" },
  { key: "active", label: "Active" },
  { key: "pastTeam", label: "Random Past Team" },
  { key: "prizeMoney", label: "Prize Money" }
];
const maxPoints = CATEGORIES.length;

const tilesContainer = document.getElementById("tilesContainer");
const guessBtn = document.getElementById("guessBtn");
const playerInput = document.getElementById("playerInput");
const endGame = document.getElementById("endGame");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const autocompleteList = document.getElementById("autocomplete-list");

function getPlayerValue(p, key) {
  if (key === "active") {
    const th = p.teamHistory;
    if (!th || !th.length) return "?";
    return th[0]?.to === "Present" ? true : false;
  }
  if (key === "pastTeam") {
    const th = p.teamHistory;
    const currentTeam = (p.stats ?? p).team;
    if (!th || th.length <= 1) return "no other teams";
    const otherTeams = th.filter((e) => e.team && e.team !== currentTeam).map((e) => e.team);
    if (!otherTeams.length) return "no other teams";
    return otherTeams[Math.floor(Math.random() * otherTeams.length)];
  }
  const stats = p.stats ?? p;
  return stats[key] ?? p[key] ?? "?";
}

// Load player data
fetch("players.json")
  .then(res => res.json())
  .then(data => {
    players = Array.isArray(data) ? data : (data.players ?? []);
    startGame();
  })
  .catch(() => alert("Failed to load player data!"));

function startGame() {
  currentPlayer = players[Math.floor(Math.random() * players.length)];
  revealedCount = 0;
  wrongGuessesAfterAllRevealed = 0;
  endGame.classList.add("hidden");
  playerInput.value = "";
  tilesContainer.innerHTML = "";

  CATEGORIES.forEach(cat => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("tile-wrapper");

    const categoryLabel = document.createElement("div");
    categoryLabel.classList.add("tile-category");
    categoryLabel.textContent = cat.label.toUpperCase();
    wrapper.appendChild(categoryLabel);

    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.category = cat.key;
    tile.textContent = "?";
    wrapper.appendChild(tile);

    tilesContainer.appendChild(wrapper);
  });
}

// Handle guess
guessBtn.addEventListener("click", () => {
  const guess = playerInput.value.trim();
  if (!guess) return;

  const allTilesRevealed = revealedCount >= maxPoints;

  if (!allTilesRevealed) {
    revealNextTile();
  }

  const playerName = currentPlayer.nick ?? currentPlayer.name ?? "";
  if (guess.toLowerCase() === playerName.toLowerCase()) {
    const points = allTilesRevealed
      ? Math.max(1, maxPoints - revealedCount + 1)
      : Math.max(maxPoints - revealedCount + 1, 0);
    revealAllTiles();
    showEndGame(true, points);
  } else {
    if (allTilesRevealed) {
      wrongGuessesAfterAllRevealed++;
      if (wrongGuessesAfterAllRevealed > 0) {
        revealAllTiles();
        showEndGame(false, 0);
      }
    }
  }

  playerInput.value = "";
});

function revealNextTile() {
  const tiles = Array.from(document.querySelectorAll(".tile:not(.revealed)"));
  if (tiles.length === 0) return;

  const tile = tiles[Math.floor(Math.random() * tiles.length)];
  const cat = tile.dataset.category;

  const flag = getPlayerValue(currentPlayer, "flag");
  const hasFlag = flag && flag !== "?" && (flag.startsWith("http") || flag.startsWith("/"));
  if (cat === "country" && hasFlag) {
    const img = document.createElement("img");
    img.src = flag.startsWith("http") ? flag : "https://www.hltv.org" + flag;
    img.alt = "Flag";
    img.classList.add("tile-flag");
    tile.innerHTML = "";
    tile.appendChild(img);
  } else {
    const val = getPlayerValue(currentPlayer, cat);
    tile.textContent = val === true ? "Active" : val === false ? "retired/no current team" : String(val);
  }

  tile.classList.add("revealed");
  revealedCount++;
}

function revealAllTiles() {
  document.querySelectorAll(".tile").forEach(tile => {
    if (!tile.classList.contains("revealed")) {
      const cat = tile.dataset.category;
      const flag = getPlayerValue(currentPlayer, "flag");
      const hasFlag = flag && flag !== "?" && (flag.startsWith("http") || flag.startsWith("/"));
      if (cat === "country" && hasFlag) {
        const img = document.createElement("img");
        img.src = flag.startsWith("http") ? flag : "https://www.hltv.org" + flag;
        img.alt = "Flag";
        img.classList.add("tile-flag");
        tile.innerHTML = "";
        tile.appendChild(img);
      } else {
        const val = getPlayerValue(currentPlayer, cat);
        tile.textContent = val === true ? "Active" : val === false ? "retired/no current team" : String(val);
      }
      tile.classList.add("revealed");
    }
  });
}

function showEndGame(won, points) {
  const name = currentPlayer.nick ?? currentPlayer.name ?? "?";
  const link = getPlayerValue(currentPlayer, "playerLink") || currentPlayer.playerLink || "";
  const hltvLink = link.startsWith("http") ? link : "https://www.hltv.org" + link;
  const photo = currentPlayer.stats?.photo || currentPlayer.photo || "";
  finalScore.innerHTML = `
    <strong>${name}</strong><br>
    ${photo ? `<img src="${photo}" alt="${name}" style="width: 200px; height: auto; border-radius: 8px; margin: 10px 0;"><br>` : ''}
    ${won
      ? `You guessed correctly! Points: ${points}`
      : `You did not guess correctly! Points: 0`}
    <br>
    <a href="${hltvLink}" target="_blank" style="color:white;">View stats</a>
  `;
  endGame.classList.remove("hidden");
}

// Restart
restartBtn.addEventListener("click", startGame);

// Autocomplete
playerInput.addEventListener("input", function () {
  const val = this.value.toLowerCase();
  autocompleteList.innerHTML = "";
  if (!val) {
    autocompleteList.style.display = 'none';
    return;
  }

  const matches = players.filter(p => {
    const n = (p.nick ?? p.name ?? "").toLowerCase();
    return n.startsWith(val.toLowerCase());
  });
  if (matches.length === 0) {
    autocompleteList.style.display = 'none';
    return;
  }
  autocompleteList.style.display = 'block';
  matches.forEach(p => {
    const item = document.createElement("div");
    item.textContent = p.nick ?? p.name ?? "";
    item.addEventListener("click", () => {
      playerInput.value = p.nick ?? p.name ?? "";
      autocompleteList.innerHTML = "";
      autocompleteList.style.display = 'none';
    });
    autocompleteList.appendChild(item);
  });
});
