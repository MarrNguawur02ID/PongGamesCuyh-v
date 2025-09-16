const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 16;
const paddleHeight = 100;
const ballSize = 16;
const playerX = 32;
const aiX = canvas.width - paddleWidth - 32;

// Paddle and ball state
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let aiSpeed = 4;

let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 6;
let ballSpeedY = 4;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;

    // Clamp to canvas bounds
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(canvas.height - ballSize, ballY));
    }

    // Left paddle collision
    if (
        ballX <= playerX + paddleWidth &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + paddleHeight
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        ballX = playerX + paddleWidth;
    }

    // Right paddle collision
    if (
        ballX + ballSize >= aiX &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + paddleHeight
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        ballX = aiX - ballSize;
    }

    // Score/reset if ball goes past paddle
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // Simple AI: follow the ball
    if (aiY + paddleHeight / 2 < ballY + ballSize / 2) {
        aiY += aiSpeed;
    } else if (aiY + paddleHeight / 2 > ballY + ballSize / 2) {
        aiY -= aiSpeed;
    }
    // Clamp AI paddle to canvas
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight); // Player
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);         // AI

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw net
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i);
        ctx.lineTo(canvas.width / 2, i + 20);
        ctx.stroke();
    }
}

// Reset ball to center with random direction
function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 6;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

gameLoop();
