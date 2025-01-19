// Copter Game Clone with Centered Layout and Full Black Background
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800; // Fixed width
canvas.height = 600; // Fixed height

document.body.style.margin = '0';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.height = '100vh';
document.body.style.backgroundColor = 'black';

// Images
const helicopterImg = new Image();
helicopterImg.src = 'assets/images/helicopter.png';

// Game variables
let copterY = canvas.height / 2;
let copterSpeed = 0;
const gravity = 0.3;
const lift = -6; // Reduced lift for smoother flying
const copterSize = { width: 80, height: 40 };
let distance = 0;
let bestScore = 0;
let gameRunning = false;
let isMousePressed = false;
const obstacles = [];
const obstacleWidth = 40; // Smaller obstacle width
const obstacleGap = 200; // Adjusted gap size
const obstacleSpeed = 3;

function createObstacle() {
    const centerY = Math.random() * (canvas.height - obstacleGap - 100) + 50;
    const topHeight = centerY - obstacleGap / 2;
    const bottomHeight = canvas.height - centerY - obstacleGap / 2;

    obstacles.push({ x: canvas.width, y: 0, height: topHeight });
    obstacles.push({ x: canvas.width, y: canvas.height - bottomHeight, height: bottomHeight });
}

function resetGame() {
    copterY = canvas.height / 2;
    copterSpeed = 0;
    obstacles.length = 0;
    distance = 0;
    gameRunning = false;
    document.getElementById('startButton').style.display = 'block';
    createObstacle();
}

function startGame() {
    gameRunning = true;
    document.getElementById('startButton').style.display = 'none';
    gameLoop();
}

function update() {
    if (!gameRunning) return;

    // Apply gravity or lift based on mouse press
    if (isMousePressed) {
        copterSpeed += lift / 20; // Smooth lift
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

    document.getElementById('distance').innerText = `DISTANCE: ${distance}`;
    document.getElementById('best').innerText = `BEST: ${bestScore}`;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw helicopter
    ctx.drawImage(helicopterImg, 100, copterY, copterSize.width, copterSize.height);

    // Draw obstacles
    obstacles.forEach((obs) => {
        ctx.fillStyle = 'green';
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

// Add start button functionality
document.getElementById('startButton').addEventListener('click', startGame);

// Initialize game
resetGame();
