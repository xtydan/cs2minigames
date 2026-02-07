let playersData = [];
let currentLevel = null;
let targetPlayer = null;
let attemptsLeft = 5;
let currentDifficulty = 'easy'; // default to easy

const setupSection = document.getElementById('setupSection');
const levelSelection = document.getElementById('levelSelection');
const gamePanel = document.getElementById('gamePanel');
const tilesContainer = document.getElementById('tiles');
const backBtn = document.getElementById('backBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const changeDifficultyBtn = document.getElementById('changeDifficultyBtn');
const levelInfo = document.getElementById('levelInfo');
const playerInput = document.getElementById('playerInput');
const guessBtn = document.getElementById('guessBtn');
const autocompleteList = document.getElementById('autocomplete-list');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const endGameEl = document.getElementById('endGame');
const easyBtn = document.getElementById('easyBtn');
const hardBtn = document.getElementById('hardBtn');
const startBtn = document.getElementById('startBtn');
const backToDifficultyBtn = document.getElementById('backToDifficultyBtn');

const levelDescriptions = {
  easy: 'You see teams and dates, guess the player!',
  medium: 'Teams in order, dates hidden.',
  hard: 'Teams shuffled, no dates.'
};

// fetch players.json and normalize structure to what the game expects
async function loadPlayers(difficulty = 'easy') {
  const fileName = difficulty === 'easy' ? 'easyPlayers.json' : 'hardPlayers.json';
  const response = await fetch(`./${fileName}`);
  const rawPlayers = await response.json();

  // players.json uses "teamHistory", but the game expects "teams"
  playersData = rawPlayers
    .map(p => ({
      nick: p.nick,
      // photo for end-screen (from stats.photo)
      photo: p.stats && p.stats.photo ? p.stats.photo : '',
      teams: (p.teamHistory || []).map(t => ({
        team: t.team,
        logo: t.logo,
        from: t.from,
        to: t.to
      }))
    }))
    // keep only players that have at least one team entry
    .filter(p => p.teams && p.teams.length > 0);
}

function startGame(level) {
  currentLevel = level;
  levelSelection.classList.add('hidden');
  gamePanel.classList.remove('hidden');
  levelInfo.textContent = levelDescriptions[level];

  tilesContainer.innerHTML = '';
  playerInput.value = '';
  autocompleteList.innerHTML = '';
  autocompleteList.style.display = 'none';
  attemptsLeft = 5;
  attemptsLeftEl.textContent = attemptsLeft;
  endGameEl.classList.add('hidden');
  playerInput.disabled = false;
  guessBtn.disabled = false;

  targetPlayer = playersData[Math.floor(Math.random() * playersData.length)];

  let teams = targetPlayer.teams.map(t => ({ ...t }));

  if(level === 'easy' || level === 'medium') {
    teams = teams.reverse(); // odwrócona kolejność
    if(level === 'medium') {
      teams = teams.map(t => ({ ...t, from: '', to: '' }));
    }
  } else if(level === 'hard') {
    teams = teams.sort(() => Math.random() - 0.5)
                 .map(t => ({ ...t, from: '', to: '' }));
  }

  teams.forEach(t => {
    const tile = document.createElement('div');
    tile.classList.add('tile-wrapper');

    const img = document.createElement('img');
    img.src = t.logo;
    img.alt = t.team;
    img.classList.add('tile-flag');
    tile.appendChild(img);

    const text = document.createElement('div');
    text.classList.add('tile-category');
    text.innerHTML = t.team + (t.from ? `<br><span style="font-size:14px">${t.from} - ${t.to}</span>` : '');
    tile.appendChild(text);

    tilesContainer.appendChild(tile);
  });
}

function autocomplete(value) {
  const val = value.toLowerCase();
  autocompleteList.innerHTML = '';
  if(!val) {
    autocompleteList.style.display = 'none';
    return;
  }

  const matches = playersData.filter(p => p.nick.toLowerCase().startsWith(val));

  if(matches.length === 0) {
    autocompleteList.style.display = 'none';
    return;
  }

  autocompleteList.style.display = 'block';

  matches.slice(0, 5).forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.nick;
    item.addEventListener('click', () => {
      playerInput.value = p.nick;
      autocompleteList.innerHTML = '';
      autocompleteList.style.display = 'none';
    });
    autocompleteList.appendChild(item);
  });
}

