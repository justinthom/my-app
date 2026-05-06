// ── Navigation ────────────────────────────────────
const navBtns = document.querySelectorAll('.nav-btn');
const panels  = document.querySelectorAll('.game-panel');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const id = btn.dataset.game;
        document.getElementById(id).classList.add('active');
        if (id === 'bubbles') initBubbles();
        if (id === 'draw')    requestAnimationFrame(initCanvas);
    });
});

// ── Breathing ─────────────────────────────────────
let breathCount  = 0;
let isBreathing  = false;
const MAX_CYCLES = 6;

const orb           = document.querySelector('.breathing-orb');
const phaseLabel    = orb.querySelector('.phase-label');
const startBtn      = document.getElementById('start-breathing');
const stopBtn       = document.getElementById('stop-breathing');
const breathCountEl = document.getElementById('breath-count');
const progressFill  = document.getElementById('breath-progress');
const completionMsg = document.getElementById('completion-message');

startBtn.addEventListener('click', startBreathing);
stopBtn.addEventListener('click', stopBreathing);

function startBreathing() {
    if (isBreathing) return;
    breathCount = 0;
    breathCountEl.textContent = 0;
    progressFill.style.width = '0%';
    completionMsg.style.display = 'none';
    isBreathing = true;
    startBtn.style.display = 'none';
    stopBtn.style.display  = 'inline-block';
    runCycle();
}

function runCycle() {
    if (!isBreathing) return;
    if (breathCount >= MAX_CYCLES) { endSession(); return; }

    setPhase('Inhale', 'inhale');
    setTimeout(() => {
        if (!isBreathing) return;
        setPhase('Hold', 'hold');
        setTimeout(() => {
            if (!isBreathing) return;
            setPhase('Exhale', 'exhale');
            setTimeout(() => {
                if (!isBreathing) return;
                breathCount++;
                breathCountEl.textContent = breathCount;
                progressFill.style.width = (breathCount / MAX_CYCLES * 100) + '%';
                runCycle();
            }, 4000);
        }, 2000);
    }, 4000);
}

function setPhase(label, cls) {
    phaseLabel.textContent = label;
    orb.classList.remove('inhale', 'hold', 'exhale');
    if (cls) orb.classList.add(cls);
}

function endSession() {
    isBreathing = false;
    orb.classList.remove('inhale', 'hold', 'exhale');
    phaseLabel.textContent = 'Done';
    stopBtn.style.display  = 'none';
    startBtn.style.display = 'inline-block';
    completionMsg.style.display = 'block';
    setTimeout(() => { phaseLabel.textContent = 'Ready'; }, 2500);
}

function stopBreathing() {
    isBreathing = false;
    orb.classList.remove('inhale', 'hold', 'exhale');
    phaseLabel.textContent = 'Ready';
    stopBtn.style.display  = 'none';
    startBtn.style.display = 'inline-block';
}

// ── Bubble Pop ────────────────────────────────────
let poppedCount   = 0;
let bubbleTimerId = null;
const bubbleArea    = document.getElementById('bubble-area');
const bubbleCountEl = document.getElementById('bubble-count');

const BUBBLE_COLORS = [
    ['rgba(124,106,245,0.65)', 'rgba(124,106,245,0.2)'],
    ['rgba(79,195,247,0.65)',  'rgba(79,195,247,0.2)'],
    ['rgba(110,231,183,0.65)', 'rgba(110,231,183,0.2)'],
    ['rgba(251,191,36,0.55)',  'rgba(251,191,36,0.15)'],
    ['rgba(249,115,22,0.55)',  'rgba(249,115,22,0.15)'],
    ['rgba(236,72,153,0.55)',  'rgba(236,72,153,0.15)'],
];

document.getElementById('reset-bubbles').addEventListener('click', () => {
    poppedCount = 0;
    bubbleCountEl.textContent = 0;
    initBubbles();
});

function initBubbles() {
    bubbleArea.innerHTML = '';
    clearInterval(bubbleTimerId);
    for (let i = 0; i < 10; i++) {
        setTimeout(() => spawnBubble(), i * 350);
    }
    bubbleTimerId = setInterval(spawnBubble, 1400);
}

