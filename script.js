const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let copterY = canvas.height / 2;
let copterSpeed = 0;
const gravity = 0.5;
const lift = -10;
const copterSize = 20;
let score = 0;
let gameRunning = false;

const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 150;
const obstacleSpeed = 3;

const backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

function createObstacle() {
    const height = Math.random() * (canvas.height - obstacleGap);
    obstacles.push({ x: canvas.width, y: 0, height });
    obstacles.push({ x: canvas.width, y: height + obstacleGap, height: canvas.height - height - obstacleGap });
}

function resetGame() {
    copterY = canvas.height / 2;
    copterSpeed = 0;
    obstacles.length = 0;
    score = 0;
    gameRunning = false;
    document.getElementById('startMessage').style.display = 'block';
}

function startGame() {
    gameRunning = true;
    document.getElementById('startMessage').style.display = 'none';
    createObstacle();
    gameLoop();
}

function update() {
    if (!gameRunning) return;

    copterSpeed += gravity;
    copterY += copterSpeed;

    if (copterY < 0 || copterY + copterSize > canvas.height) {
        resetGame();
    }

    obstacles.forEach((obs) => {
        obs.x -= obstacleSpeed;
    });

    if (obstacles.length > 0 && obstacles[0].x + obstacleWidth < 0) {
        obstacles.splice(0, 2);
        score++;
    }

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        createObstacle();
    }

    obstacles.forEach((obs) => {
        if (
            copterY < obs.y + obs.height &&
            copterY + copterSize > obs.y &&
            50 < obs.x + obstacleWidth &&
            50 + copterSize > obs.x
        ) {
            resetGame();
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(50, copterY, copterSize, copterSize);

    ctx.fillStyle = 'green';
    obstacles.forEach((obs) => {
        ctx.fillRect(obs.x, obs.y, obstacleWidth, obs.height);
    });

    document.getElementById('score').innerText = `Score: ${score}`;
}

function gameLoop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameRunning) {
            startGame();
        }
        copterSpeed = lift;
    }
});

resetGame();