function checkGuess() {
  const guess = playerInput.value.trim();
  if(!guess) return;

  if(guess.toLowerCase() === targetPlayer.nick.toLowerCase()) {
    const photoHtml = targetPlayer.photo
      ? `<br><img src="${targetPlayer.photo}" alt="${targetPlayer.nick}" style="margin-top:8px; max-width:120px; border-radius:4px;">`
      : '';
    endGameEl.innerHTML = `✅ Correct! The player was ${targetPlayer.nick}${photoHtml}`;
    endGameEl.classList.remove('hidden');
    playerInput.disabled = true;
    guessBtn.disabled = true;
  } else {
    attemptsLeft--;
    attemptsLeftEl.textContent = attemptsLeft;

    // pokazujemy info o złej próbie
    endGameEl.textContent = `❌ Wrong guess! Try again.`;
    endGameEl.classList.remove('hidden');

    // czyścimy pole do wpisywania
    playerInput.value = '';

    if(attemptsLeft <= 0) {
      const photoHtml = targetPlayer.photo
        ? `<br><img src="${targetPlayer.photo}" alt="${targetPlayer.nick}" style="margin-top:8px; max-width:120px; border-radius:4px;">`
        : '';
      endGameEl.innerHTML = `❌ Game Over! The player was ${targetPlayer.nick}${photoHtml}`;
      playerInput.disabled = true;
      guessBtn.disabled = true;
    }
  }
}

// DIFFICULTY SELECTION
easyBtn.addEventListener('click', () => {
  easyBtn.classList.add('selected');
  hardBtn.classList.remove('selected');
  currentDifficulty = 'easy';
});

hardBtn.addEventListener('click', () => {
  hardBtn.classList.add('selected');
  easyBtn.classList.remove('selected');
  currentDifficulty = 'hard';
});

// START GAME
startBtn.addEventListener('click', async () => {
  await loadPlayers(currentDifficulty);
  setupSection.classList.add('hidden');
  levelSelection.classList.remove('hidden');
});

// LEVEL SELECTION
document.querySelectorAll('.level-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    document.querySelectorAll('.level-tile').forEach(t => t.classList.remove('active'));
    tile.classList.add('active');
    startGame(tile.dataset.level);
  });
});

// BACK TO MAIN BUTTON
backToMainBtn.addEventListener('click', () => {
  window.location.href = '../index.html';
});

// CHANGE DIFFICULTY BUTTON
changeDifficultyBtn.addEventListener('click', () => {
  gamePanel.classList.add('hidden');
  setupSection.classList.remove('hidden');
  // Reset game state
  currentLevel = null;
  targetPlayer = null;
  attemptsLeft = 5;
  playerInput.value = '';
  endGameEl.classList.add('hidden');
  playerInput.disabled = false;
  guessBtn.disabled = false;
});

// BACK BUTTON
backBtn.addEventListener('click', () => {
  gamePanel.classList.add('hidden');
  levelSelection.classList.remove('hidden');
  document.querySelectorAll('.level-tile').forEach(t => t.classList.remove('active'));
});

// BACK TO DIFFICULTY BUTTON
backToDifficultyBtn.addEventListener('click', () => {
  levelSelection.classList.add('hidden');
  setupSection.classList.remove('hidden');
});

// GO BACK BUTTON
goBackBtn.addEventListener('click', () => {
  window.location.href = '../index.html';
});

// AUTOCOMPLETE EVENTS
playerInput.addEventListener('input', (e) => autocomplete(e.target.value));
guessBtn.addEventListener('click', checkGuess);

// load players at start
loadPlayers();