function spawnBubble() {
    if (!document.getElementById('bubbles').classList.contains('active')) return;
    const size        = 28 + Math.random() * 58;
    const [hi, lo]    = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    const duration    = 6 + Math.random() * 9;
    const maxLeft     = Math.max(0, bubbleArea.clientWidth - size);
    const left        = Math.random() * maxLeft;

    const b = document.createElement('div');
    b.className = 'bubble';
    b.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}px;
        background: radial-gradient(circle at 32% 30%, rgba(255,255,255,0.55), ${hi}, ${lo});
        border: 1px solid rgba(255,255,255,0.22);
        animation-duration: ${duration}s;
    `;

    b.addEventListener('click', () => {
        b.classList.add('pop');
        poppedCount++;
        bubbleCountEl.textContent = poppedCount;
        setTimeout(() => b.remove(), 340);
    });

    b.addEventListener('animationend', () => b.remove());
    bubbleArea.appendChild(b);
}

// ── Color Grid ────────────────────────────────────
const PALETTE = [
    '#7c6af5', '#4fc3f7', '#6ee7b7', '#fbbf24',
    '#f87171', '#fb923c', '#e879f9', '#a3e635',
    '#38bdf8', '#34d399', '#f472b6', '#e2e8f0',
];

let selectedColor = PALETTE[0];
let isPainting    = false;
const paletteEl   = document.getElementById('color-palette');
const colorGridEl = document.getElementById('color-grid');

PALETTE.forEach((color, i) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (i === 0 ? ' selected' : '');
    sw.style.background = color;
    sw.title = color;
    sw.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected');
        selectedColor = color;
    });
    paletteEl.appendChild(sw);
});

for (let i = 0; i < 160; i++) {
    const cell = document.createElement('div');
    cell.className = 'color-cell';
    cell.addEventListener('mousedown', () => {
        isPainting = true;
        cell.style.background = selectedColor;
    });
    cell.addEventListener('mouseenter', () => {
        if (isPainting) cell.style.background = selectedColor;
    });
    colorGridEl.appendChild(cell);
}

document.addEventListener('mouseup', () => isPainting = false);

document.getElementById('clear-colors').addEventListener('click', () => {
    document.querySelectorAll('.color-cell').forEach(c => c.style.background = '');
});

// ── Drawing Pad ───────────────────────────────────
const canvas         = document.getElementById('drawing-canvas');
const ctx            = canvas.getContext('2d');
const brushColorEl   = document.getElementById('brush-color');
const brushSizeEl    = document.getElementById('brush-size');
const sizeDisplayEl  = document.getElementById('size-display');
const eraserBtn      = document.getElementById('eraser-btn');
const clearCanvasBtn = document.getElementById('clear-canvas');
const saveCanvasBtn  = document.getElementById('save-canvas');

let isDrawing   = false;
let isEraser    = false;
let canvasReady = false;
let lastX = 0, lastY = 0;
const CANVAS_BG = '#080c18';

function initCanvas() {
    if (canvasReady) return;
    canvas.width  = canvas.offsetWidth  || 800;
    canvas.height = canvas.offsetHeight || 460;
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvasReady = true;
}

brushSizeEl.addEventListener('input', () => {
    sizeDisplayEl.textContent = brushSizeEl.value;
});

eraserBtn.addEventListener('click', () => {
    isEraser = !isEraser;
    eraserBtn.classList.toggle('active', isEraser);
    canvas.style.cursor = isEraser ? 'cell' : 'crosshair';
});

clearCanvasBtn.addEventListener('click', () => {
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

saveCanvasBtn.addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = 'calm-drawing.png';
    a.href = canvas.toDataURL();
    a.click();
});

function getXY(e) {
    const r  = canvas.getBoundingClientRect();
    const sx = canvas.width  / r.width;
    const sy = canvas.height / r.height;
    const src = e.touches ? e.touches[0] : e;
    return [(src.clientX - r.left) * sx, (src.clientY - r.top) * sy];
}

function drawStroke(x, y) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? CANVAS_BG : brushColorEl.value;
    ctx.lineWidth   = isEraser ? Number(brushSizeEl.value) * 3 : brushSizeEl.value;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    [lastX, lastY] = getXY(e);
});
canvas.addEventListener('mousemove',  e => { if (isDrawing) drawStroke(...getXY(e)); });
canvas.addEventListener('mouseup',    () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    isDrawing = true;
    [lastX, lastY] = getXY(e);
}, { passive: false });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (isDrawing) drawStroke(...getXY(e));
}, { passive: false });

canvas.addEventListener('touchend', e => {
    e.preventDefault();
    isDrawing = false;
}, { passive: false });

// ── Boot ──────────────────────────────────────────
initBubbles();
