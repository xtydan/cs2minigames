// Game state
let players = [];
let currentRound = null;
let score = 0;
let total = 0;
let selectedDatabase = 'easyPlayers.json';

// DOM elements
const loadingEl = document.getElementById('loading');
const gameContainer = document.getElementById('game-container');
const playersGrid = document.getElementById('players-grid');
const feedbackEl = document.getElementById('feedback');
const feedbackMessage = document.getElementById('feedback-message');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const hintText = document.getElementById('hint-text');
const setupSection = document.getElementById('setupSection');
const gameHeader = document.getElementById('gameHeader');
const easyBtn = document.getElementById('easyBtn');
const hardBtn = document.getElementById('hardBtn');
const startBtn = document.getElementById('startBtn');
const changeDifficultyBtn = document.getElementById('changeDifficultyBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');

// Load players from JSON
async function loadPlayers() {
    try {
        const response = await fetch(selectedDatabase);
        players = await response.json();
        loadingEl.style.display = 'none';
        gameContainer.style.display = 'block';
        generateRound();
    } catch (error) {
        console.error('Error loading players:', error);
        loadingEl.innerHTML = '<p>Error loading game. Make sure the selected database file is in the same folder.</p>';
    }
}

// Get country code from flag URL
function getCountryFromFlag(flag) {
    const match = flag.match(/\/([A-Z]{2})\.gif$/);
    return match ? match[1] : 'Unknown';
}

// Get flag image URL
function getFlagUrl(flag) {
    if (flag.startsWith('http')) return flag;
    return `https://www.hltv.org${flag}`;
}

