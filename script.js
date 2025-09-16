const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 5;
const BALL_SPEED = 5;

// Game objects
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: canvas.height / 2 - BALL_SIZE / 2,
  vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  vy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
};

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp to canvas
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

// Update ball and AI paddle
function update() {
  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Collision with top and bottom walls
  if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
    ball.vy = -ball.vy;
  }

  // Collision with player paddle
  if (
    ball.x <= PLAYER_X + PADDLE_WIDTH &&
    ball.y + BALL_SIZE > playerY &&
    ball.y < playerY + PADDLE_HEIGHT
  ) {
    ball.vx = -ball.vx;
    // Add a little randomness
    ball.vy += (Math.random() - 0.5) * 2;
    // Clamp ball.vy
    ball.vy = Math.max(-BALL_SPEED, Math.min(BALL_SPEED, ball.vy));
    ball.x = PLAYER_X + PADDLE_WIDTH; // Prevent sticking
  }

  // Collision with AI paddle
  if (
    ball.x + BALL_SIZE >= AI_X &&
    ball.y + BALL_SIZE > aiY &&
    ball.y < aiY + PADDLE_HEIGHT
  ) {
    ball.vx = -ball.vx;
    ball.vy += (Math.random() - 0.5) * 2;
    ball.vy = Math.max(-BALL_SPEED, Math.min(BALL_SPEED, ball.vy));
    ball.x = AI_X - BALL_SIZE; // Prevent sticking
  }

  // Ball out of bounds (reset)
  if (ball.x < 0 || ball.x > canvas.width) {
    // Reset ball to center
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.vx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  }

  // AI paddle: move toward ball
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ball.y + BALL_SIZE / 2) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ball.y + BALL_SIZE / 2) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Main loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();