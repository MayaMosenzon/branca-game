const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const restartBtn = document.getElementById("restartBtn");

let santa = { x: 100, y: 0, w: 50, h: 50, speed: 5 };
let gameOver = false;
let touchLeft = false;
let touchRight = false;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  santa.y = canvas.height - santa.h - 10;
  restartBtn.style.top = canvas.height * 0.6 + 'px';
}
resize();

window.addEventListener("resize", resize);
document.addEventListener("fullscreenchange", resize);

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") santa.x -= santa.speed;
  if (e.key === "ArrowRight") santa.x += santa.speed;
});

document.getElementById("leftTouch").addEventListener("touchstart", () => touchLeft = true);
document.getElementById("leftTouch").addEventListener("touchend", () => touchLeft = false);
document.getElementById("rightTouch").addEventListener("touchstart", () => touchRight = true);
document.getElementById("rightTouch").addEventListener("touchend", () => touchRight = false);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(santa.x, santa.y, santa.w, santa.h);

  if (touchLeft) santa.x -= santa.speed;
  if (touchRight) santa.x += santa.speed;

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
    restartBtn.style.display = "block";
  } else {
    requestAnimationFrame(draw);
  }
}

function startGame() {
  startScreen.style.display = "none";
  canvas.requestFullscreen?.().catch(() => {});
  setTimeout(() => {
    resize();
    canvas.focus();
    draw();
  }, 300);
}

function resetGame() {
  santa.x = 100;
  gameOver = false;
  restartBtn.style.display = "none";
  resize();
  draw();
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);