// Generate a new round
function generateRound() {
    if (players.length < 10) {
        alert('Not enough players in database!');
        return;
    }

    // Map countries to regions
    const getRegion = (countryCode) => {
        const regions = {
            'Scandinavia': ['SE', 'DK', 'NO', 'FI'],
            'CIS': ['RU', 'UA', 'KZ', 'BY'],
            'Western Europe': ['FR', 'BE', 'NL', 'LU', 'CH'],
            'Southern Europe': ['ES', 'PT', 'IT', 'GR'],
            'Central Europe': ['DE', 'AT', 'PL', 'CZ', 'SK', 'HU'],
            'UK & Ireland': ['GB', 'IE'],
            'Balkans': ['RS', 'HR', 'BA', 'BG', 'RO', 'AL', 'MK'],
            'North America': ['US', 'CA'],
            'South America': ['BR', 'AR', 'CL', 'PE', 'UY'],
            'Asia': ['CN', 'KR', 'JP', 'TH', 'VN', 'ID', 'MY', 'SG'],
            'Middle East': ['TR', 'IL', 'SA', 'AE'],
            'Oceania': ['AU', 'NZ']
        };
        
        for (const [region, countries] of Object.entries(regions)) {
            if (countries.includes(countryCode)) return region;
        }
        return 'Other';
    };

    // Check if player is still active
    const isActive = (p) => {
        return p.teamHistory.length > 0 && p.teamHistory[0].to === 'Present';
    };

    // Get teams where player played with overlap (same team, same time period)
    const getTeammateTeams = (p) => {
        return p.teamHistory.map(t => `${t.team}|${t.from}|${t.to}`);
    };

    // Define possible categories (only qualitative features)
    const categories = [
        {
            name: 'Same Country',
            check: (p) => getCountryFromFlag(p.stats.flag),
            description: (value) => `3 players are from <strong>${value}</strong>`,
            isArray: false
        },
        {
            name: 'Same Region',
            check: (p) => getRegion(getCountryFromFlag(p.stats.flag)),
            description: (value) => `3 players are from <strong>${value}</strong>`,
            isArray: false
        },
        {
            name: 'Played in Same Team',
            check: (p) => p.teamHistory.map(t => t.team),
            description: (value) => `3 players played in <strong>${value}</strong>`,
            isArray: true
        },
        {
            name: 'Played Together',
            check: (p) => getTeammateTeams(p),
            description: (value) => {
                const teamName = value.split('|')[0];
                return `3 players were teammates in <strong>${teamName}</strong>`;
            },
            isArray: true
        },
        {
            name: 'Still Active',
            check: (p) => isActive(p) ? 'active' : 'retired',
            description: (value) => value === 'active' 
                ? `3 players are <strong>still active</strong> (currently playing)` 
                : `3 players are <strong>retired</strong> (not currently playing)`,
            isArray: false
        },
        {
            name: 'Major Winner',
            check: (p) => (p.stats.majorWins && p.stats.majorWins > 0) ? 'winner' : 'no-major',
            description: (value) => value === 'winner'
                ? `3 players <strong>won a Major</strong>`
                : `3 players <strong>never won a Major</strong>`,
            isArray: false
        }
    ];

    // Pick random category
    const category = categories[Math.floor(Math.random() * categories.length)];

    // Group players by category value
    const groups = {};
    players.forEach(player => {
        const value = category.check(player);
        
        if (category.isArray) {
            value.forEach(team => {
                if (!groups[team]) groups[team] = [];
                groups[team].push(player);
            });
        } else {
            if (!groups[value]) groups[value] = [];
            groups[value].push(player);
        }
    });

    // Find valid groups (at least 3 players)
    const validGroups = Object.entries(groups).filter(([_, players]) => players.length >= 3);
    
    if (validGroups.length === 0) {
        generateRound(); // Try again
        return;
    }

    // Pick random group
    const [commonValue, commonPlayers] = validGroups[Math.floor(Math.random() * validGroups.length)];
    
    // Remove duplicates from commonPlayers (same player can appear multiple times if category is team history)
    const uniqueCommonPlayers = [];
    const seenNicks = new Set();
    for (const player of commonPlayers) {
        if (!seenNicks.has(player.nick)) {
            uniqueCommonPlayers.push(player);
            seenNicks.add(player.nick);
        }
    }
    
    // Pick 3 random UNIQUE players from common group
    const shuffled = [...uniqueCommonPlayers].sort(() => Math.random() - 0.5);
    const threePlayers = shuffled.slice(0, 3);
    const threeNicks = threePlayers.map(p => p.nick);

    // Find an outlier (must be different AND not in threePlayers)
    let outlier;
    let attempts = 0;
    
    do {
        outlier = players[Math.floor(Math.random() * players.length)];
        const outlierValue = category.check(outlier);
        
        // Check if outlier is not already selected AND is different
        const notAlreadySelected = !threeNicks.includes(outlier.nick);
        
        if (notAlreadySelected) {
            if (category.isArray) {
                if (!outlierValue.includes(commonValue)) break;
            } else {
                if (outlierValue !== commonValue) break;
            }
        }
        
        attempts++;
    } while (attempts < 100);

    if (attempts >= 100) {
        generateRound(); // Try again
        return;
    }

    // Combine and shuffle all 4 players
    const allFour = [...threePlayers, outlier].sort(() => Math.random() - 0.5);

    // Store current round
    currentRound = {
        players: allFour,
        outlierNick: outlier.nick,
        category: category.name,
        commonValue: commonValue,
        description: category.isArray 
            ? category.description(commonValue)
            : category.description(commonValue)
    };

    // Update UI
    renderPlayers();
    feedbackEl.style.display = 'none';
    hintText.innerHTML = 'Find the common feature! Three players share something that one doesn\'t.';
}

// Render player cards (ONLY nick and photo before answer)
function renderPlayers() {
    playersGrid.innerHTML = '';
    
    currentRound.players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.dataset.nick = player.nick;
        
        // Show ONLY the photo and nickname initially
        const photoUrl = player.stats.photo || 'https://img-cdn.hltv.org/playerbodyshot/placeholder.png';
        
        card.innerHTML = `
            <div class="player-nick-only">
                <img src="${photoUrl}" alt="${player.nick}" class="player-photo" onerror="this.style.display='none'">
                <h2>${player.nick}</h2>
            </div>
            <div class="player-details" style="display: none;">
                <!-- Everything hidden until answer -->
            </div>
        `;
        
        card.addEventListener('click', () => handlePlayerClick(player.nick, card));
        playersGrid.appendChild(card);
    });
}

