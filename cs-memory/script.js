document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("grid");
  const movesDisplay = document.getElementById("scoreboard");
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("startBtn");
  const numCardsSelect = document.getElementById("numCards");

  const endScreen = document.getElementById("endScreen");
  const finalMoves = document.getElementById("finalMoves");
  const finalTime = document.getElementById("finalTime");
  const restartBtn = document.getElementById("restartBtn");

  // Allowed numbers of cards
  const allowedNumbers = [8, 10, 12];
  allowedNumbers.forEach(num => {
    const option = document.createElement("option");
    option.value = num;
    option.textContent = num;
    numCardsSelect.appendChild(option);
  });

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let score = 0;
  let totalPairs = 0;

  let timer = 0;
  let timerInterval = null;
  let timerStarted = false;

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => {
    endScreen.style.display = "none";
    startGame();
  });
  goBackBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });

  function startGame() {
    grid.innerHTML = "";
    moves = 0;
    score = 0;
    totalPairs = parseInt(numCardsSelect.value);
    movesDisplay.textContent = "Moves: 0";
    timer = 0;
    timerDisplay.textContent = "Time: 0s";
    clearInterval(timerInterval);
    timerStarted = false;

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    const images = [];
    for (let i = 1; i <= totalPairs; i++) images.push(`zaw${i}`);

    const cardsArray = [...images, ...images];
    cardsArray.sort(() => 0.5 - Math.random());

    const totalCards = totalPairs * 2;
    const maxCols = Math.ceil(Math.sqrt(totalCards));
    const cols = findBestDivisor(totalCards, maxCols);

    const gap = 10;
    grid.style.gap = `${gap}px`;
    const rows = totalCards / cols;
    const availableWidth = window.innerWidth * 0.9 - (cols - 1) * gap;
    const availableHeight = window.innerHeight * 0.8 - (rows - 1) * gap;
    const cardSize = Math.floor(Math.min(availableWidth / cols, availableHeight / rows));

    grid.style.gridTemplateColumns = `repeat(${cols}, ${cardSize}px)`;

    cardsArray.forEach((name) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.image = name;
      card.style.width = `${cardSize}px`;
      card.style.height = `${cardSize}px`;

      const front = document.createElement("div");
      front.classList.add("front");
      card.appendChild(front);

      const back = document.createElement("div");
      back.classList.add("back");
      const img = document.createElement("img");
      img.src = `images/${name}.png`;
      back.appendChild(img);
      card.appendChild(back);

      card.addEventListener("click", flipCard);
      grid.appendChild(card);
    });
  }

  function findBestDivisor(total, maxCols) {
    for (let i = maxCols; i >= 1; i--) {
      if (total % i === 0) return i;
    }
    return 1;
  }

  function startTimer() {
    if (!timerStarted) {
      timerStarted = true;
      timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}s`;
      }, 1000);
    }
  }

  function flipCard() {
    startTimer();

    if (lockBoard) return;
    if (this === firstCard || this.classList.contains("matched")) return;

    this.classList.add("flipped");

    if (!firstCard) {
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;

    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    if (firstCard.dataset.image === secondCard.dataset.image) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      score++;

      resetBoard();

      if (score === totalPairs) {
        clearInterval(timerInterval);
        finalMoves.textContent = `Total Moves: ${moves}`;
        finalTime.textContent = `Time Taken: ${timer}s`;
        endScreen.style.display = "flex";
      }

    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
      }, 1000);
    }
  }

  function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

});
