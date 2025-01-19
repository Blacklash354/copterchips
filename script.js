// Copter Game Clone with Improved Obstacles and Mouse Control
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800; // Fixed width
canvas.height = 600; // Fixed height

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
let isMousePressed = false;
const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 200;
const obstacleSpeed = 3;

function createObstacle() {
    const height = Math.random() * (canvas.height - obstacleGap - 100) + 50;
    obstacles.push({ x: canvas.width, y: 0, height, color: getRandomColor() });
    obstacles.push({ x: canvas.width, y: height + obstacleGap, height: canvas.height - height - obstacleGap, color: getRandomColor() });
}

function getRandomColor() {
    const colors = ['#00FF00', '#00CC00', '#009900', '#66FF66'];
    return colors[Math.floor(Math.random() * colors.length)];
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

    // Apply gravity or lift based on mouse press
    if (isMousePressed) {
        copterSpeed = lift;
    } else {
        copterSpeed += gravity;
    }
    copterY += copterSpeed;

    // Check boundaries
    if (copterY < 50 || copterY + copterSize.height > canvas.height - 50) {
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

    // Draw top and bottom borders
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, 50); // Top border
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50); // Bottom border

    // Draw helicopter
    ctx.drawImage(helicopterImg, 100, copterY, copterSize.width, copterSize.height);

    // Draw obstacles
    obstacles.forEach((obs) => {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obstacleWidth, obs.height);
    });

    // Draw score UI
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`DISTANCE: ${distance}`, 10, 30);
    ctx.fillText(`BEST: ${bestScore}`, 10, canvas.height - 20);
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
    isMousePressed = true;
});

window.addEventListener('mouseup', () => {
    isMousePressed = false;
});

// Initialize game
resetGame();