// Handle player card click
function handlePlayerClick(playerNick, clickedCard) {
    if (feedbackEl.style.display !== 'none') return; // Already answered

    const isCorrect = playerNick === currentRound.outlierNick;
    total++;
    totalEl.textContent = total;

    // Mark all cards and SHOW ALL DETAILS
    const cards = document.querySelectorAll('.player-card');
    cards.forEach(card => {
        card.classList.add('selected');
        
        // Get player data
        const player = currentRound.players.find(p => p.nick === card.dataset.nick);
        
        // Get team history string
        const recentTeams = player.teamHistory
            .slice(0, 3)
            .map(t => t.team)
            .join(', ');
        
        // Hide nickname-only view
        const nickOnly = card.querySelector('.player-nick-only');
        nickOnly.style.display = 'none';
        
        // Show full details
        const detailsDiv = card.querySelector('.player-details');
        detailsDiv.style.display = 'block';
        detailsDiv.innerHTML = `
            <div class="player-header">
                <img src="${player.stats.photo || 'https://img-cdn.hltv.org/playerbodyshot/placeholder.png'}" alt="${player.nick}" class="player-photo-small" onerror="this.style.display='none'">
                <div class="player-info-detailed">
                    <div class="player-flag-name">
                        <img src="${getFlagUrl(player.stats.flag)}" alt="Flag" class="player-flag" onerror="this.style.display='none'">
                        <h3>${player.nick}</h3>
                    </div>
                    <div class="player-team">
                        <span>${player.stats.team || 'no current team'}</span>
                    </div>
                </div>
            </div>
            <div class="player-history">
                <div class="history-label">Team History:</div>
                <div class="history-teams">${recentTeams}</div>
            </div>
            <div class="player-stats">
                <div class="stat">
                    <div class="stat-label">Rating</div>
                    <div class="stat-value">${player.stats.rating.toFixed(2)}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">K/D</div>
                    <div class="stat-value">${player.stats.kd.toFixed(2)}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Maps</div>
                    <div class="stat-value">${player.stats.maps}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Age</div>
                    <div class="stat-value">${player.stats.age}</div>
                </div>
            </div>
        `;
        
        if (card.dataset.nick === currentRound.outlierNick) {
            card.classList.add('correct');
        } else if (card.dataset.nick === playerNick && !isCorrect) {
            card.classList.add('wrong');
        } else if (card.dataset.nick !== currentRound.outlierNick) {
            card.classList.add('revealed');
        }
    });

    // Show feedback
    if (isCorrect) {
        score++;
        scoreEl.textContent = score;
        feedbackMessage.innerHTML = `✅ Correct!<br>${currentRound.description}`;
        feedbackEl.className = 'feedback correct';
    } else {
        feedbackMessage.innerHTML = `❌ Wrong! The outlier was <strong>${currentRound.outlierNick}</strong>.<br>${currentRound.description}`;
        feedbackEl.className = 'feedback wrong';
    }

    feedbackEl.style.display = 'block';
}

// Difficulty selection
easyBtn.addEventListener('click', () => {
    selectedDatabase = 'easyPlayers.json';
    easyBtn.classList.add('selected');
    hardBtn.classList.remove('selected');
});

hardBtn.addEventListener('click', () => {
    selectedDatabase = 'hardPlayers.json';
    hardBtn.classList.add('selected');
    easyBtn.classList.remove('selected');
});

// Go back button
goBackBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Start game button
startBtn.addEventListener('click', () => {
    setupSection.style.display = 'none';
    gameHeader.style.display = 'block';
    loadPlayers();
});

// Change difficulty button
changeDifficultyBtn.addEventListener('click', () => {
    setupSection.style.display = 'block';
    gameHeader.style.display = 'none';
    gameContainer.style.display = 'none';
    loadingEl.style.display = 'none';
    feedbackEl.style.display = 'none';
    score = 0;
    total = 0;
    scoreEl.textContent = score;
    totalEl.textContent = total;
});

// Go to Main Menu button
mainMenuBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
});

// Next round button
nextBtn.addEventListener('click', () => {
    generateRound();
});
