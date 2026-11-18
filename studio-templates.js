// Starter games for the Game Studio. Each is a complete little HTML page.
// Comments that start with "TRY" are ideas for kids to change.
export const TEMPLATES = [
{ id: "catch", emoji: "⭐", name: "Catch the stars", he: "לתפוס כוכבים", desc: "Move the basket and catch falling stars.", code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #12152b; display: grid; place-items: center; height: 100vh; font-family: sans-serif; }
  canvas { background: linear-gradient(#2a1b6b, #0b0d1a); border-radius: 12px; max-width: 100%; }
</style>
</head>
<body>
<canvas id="game" width="400" height="500"></canvas>
<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// TRY: make the basket wider or faster
let basket = { x: 170, y: 460, width: 70, speed: 7 };
let star = { x: 200, y: 0, speed: 3 };
let score = 0;
let missed = 0;
let keys = {};

addEventListener("keydown", e => keys[e.key] = true);
addEventListener("keyup", e => keys[e.key] = false);
// move with the mouse or a finger too
canvas.addEventListener("pointermove", e => {
  const r = canvas.getBoundingClientRect();
  basket.x = (e.clientX - r.left) * canvas.width / r.width - basket.width / 2;
});

function newStar() {
  star.x = Math.random() * 370 + 15;
  star.y = 0;
  star.speed += 0.2; // TRY: make the stars speed up faster
}

function update() {
  if (keys["ArrowLeft"]) basket.x -= basket.speed;
  if (keys["ArrowRight"]) basket.x += basket.speed;
  star.y += star.speed;

  // did the basket catch the star?
  if (star.y > basket.y && star.x > basket.x && star.x < basket.x + basket.width) {
    score++;
    newStar();
  }
  // did the star hit the floor?
  if (star.y > canvas.height) {
    missed++;
    newStar();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px sans-serif";
  ctx.fillText("⭐", star.x - 15, star.y);           // TRY: change the star to 🍎 or 💎
  ctx.fillStyle = "#2ee6c9";                          // TRY: change the basket colour
  ctx.fillRect(basket.x, basket.y, basket.width, 16);
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score + "   Missed: " + missed, 12, 30);
}

function loop() {
  if (missed < 5) update();                          // TRY: allow more misses
  draw();
  if (missed >= 5) {
    ctx.font = "36px sans-serif";
    ctx.fillText("Game over!", 110, 250);
  }
  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>` },

{ id: "clicker", emoji: "🍪", name: "Cookie clicker", he: "קליקר עוגיות", desc: "Click the cookie and buy upgrades.", code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #1b1440; color: white; font-family: sans-serif; text-align: center; padding: 20px; }
  #cookie { font-size: 120px; cursor: pointer; user-select: none; transition: transform 0.1s; display: inline-block; }
  #cookie:active { transform: scale(0.9); }
  button { font-size: 18px; padding: 10px 16px; margin: 6px; border-radius: 10px; border: 0; background: #7c5cff; color: white; cursor: pointer; }
  button:disabled { opacity: 0.4; }
  h1 { margin: 6px 0; }
</style>
</head>
<body>
<h1 id="count">0 cookies</h1>
<p id="rate">0 per second</p>
<div id="cookie">🍪</div>   <!-- TRY: change it to 🍩 or 🍕 -->
<div>
  <button id="buyClick">Bigger clicks (cost: 10)</button>
  <button id="buyHelper">Helper (cost: 50)</button>
</div>
<script>
let cookies = 0;
let perClick = 1;
let perSecond = 0;
let clickCost = 10;
let helperCost = 50;

function show() {
  document.getElementById("count").textContent = Math.floor(cookies) + " cookies";
  document.getElementById("rate").textContent = perSecond + " per second";
  document.getElementById("buyClick").textContent = "Bigger clicks (cost: " + clickCost + ")";
  document.getElementById("buyHelper").textContent = "Helper (cost: " + helperCost + ")";
  document.getElementById("buyClick").disabled = cookies < clickCost;
  document.getElementById("buyHelper").disabled = cookies < helperCost;
}

document.getElementById("cookie").onclick = () => {
  cookies += perClick;
  show();
};
document.getElementById("buyClick").onclick = () => {
  cookies -= clickCost;
  perClick += 1;
  clickCost = Math.round(clickCost * 1.5); // TRY: make upgrades cheaper
  show();
};
document.getElementById("buyHelper").onclick = () => {
  cookies -= helperCost;
  perSecond += 1;
  helperCost = Math.round(helperCost * 1.4);
  show();
};
// TRY: add a third upgrade button, like a "Bakery" that gives 10 per second

setInterval(() => { cookies += perSecond / 10; show(); }, 100);
show();
</script>
</body>
</html>` },

{ id: "dodge", emoji: "🚀", name: "Space dodge", he: "התחמקות בחלל", desc: "Fly a rocket and dodge the meteors.", code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #0b0d1a; display: grid; place-items: center; height: 100vh; }
  canvas { background: #0b0d1a; border: 2px solid #2a3060; border-radius: 12px; max-width: 100%; }
</style>
</head>
<body>
<canvas id="game" width="480" height="480"></canvas>
<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let ship = { x: 240, y: 400 };
let rocks = [];
let time = 0;
let alive = true;
let mouseX = 240;

canvas.addEventListener("pointermove", e => {
  const r = canvas.getBoundingClientRect();
  mouseX = (e.clientX - r.left) * canvas.width / r.width;
});
canvas.addEventListener("pointerdown", () => { if (!alive) restart(); });

function restart() { rocks = []; time = 0; alive = true; }

function update() {
  time++;
  ship.x += (mouseX - ship.x) * 0.2;        // the ship follows the mouse smoothly
  // TRY: make meteors appear more often (smaller number = more meteors)
  if (time % 20 === 0) {
    rocks.push({ x: Math.random() * 480, y: -20, size: 10 + Math.random() * 20, speed: 2 + time / 600 });
  }
  for (const r of rocks) {
    r.y += r.speed;
    const dx = r.x - ship.x, dy = r.y - ship.y;
    if (Math.sqrt(dx * dx + dy * dy) < r.size + 12) alive = false;   // hit!
  }
  rocks = rocks.filter(r => r.y < 520);
}

function draw() {
  ctx.fillStyle = "#0b0d1a";
  ctx.fillRect(0, 0, 480, 480);
  // stars in the background
  ctx.fillStyle = "#ffffff55";
  for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % 480, (i * 53 + time) % 480, 2, 2);
  ctx.fillStyle = "#a07850";                // TRY: change the meteor colour
  for (const r of rocks) { ctx.beginPath(); ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2); ctx.fill(); }
  ctx.font = "34px sans-serif";
  ctx.fillText("🚀", ship.x - 17, ship.y + 12);   // TRY: use 🛸 or 🐉
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("Time: " + Math.floor(time / 60) + "s", 12, 28);
  if (!alive) { ctx.font = "32px sans-serif"; ctx.fillText("Boom! Click to try again", 60, 240); }
}

function loop() { if (alive) update(); draw(); requestAnimationFrame(loop); }
loop();
</script>
</body>
</html>` },

{ id: "jump", emoji: "🐸", name: "Jumping frog", he: "צפרדע קופצת", desc: "Jump over logs. Press Space or tap.", code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #87d8ff; display: grid; place-items: center; height: 100vh; font-family: sans-serif; }
  canvas { background: linear-gradient(#87d8ff, #c9f0ff); border-radius: 12px; max-width: 100%; }
</style>
</head>
<body>
<canvas id="game" width="600" height="300"></canvas>
<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const groundY = 250;
let frog = { x: 80, y: groundY, vy: 0 };
let logs = [];
let score = 0;
let over = false;
const gravity = 0.8;     // TRY: change gravity (like being on the moon: 0.3)
const jumpPower = -14;   // TRY: jump higher with -18

function jump() {
  if (over) { logs = []; score = 0; over = false; return; }
  if (frog.y >= groundY) frog.vy = jumpPower;
}
addEventListener("keydown", e => { if (e.code === "Space") jump(); });
canvas.addEventListener("pointerdown", jump);

let timer = 0;
function update() {
  frog.vy += gravity;
  frog.y = Math.min(groundY, frog.y + frog.vy);
  timer++;
  if (timer % 90 === 0) logs.push({ x: 620 });   // a new log every 90 frames
  for (const log of logs) {
    log.x -= 5 + score / 5;                      // logs get faster as you score
    if (log.x < frog.x + 25 && log.x + 30 > frog.x && frog.y > groundY - 25) over = true;
  }
  if (logs.length && logs[0].x < -40) { logs.shift(); score++; }
}

function draw() {
  ctx.clearRect(0, 0, 600, 300);
  ctx.fillStyle = "#3fae4a"; ctx.fillRect(0, groundY + 20, 600, 40);   // grass
  ctx.fillStyle = "#8b5a2b";
  for (const log of logs) ctx.fillRect(log.x, groundY - 5, 30, 25);
  ctx.font = "36px sans-serif";
  ctx.fillText("🐸", frog.x, frog.y + 18);        // TRY: be a 🐰 or 🦘 instead
  ctx.fillStyle = "#12152b";
  ctx.font = "22px sans-serif";
  ctx.fillText("Score: " + score, 14, 32);
  if (over) ctx.fillText("Splash! Press Space or tap to play again", 110, 140);
}

function loop() { if (!over) update(); draw(); requestAnimationFrame(loop); }
loop();
</script>
</body>
</html>` },

{ id: "quiz", emoji: "❓", name: "Quiz maker", he: "יוצר חידונים", desc: "Write your own quiz questions.", code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #1b1440; color: white; font-family: sans-serif; display: grid; place-items: center; min-height: 100vh; text-align: center; }
  .box { max-width: 460px; padding: 20px; }
  button { display: block; width: 100%; font-size: 18px; padding: 12px; margin: 8px 0; border-radius: 10px; border: 2px solid #7c5cff; background: #2a1b6b; color: white; cursor: pointer; }
  button:hover { background: #7c5cff; }
</style>
</head>
<body>
<div class="box">
  <h2 id="question"></h2>
  <div id="answers"></div>
  <p id="info"></p>
</div>
<script>
// TRY: write your own questions! The number after "answer" is which choice is right (0 = first).
const questions = [
  { q: "What colour do you get from blue and yellow?", choices: ["Green", "Purple", "Orange"], answer: 0 },
  { q: "How many legs does a spider have?", choices: ["6", "8", "10"], answer: 1 },
  { q: "Which planet is closest to the Sun?", choices: ["Mars", "Earth", "Mercury"], answer: 2 },
];
let current = 0;
let score = 0;

function show() {
  if (current >= questions.length) {
    document.getElementById("question").textContent = "You got " + score + " out of " + questions.length + "! 🎉";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("info").textContent = "";
    return;
  }
  const item = questions[current];
  document.getElementById("question").textContent = item.q;
  const box = document.getElementById("answers");
  box.innerHTML = "";
  item.choices.forEach((choice, i) => {
    const b = document.createElement("button");
    b.textContent = choice;
    b.onclick = () => {
      if (i === item.answer) { score++; document.getElementById("info").textContent = "✅ Right!"; }
      else document.getElementById("info").textContent = "❌ It was " + item.choices[item.answer];
      current++;
      setTimeout(show, 900);
    };
    box.appendChild(b);
  });
}
show();
</script>
</body>
</html>` },

{ id: "blank", emoji: "📄", name: "Blank page", he: "דף ריק", desc: "Start from nothing.", code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #12152b; color: white; font-family: sans-serif; text-align: center; padding: 40px; }
</style>
</head>
<body>
<h1>My game</h1>
<p>Write HTML here, add CSS in the style tag, and JavaScript in the script tag.</p>
<script>
// your code here
</script>
</body>
</html>` }
];
