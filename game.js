const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

const santaImg = new Image();
santaImg.src = "images/santa.png";

const bottleImg = new Image();
bottleImg.src = "images/bottle.png";

const bombImg = new Image();
bombImg.src = "images/bomb.png";

const backgroundImg = new Image();
backgroundImg.src = "images/background.png";

const santa = {
  x: 180,
  y: canvas.height - 60 - 10,
  width: 60,
  height: 60,
  speed: 5
};

let bottles = [];
let bombs = [];
let score = 0;
let difficultyLevel = 1;
let gameOver = false;
let touchLeft = false;
let touchRight = false;

// מקלדת
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") santa.x -= santa.speed;
  if (e.key === "ArrowRight") santa.x += santa.speed;
});

// מסך מגע
document.getElementById("leftTouch").addEventListener("touchstart", () => touchLeft = true);
document.getElementById("leftTouch").addEventListener("touchend", () => touchLeft = false);
document.getElementById("rightTouch").addEventListener("touchstart", () => touchRight = true);
document.getElementById("rightTouch").addEventListener("touchend", () => touchRight = false);

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function dropBottle() {
  const x = Math.random() * (canvas.width - 30);
  const speed = 2 + difficultyLevel * 0.5;
  bottles.push({ x, y: 0, width: 30, height: 60, speed });
}

function dropBomb() {
  const x = Math.random() * (canvas.width - 30);
  const speed = 2 + difficultyLevel * 0.5;
  bombs.push({ x, y: 0, width: 30, height: 60, speed });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(santaImg, santa.x, santa.y, santa.width, santa.height);

  bottles.forEach((bottle, i) => {
    bottle.y += bottle.speed;
    ctx.drawImage(bottleImg, bottle.x, bottle.y, bottle.width, bottle.height);
    if (isColliding(santa, bottle)) {
      score++;
      bottles.splice(i, 1);
    } else if (bottle.y > canvas.height) {
      bottles.splice(i, 1);
    }
  });

  bombs.forEach((bomb, i) => {
    bomb.y += bomb.speed;
    ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);
    if (isColliding(santa, bomb)) {
      gameOver = true;
    } else if (bomb.y > canvas.height) {
      bombs.splice(i, 1);
    }
  });

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  if (gameOver) {
    ctx.font = "bold 48px 'Comic Sans MS', cursive";
    ctx.textAlign = "center";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
    ctx.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    restartBtn.style.display = "block";
    restartBtn.classList.add("show-pop");
  }

  // תנועה במסך מגע
  if (touchLeft) {
    santa.x -= santa.speed;
    if (santa.x < 0) santa.x = 0;
  }
  if (touchRight) {
    santa.x += santa.speed;
    if (santa.x + santa.width > canvas.width) {
      santa.x = canvas.width - santa.width;
    }
  }
}

function gameLoop() {
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

function resetGame() {
  bottles = [];
  bombs = [];
  score = 0;
  difficultyLevel = 1;
  santa.x = 180;
  santa.y = canvas.height - santa.height - 10;
  santa.speed = 5;
  gameOver = false;
  restartBtn.style.display = "none";
  restartBtn.classList.remove("show-pop");
  gameLoop();
}

function startGame() {
  startScreen.style.display = "none";

  // כניסה למסך מלא אם אפשר
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen().catch(err => console.log("לא נכנס למסך מלא:", err));
  } else if (canvas.webkitRequestFullscreen) { // Safari
    canvas.webkitRequestFullscreen();
  }

  gameLoop();
}


startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);


setInterval(dropBottle, 1500);
setInterval(dropBomb, 5000);
setInterval(() => {
  difficultyLevel += 0.2;
  santa.speed += 0.2;
}, 5000);
