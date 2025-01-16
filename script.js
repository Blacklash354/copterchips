// Copter game clone with scrolling background images and obstacles
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

// Game variables
let copterY = canvas.height / 2;
let copterSpeed = 0;
const gravity = 0.5;
const lift = -10;
const copterSize = 20;
let score = 0;
let gameRunning = true;

// Background images
const backgroundImages = [
  'background1.jpg',
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
];
const backgroundImageObjects = [];
backgroundImages.forEach((src) => {
  const img = new Image();
  img.src = src;
  backgroundImageObjects.push(img);
});

let backgroundX = 0;
let currentBackground = 0;

// Obstacles
const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 150;
const obstacleSpeed = 3;

function createObstacle() {
  const obstacleHeight = Math.random() * (canvas.height - obstacleGap);
  obstacles.push({ x: canvas.width, y: 0, height: obstacleHeight });
  obstacles.push({ x: canvas.width, y: obstacleHeight + obstacleGap, height: canvas.height - obstacleHeight - obstacleGap });
}

// Handle input
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    copterSpeed = lift;
  }
});

window.addEventListener('mousedown', () => {
  copterSpeed = lift;
});

function update() {
  if (!gameRunning) return;

  // Update copter
  copterSpeed += gravity;
  copterY += copterSpeed;

  if (copterY < 0) copterY = 0;
  if (copterY + copterSize > canvas.height) {
    gameOver();
  }

  // Update background
  backgroundX -= obstacleSpeed;
  if (backgroundX <= -canvas.width) {
    backgroundX = 0;
    currentBackground = (currentBackground + 1) % backgroundImageObjects.length;
  }

  // Update obstacles
  obstacles.forEach((obstacle) => {
    obstacle.x -= obstacleSpeed;
  });

  if (obstacles.length > 0 && obstacles[0].x + obstacleWidth < 0) {
    obstacles.splice(0, 2);
    score++;
  }

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
    createObstacle();
  }

  // Collision detection
  obstacles.forEach((obstacle) => {
    if (
      copterY < obstacle.y + obstacle.height &&
      copterY + copterSize > obstacle.y &&
      obstacle.x < copterSize &&
      obstacle.x + obstacleWidth > 0
    ) {
      gameOver();
    }
  });
}

function gameOver() {
  gameRunning = false;
  ctx.fillStyle = 'red';
  ctx.font = '30px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
}

function draw() {
  // Draw background
  ctx.drawImage(backgroundImageObjects[currentBackground], backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImageObjects[(currentBackground + 1) % backgroundImageObjects.length], backgroundX + canvas.width, 0, canvas.width, canvas.height);

  // Draw copter
  ctx.fillStyle = 'black';
  ctx.fillRect(50, copterY, copterSize, copterSize);

  // Draw obstacles
  ctx.fillStyle = 'green';
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacle.height);
  });

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Start game
createObstacle();
gameLoop();
