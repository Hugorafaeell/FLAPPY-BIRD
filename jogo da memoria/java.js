document.addEventListener('DOMContentLoaded', () => {
  const playerInputContainer = document.getElementById('playerInputContainer');
  const difficultyContainer = document.getElementById('difficultyContainer');
  const gameContainer = document.getElementById('gameContainer');
  const victoryContainer = document.getElementById('victoryContainer');
  const startBtn = document.getElementById('startBtn');
  const playerNameInput = document.getElementById('playerName');
  const messageEl = document.getElementById('message');
  const scoreEl = document.getElementById('score');
  const gameBoard = document.getElementById('gameBoard');
  const playerNameDisplay = document.getElementById('playerNameDisplay');
  const finalScoreDisplay = document.getElementById('finalScore');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const highScoresList = document.getElementById('highScoresList');

  let playerName = '';
  let difficulty = '';
  let cards = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let score = 0;
  let matchedPairs = 0;
  let totalPairs = 0;

  // Emojis para cartas (pode trocar por URLs ou outras imagens)
  const emojis = ['🍎','🍌','🍇','🍉','🍓','🍒','🥝','🍍','🥥','🍑','🥭','🍐','🍋','🍊','🍈','🍏','🥑','🥕','🌽','🍅','🥔','🍄','🌰','🥜','🍞','🧀','🥓','🍗','🍖','🌭','🍔','🍟','🍕'];

  // Configurações dificuldade -> quantidade de pares
  const difficultyLevels = {
    easy: 8,     // 4x4 = 16 cartas = 8 pares
    medium: 18,  // 6x6 = 36 cartas = 18 pares
    hard: 32     // 8x8 = 64 cartas = 32 pares
  };

  startBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name === '') {
      alert('Por favor, digite seu nome!');
      return;
    }
    playerName = name;
    playerInputContainer.style.display = 'none';
    difficultyContainer.style.display = 'block';
  });

  difficultyContainer.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    difficulty = e.target.getAttribute('data-level');
    difficultyContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    playerNameDisplay.textContent = playerName;
    initGame();
  });

  playAgainBtn.addEventListener('click', () => {
    victoryContainer.style.display = 'none';
    playerInputContainer.style.display = 'block';
    playerNameInput.value = '';
    score = 0;
    scoreEl.textContent = 'Pontuação: 0';
  });

  function initGame() {
    score = 0;
    matchedPairs = 0;
    scoreEl.textContent = 'Pontuação: 0';
    messageEl.textContent = '';
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    // Prepara cartas duplicadas e embaralha
    const pairsCount = difficultyLevels[difficulty];
    totalPairs = pairsCount;
    const selectedEmojis = emojis.slice(0, pairsCount);
    cards = shuffle([...selectedEmojis, ...selectedEmojis]);

    // Define grid conforme dificuldade
    switch (difficulty) {
      case 'easy':
        gameBoard.style.gridTemplateColumns = 'repeat(4, 80px)';
        break;
      case 'medium':
        gameBoard.style.gridTemplateColumns = 'repeat(6, 80px)';
        break;
      case 'hard':
        gameBoard.style.gridTemplateColumns = 'repeat(8, 80px)';
        break;
    }

    // Cria cartas no tabuleiro
    gameBoard.innerHTML = '';
    cards.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.emoji = emoji;
      card.addEventListener('click', onCardClick);
      gameBoard.appendChild(card);
    });
  }

  function onCardClick(e) {
    if (lockBoard) return;
    const clickedCard = e.currentTarget;
    if (clickedCard === firstCard || clickedCard.classList.contains('matched')) return;

    flipCard(clickedCard);

    if (!firstCard) {
      firstCard = clickedCard;
      return;
    }

    secondCard = clickedCard;
    lockBoard = true;

    checkMatch();
  }

  function flipCard(card) {
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
  }

  function unflipCard(card) {
    card.classList.remove('flipped');
    card.textContent = '';
  }

  function checkMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    if (isMatch) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      score += 5;
      matchedPairs++;
      updateScore();
      resetTurn();

      if (matchedPairs === totalPairs) {
        setTimeout(gameWin, 500);
      }
    } else {
      score -= 3;
      updateScore();
      setTimeout(() => {
        unflipCard(firstCard);
        unflipCard(secondCard);
        resetTurn();
      }, 1000);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function updateScore() {
    if(score < 0) score = 0;
    scoreEl.textContent = 'Pontuação: ' + score;
  }

  function gameWin() {
    gameContainer.style.display = 'none';
    victoryContainer.style.display = 'block';
    finalScoreDisplay.textContent = score;
    saveHighScore();
    showHighScores();
  }

  function saveHighScore() {
    let highScores = JSON.parse(localStorage.getItem('memoryHighScores')) || [];
    highScores.push({ name: playerName, score: score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('memoryHighScores', JSON.stringify(highScores));
  }

  function showHighScores() {
    let highScores = JSON.parse(localStorage.getItem('memoryHighScores')) || [];
    highScoresList.innerHTML = '';
    highScores.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: ${entry.score}`;
      highScoresList.appendChild(li);
    });
  }

  // Fisher-Yates shuffle
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

});
