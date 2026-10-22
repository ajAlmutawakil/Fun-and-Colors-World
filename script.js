// =========================================
// 1. Text-To-Speech Feature for Animals
// =========================================
function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any previous sound

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // English Speech
        utterance.pitch = 1.3;    // Playful pitch for kids
        utterance.rate = 0.9;     // Clear and comfortable pace
        
        window.speechSynthesis.speak(utterance);
    } else {
        alert(text);
    }
}

// =========================================
// 2. Magic Canvas Logic
// =========================================
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');

let isDrawing = false;

// Fill canvas with white background
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

// Touch events for tablets and mobile
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

// Clear canvas button
clearBtn.addEventListener('click', () => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// =========================================
// 3. Memory Game Logic
// =========================================
const emojis = ['🦄', '🦄', '🎈', '🎈', '🍦', '🍦', '🐥', '🐥'];
let flippedCards = [];
let matchedCount = 0;

const memoryBoard = document.getElementById('memoryBoard');
const restartBtn = document.getElementById('restartGameBtn');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function initGame() {
    memoryBoard.innerHTML = '';
    flippedCards = [];
    matchedCount = 0;
    
    const shuffledEmojis = shuffle([...emojis]);

    shuffledEmojis.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.emoji = emoji;
        card.innerText = emoji;

        card.addEventListener('click', handleCardClick);
        memoryBoard.appendChild(card);
    });
}

function handleCardClick() {
    if (this.classList.contains('flipped') || flippedCards.length === 2) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedCount += 2;

        if (matchedCount === emojis.length) {
            setTimeout(() => {
                speakText('Great job little champ! You won the game! 🎉');
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 800);
    }
}

restartBtn.addEventListener('click', initGame);

// Initialize game on load
initGame();