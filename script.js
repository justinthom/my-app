// Game Navigation
document.querySelectorAll('.game-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and containers
        document.querySelectorAll('.game-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.game-container').forEach(c => c.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show corresponding game
        const gameId = btn.getAttribute('data-game');
        document.getElementById(gameId).classList.add('active');
    });
});

// ============================================
// BREATHING EXERCISE GAME
// ============================================
let breathingInterval;
let breathCount = 0;
let isBreathing = false;
const MAX_BREATH_CYCLES = 6;

const breathingCircle = document.querySelector('.breathing-circle');
const breathText = document.querySelector('.breath-text');
const startBreathingBtn = document.getElementById('start-breathing');
const stopBreathingBtn = document.getElementById('stop-breathing');
const breathCountDisplay = document.getElementById('breath-count');
const breathProgressBar = document.getElementById('breath-progress');
const completionMessage = document.getElementById('completion-message');

function startBreathing() {
    if (isBreathing) return;

    // Reset if starting a new session
    breathCount = 0;
    breathCountDisplay.textContent = breathCount;
    breathProgressBar.style.width = '0%';
    completionMessage.style.display = 'none';

    isBreathing = true;
    startBreathingBtn.style.display = 'none';
    stopBreathingBtn.style.display = 'inline-block';

    breathingCycle();
}

function updateProgress() {
    const progress = (breathCount / MAX_BREATH_CYCLES) * 100;
    breathProgressBar.style.width = progress + '%';
}

function breathingCycle() {
    if (!isBreathing) return;

    // Check if we've completed all cycles
    if (breathCount >= MAX_BREATH_CYCLES) {
        completeBreathingSession();
        return;
    }

    // Inhale phase (4 seconds)
    breathText.textContent = 'Breathe In';
    breathingCircle.classList.remove('exhale');
    breathingCircle.classList.add('inhale');

    setTimeout(() => {
        if (!isBreathing) return;

        // Hold phase (2 seconds)
        breathText.textContent = 'Hold';

        setTimeout(() => {
            if (!isBreathing) return;

            // Exhale phase (4 seconds)
            breathText.textContent = 'Breathe Out';
            breathingCircle.classList.remove('inhale');
            breathingCircle.classList.add('exhale');

            setTimeout(() => {
                if (!isBreathing) return;

                // Complete cycle
                breathCount++;
                breathCountDisplay.textContent = breathCount;
                updateProgress();

                // Start next cycle
                breathingCycle();
            }, 4000);
        }, 2000);
    }, 4000);
}

function completeBreathingSession() {
    isBreathing = false;
    breathingCircle.classList.remove('inhale', 'exhale');
    breathText.textContent = 'Complete!';
    stopBreathingBtn.style.display = 'none';
    startBreathingBtn.style.display = 'inline-block';
    completionMessage.style.display = 'block';

    // Reset the text after a moment
    setTimeout(() => {
        breathText.textContent = 'Breathe In';
    }, 2000);
}

function stopBreathing() {
    isBreathing = false;
    breathingCircle.classList.remove('inhale', 'exhale');
    breathText.textContent = 'Breathe In';
    startBreathingBtn.style.display = 'inline-block';
    stopBreathingBtn.style.display = 'none';
}

startBreathingBtn.addEventListener('click', startBreathing);
stopBreathingBtn.addEventListener('click', stopBreathing);

// ============================================
// BUBBLE POP GAME
// ============================================
let bubbleCount = 0;
const bubbleArea = document.querySelector('.bubble-area');
const bubbleCountDisplay = document.getElementById('bubble-count');

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Random size between 30px and 80px
    const size = Math.random() * 50 + 30;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';

    // Random position
    const maxX = bubbleArea.clientWidth - size;
    const maxY = bubbleArea.clientHeight - size;
    bubble.style.left = Math.random() * maxX + 'px';
    bubble.style.top = Math.random() * maxY + 'px';

    // Random pastel color
    const colors = [
        'rgba(255, 182, 193, 0.6)',
        'rgba(176, 224, 230, 0.6)',
        'rgba(221, 160, 221, 0.6)',
        'rgba(240, 230, 140, 0.6)',
        'rgba(152, 251, 152, 0.6)',
        'rgba(255, 218, 185, 0.6)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${color})`;

    // Random animation delay
    bubble.style.animationDelay = Math.random() * 2 + 's';

    // Click handler
    bubble.addEventListener('click', () => {
        bubble.classList.add('pop');
        bubbleCount++;
        bubbleCountDisplay.textContent = bubbleCount;

        setTimeout(() => {
            bubble.remove();
            createBubble(); // Create a new bubble
        }, 300);
    });

    bubbleArea.appendChild(bubble);
}

function initBubbles() {
    bubbleArea.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        createBubble();
    }
}

document.getElementById('reset-bubbles').addEventListener('click', () => {
    bubbleCount = 0;
    bubbleCountDisplay.textContent = bubbleCount;
    initBubbles();
});

// Initialize bubbles on load
initBubbles();

// ============================================
// COLOR MATCHING GAME
// ============================================
const colorGrid = document.querySelector('.color-grid');
const colorOptions = document.querySelectorAll('.color-option');
let selectedColor = '#FFB6C1';

// Create color grid
for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.className = 'color-cell';
    cell.addEventListener('click', () => {
        cell.style.backgroundColor = selectedColor;
    });
    colorGrid.appendChild(cell);
}

// Color selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedColor = option.getAttribute('data-color');
    });
});

// Set first color as selected by default
colorOptions[0].classList.add('selected');

// Clear grid
document.getElementById('clear-colors').addEventListener('click', () => {
    document.querySelectorAll('.color-cell').forEach(cell => {
        cell.style.backgroundColor = 'white';
    });
});

// ============================================
// DRAWING PAD
// ============================================
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const brushColor = document.getElementById('brush-color');
const brushSize = document.getElementById('brush-size');
const sizeDisplay = document.getElementById('size-display');
const clearCanvas = document.getElementById('clear-canvas');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set canvas background to white
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = brushColor.value;
    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
}

function stopDrawing() {
    isDrawing = false;
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

// Brush size display
brushSize.addEventListener('input', () => {
    sizeDisplay.textContent = brushSize.value;
});

// Clear canvas
clearCanvas.addEventListener('click', () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
