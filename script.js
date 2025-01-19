// Fullscreen Copter Game Clone with Mouse Control
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Images
const helicopterImg = new Image();
helicopterImg.src = 'assets/images/helicopter.png';

// Game variables
let copterY = canvas.height / 2;
let copterSpeed = 0;
const gravity = 0.5;
const lift = -10;
const copterSize = { width: 80, height: 40 };
let distance = 0;
let bestScore = 0;
let gameRunning = false;
const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 200;
const obstacleSpeed = 3;

function createObstacle() {
    const height = Math.random() * (canvas.height - obstacleGap);
    obstacles.push({ x: canvas.width, y: 0, height });
    obstacles.push({ x: canvas.width, y: height + obstacleGap, height: canvas.height - height - obstacleGap });
}

function resetGame() {
    copterY = canvas.height / 2;
    copterSpeed = 0;
    obstacles.length = 0;
    distance = 0;
    gameRunning = false;
    createObstacle();
}

function startGame() {
    gameRunning = true;
    gameLoop();
}

function update() {
    if (!gameRunning) return;

    copterSpeed += gravity;
    copterY += copterSpeed;

    // Check boundaries
    if (copterY < 0 || copterY + copterSize.height > canvas.height) {
        resetGame();
    }

    // Update obstacles
    obstacles.forEach((obs) => {
        obs.x -= obstacleSpeed;
    });

    if (obstacles.length > 0 && obstacles[0].x + obstacleWidth < 0) {
        obstacles.splice(0, 2);
    }

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
        createObstacle();
    }

    // Check collisions
    obstacles.forEach((obs) => {
        if (
            copterY < obs.y + obs.height &&
            copterY + copterSize.height > obs.y &&
            100 < obs.x + obstacleWidth &&
            100 + copterSize.width > obs.x
        ) {
            resetGame();
        }
    });

    // Update distance
    distance++;
    if (distance > bestScore) {
        bestScore = distance;
    }

    document.getElementById('distance').innerText = distance;
    document.getElementById('best').innerText = bestScore;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw helicopter
    ctx.drawImage(helicopterImg, 100, copterY, copterSize.width, copterSize.height);

    // Draw obstacles
    ctx.fillStyle = 'green';
    obstacles.forEach((obs) => {
        ctx.fillRect(obs.x, obs.y, obstacleWidth, obs.height);
    });
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

window.addEventListener('mousedown', () => {
    if (!gameRunning) startGame();
    copterSpeed = lift;
});

window.addEventListener('mouseup', () => {
    copterSpeed += gravity; // Resume gravity when mouse is released
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resetGame();
});

// Initialize game
resetGame();
