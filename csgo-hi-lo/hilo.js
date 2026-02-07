// ===== DEFAULTS (fallback when categories not in JSON) =====
const DEFAULT_CATEGORY_LABELS = {
  rating: 'Rating 3.0',
  kd: 'K/D Ratio',
  maps: 'Maps Played',
  kdDiff: 'K-D Difference',
  rounds: 'Rounds'
};

let categories = [];
let players = [];
let currentCategory;
let score = 0;
let streak = 0;
let difficulty = 'easy'; // Default difficulty

// ===== DOM ELEMENTS =====
const name1 = document.getElementById('name1');
const team1 = document.getElementById('team1');
const stat1 = document.getElementById('stat1');
const flag1 = document.getElementById('flag1');
const logo1 = document.getElementById('logo1');

const name2 = document.getElementById('name2');
const team2 = document.getElementById('team2');
const stat2 = document.getElementById('stat2');
const flag2 = document.getElementById('flag2');
const logo2 = document.getElementById('logo2');

const tile1 = document.getElementById('player1');
const tile2 = document.getElementById('player2');

const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const categoryEl = document.getElementById('category');

const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');
const easyBtn = document.getElementById('easyBtn');
const hardBtn = document.getElementById('hardBtn');
const startBtn = document.getElementById('startBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const changeDifficultyBtn = document.getElementById('changeDifficultyBtn');
const goBackBtn = document.getElementById('goBackBtn');

// ===== LOAD DATA =====
function loadPlayers() {
  const fileName = difficulty === 'easy' ? './easyPlayers.json' : './hardPlayers.json';
  fetch(fileName)
    .then(res => res.json())
    .then(data => {
      if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
        players = data.players || [];
      } else if (Array.isArray(data)) {
        players = data;
        categories = deriveCategoriesFromPlayers(players);
      } else {
        players = data.players || [];
        categories = data.categories || deriveCategoriesFromPlayers(players);
      }
      if (categories.length === 0) categories = Object.entries(DEFAULT_CATEGORY_LABELS).map(([key, label]) => ({ key, label }));
      nextRound();
    })
    .catch(err => console.error(`Error loading ${fileName}:`, err));
}

// ===== DIFFICULTY SELECTION =====
easyBtn.addEventListener('click', () => {
  difficulty = 'easy';
  easyBtn.classList.add('selected');
  hardBtn.classList.remove('selected');
});

hardBtn.addEventListener('click', () => {
  difficulty = 'hard';
  hardBtn.classList.add('selected');
  easyBtn.classList.remove('selected');
});

startBtn.addEventListener('click', () => {
  setupSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  loadPlayers();
});

backToMainBtn.addEventListener('click', () => {
  gameSection.classList.add('hidden');
  setupSection.classList.remove('hidden');
  score = 0;
  streak = 0;
  scoreEl.textContent = score;
  streakEl.textContent = '🔥 Streak: 0';
});

changeDifficultyBtn.addEventListener('click', () => {
  gameSection.classList.add('hidden');
  setupSection.classList.remove('hidden');
  score = 0;
  streak = 0;
  scoreEl.textContent = score;
  streakEl.textContent = '🔥 Streak: 0';
});

// GO BACK BUTTON
goBackBtn.addEventListener('click', () => {
  window.location.href = '../index.html';
});

function deriveCategoriesFromPlayers(pls) {
  if (!pls || pls.length === 0) return [];
  const first = pls[0];
  const stats = first.stats || first;
  const keys = ['rating', 'kd', 'maps', 'kdDiff', 'rounds'].filter(k => typeof stats[k] === 'number');
  return keys.map(key => ({ key, label: DEFAULT_CATEGORY_LABELS[key] || key }));
}

function getPlayerName(p) { return p.nick ?? p.name ?? '?'; }
function getPlayerStat(p, key) {
  const stats = p.stats ?? p;
  return stats[key];
}
function getPlayerTeam(p) {
  const stats = p.stats ?? p;
  let team = stats.team ?? '';
  if (!team && p.teamHistory && p.teamHistory.length > 0) {
    team = p.teamHistory[0].team ?? '';
  }
  return team || '?';
}
function getPlayerFlag(p) {
  const flag = (p.stats ?? p).flag ?? '';
  return flag.startsWith('http') ? flag : 'https://www.hltv.org' + flag;
}
function getPlayerTeamLogo(p) {
  const stats = p.stats ?? p;
  let logo = stats.teamLogo ?? '';
  if (!logo && stats.team && p.teamHistory) {
    // Find logo for current team
    const currentTeam = stats.team;
    for (const team of p.teamHistory) {
      if (team.team === currentTeam && team.logo && team.logo.trim() !== '') {
        logo = team.logo;
        break;
      }
    }
  }
  if (!logo && p.teamHistory) {
    // Fallback to first logo in teamHistory
    for (const team of p.teamHistory) {
      if (team.logo && team.logo.trim() !== '') {
        logo = team.logo;
        break;
      }
    }
  }
  return logo.startsWith('http') ? logo : (logo ? 'https://img-cdn.hltv.org/' + logo.replace(/^\//, '') : '');
}
function getPlayerPhoto(p) { return (p.stats ?? p).photo ?? ''; }

// ===== GAME STATE =====
let p1, p2;

// ===== GAME LOGIC =====
function nextRound() {
  tile1.className = 'player-card';
  tile2.className = 'player-card';

  currentCategory = categories[Math.floor(Math.random() * categories.length)];
  categoryEl.textContent = currentCategory.label;

  p1 = randomPlayer();
  p2 = randomPlayer();
  while (getPlayerName(p1) === getPlayerName(p2)) p2 = randomPlayer();

  // Player 1
  name1.textContent = getPlayerName(p1);
  team1.textContent = getPlayerTeam(p1);
  stat1.textContent = '?';
  flag1.src = getPlayerFlag(p1);
  logo1.src = getPlayerTeamLogo(p1);
  photo1.src = getPlayerPhoto(p1);

  // Player 2
  name2.textContent = getPlayerName(p2);
  team2.textContent = getPlayerTeam(p2);
  stat2.textContent = '?';
  flag2.src = getPlayerFlag(p2);
  logo2.src = getPlayerTeamLogo(p2);
  photo2.src = getPlayerPhoto(p2);
}

function randomPlayer() {
  return players[Math.floor(Math.random() * players.length)];
}

function handlePick(picked, other, tile) {
  const v1 = getPlayerStat(picked, currentCategory.key);
  const v2 = getPlayerStat(other, currentCategory.key);
  const correct = v1 >= v2;

  stat1.textContent = getPlayerStat(p1, currentCategory.key);
  stat2.textContent = getPlayerStat(p2, currentCategory.key);

  if (correct) {
    score++;
    streak++;
    tile.classList.add('correct');

    if (streak >= 5) {
      streakEl.textContent = `💀 DEMON MODE x${streak}`;
    } else if (streak >= 3) {
      streakEl.textContent = `🔥 HOT STREAK x${streak}`;
    } else {
      streakEl.textContent = `🔥 Streak: ${streak}`;
    }
  } else {
    tile.classList.add('wrong');
    score = 0;
    streak = 0;
    streakEl.textContent = '❌ Streak broken';
  }

  scoreEl.textContent = score;
  setTimeout(nextRound, 1200);
}

// ===== EVENTS =====
tile1.onclick = () => handlePick(p1, p2, tile1);
tile2.onclick = () => handlePick(p2, p1, tile2);
