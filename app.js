const boardEl = document.getElementById("board");
const overlay = document.getElementById("overlay");
const diceEl = document.getElementById("dice");
const rollBtn = document.getElementById("roll-btn");
const resetBtn = document.getElementById("reset-btn");
const logEl = document.getElementById("log");
const turnInfo = document.getElementById("turn-info");
const pairsEl = document.getElementById("pairs");

const ladders = [
  { from: 4, to: 14, name: "Daya (Compassion)" },
  { from: 9, to: 31, name: "Shraddha (Faith)" },
  { from: 20, to: 38, name: "Satya (Truth)" },
  { from: 28, to: 55, name: "Ahimsa (Non-violence)" },
  { from: 40, to: 59, name: "Seva (Service)" },
  { from: 51, to: 72, name: "Jnana (Wisdom)" },
  { from: 63, to: 83, name: "Tyaga (Renunciation)" },
  { from: 71, to: 92, name: "Bhakti (Devotion)" },
  { from: 81, to: 98, name: "Nishkama (Selfless Action)" }
];

const snakes = [
  { from: 17, to: 7, name: "Krodha (Anger)" },
  { from: 35, to: 5, name: "Moha (Delusion)" },
  { from: 47, to: 26, name: "Mada (Pride)" },
  { from: 62, to: 18, name: "Lobha (Greed)" },
  { from: 74, to: 53, name: "Matsarya (Jealousy)" },
  { from: 88, to: 24, name: "Ahankara (Ego)" },
  { from: 95, to: 65, name: "Irsha (Envy)" },
  { from: 99, to: 41, name: "Tamas (Inertia)" }
];

const boardMap = new Map();

ladders.forEach((ladder) => {
  boardMap.set(ladder.from, { ...ladder, type: "ladder" });
});

snakes.forEach((snake) => {
  boardMap.set(snake.from, { ...snake, type: "snake" });
});

const players = [
  {
    name: "Player 1",
    pos: 0,
    token: document.getElementById("token-0"),
    offset: { x: -8, y: -6 }
  },
  {
    name: "Player 2",
    pos: 0,
    token: document.getElementById("token-1"),
    offset: { x: 10, y: 8 }
  }
];

const state = {
  current: 0,
  locked: false,
  gameOver: false
};

function numberToCoord(number) {
  const row = Math.floor((number - 1) / 10);
  let col = (number - 1) % 10;
  if (row % 2 === 1) {
    col = 9 - col;
  }
  const x = col * 100 + 50;
  const y = 1000 - (row * 100 + 50);
  return { x, y };
}

function numberToPercent(number) {
  if (number === 0) {
    return { x: 5, y: 105 };
  }
  const { x, y } = numberToCoord(number);
  return { x: (x / 1000) * 100, y: (y / 1000) * 100 };
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 9; row >= 0; row -= 1) {
    const base = row * 10 + 1;
    const nums = Array.from({ length: 10 }, (_, idx) => base + idx);
    if (row % 2 === 1) {
      nums.reverse();
    }
    nums.forEach((num) => {
      const cell = document.createElement("div");
      let extraClass = "";
      if (num === 100) {
        extraClass = " goal";
      } else if (boardMap.has(num)) {
        const entry = boardMap.get(num);
        extraClass = entry.type === "ladder" ? " virtue" : " vice";
      }
      cell.className = "cell" + extraClass;
      cell.dataset.number = String(num);
      cell.textContent = num;
      const label = document.createElement("div");
      label.className = "label";
      if (num === 100) {
        label.textContent = "Vaikuntha";
      } else if (boardMap.has(num)) {
        const entry = boardMap.get(num);
        label.textContent = entry.name;
      }
      cell.appendChild(label);
      boardEl.appendChild(cell);
    });
  }
}

function renderPairs() {
  pairsEl.innerHTML = "";
  const items = [
    ...ladders.map((ladder) => ({
      label: `${ladder.name} ${ladder.from} -> ${ladder.to}`,
      type: "to"
    })),
    ...snakes.map((snake) => ({
      label: `${snake.name} ${snake.from} -> ${snake.to}`,
      type: "from"
    }))
  ];

  items.sort((a, b) => a.label.localeCompare(b.label));
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "pair";
    const span = document.createElement("span");
    span.className = item.type;
    span.textContent = item.type === "to" ? "Virtue" : "Vice";
    div.appendChild(span);
    div.insertAdjacentText("beforeend", ` — ${item.label}`);
    pairsEl.appendChild(div);
  });
}

function drawLadder(from, to) {
  const start = numberToCoord(from);
  const end = numberToCoord(to);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const nx = dx / length;
  const ny = dy / length;
  const perpX = -ny;
  const perpY = nx;
  const railOffset = 16;

  const rail1Start = {
    x: start.x + perpX * railOffset,
    y: start.y + perpY * railOffset
  };
  const rail1End = {
    x: end.x + perpX * railOffset,
    y: end.y + perpY * railOffset
  };
  const rail2Start = {
    x: start.x - perpX * railOffset,
    y: start.y - perpY * railOffset
  };
  const rail2End = {
    x: end.x - perpX * railOffset,
    y: end.y - perpY * railOffset
  };

  const rail1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  rail1.setAttribute("x1", rail1Start.x);
  rail1.setAttribute("y1", rail1Start.y);
  rail1.setAttribute("x2", rail1End.x);
  rail1.setAttribute("y2", rail1End.y);
  rail1.setAttribute("stroke", "#1f6f5c");
  rail1.setAttribute("stroke-width", "8");
  rail1.setAttribute("stroke-linecap", "round");

  const rail2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  rail2.setAttribute("x1", rail2Start.x);
  rail2.setAttribute("y1", rail2Start.y);
  rail2.setAttribute("x2", rail2End.x);
  rail2.setAttribute("y2", rail2End.y);
  rail2.setAttribute("stroke", "#2c8a73");
  rail2.setAttribute("stroke-width", "8");
  rail2.setAttribute("stroke-linecap", "round");

  overlay.appendChild(rail1);
  overlay.appendChild(rail2);

  const rungs = 6;
  for (let i = 1; i < rungs; i += 1) {
    const t = i / rungs;
    const cx = start.x + dx * t;
    const cy = start.y + dy * t;
    const rung = document.createElementNS("http://www.w3.org/2000/svg", "line");
    rung.setAttribute("x1", cx + perpX * (railOffset - 2));
    rung.setAttribute("y1", cy + perpY * (railOffset - 2));
    rung.setAttribute("x2", cx - perpX * (railOffset - 2));
    rung.setAttribute("y2", cy - perpY * (railOffset - 2));
    rung.setAttribute("stroke", "#b9892c");
    rung.setAttribute("stroke-width", "4");
    rung.setAttribute("stroke-linecap", "round");
    overlay.appendChild(rung);
  }
}

function drawSnake(from, to) {
  const start = numberToCoord(from);
  const end = numberToCoord(to);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  const perp = { x: -dy / 6, y: dx / 6 };
  const control1 = { x: mid.x + perp.x, y: mid.y + perp.y };
  const control2 = { x: mid.x - perp.x, y: mid.y - perp.y };

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const d = `M ${start.x} ${start.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`;
  path.setAttribute("d", d);
  path.setAttribute("stroke", "#b3502f");
  path.setAttribute("stroke-width", "10");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-linecap", "round");

  const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  head.setAttribute("cx", start.x);
  head.setAttribute("cy", start.y);
  head.setAttribute("r", "12");
  head.setAttribute("fill", "#8c2f25");
  head.setAttribute("stroke", "#4b1711");
  head.setAttribute("stroke-width", "3");

  overlay.appendChild(path);
  overlay.appendChild(head);
}

function renderOverlay() {
  overlay.innerHTML = "";
  ladders.forEach((ladder) => drawLadder(ladder.from, ladder.to));
  snakes.forEach((snake) => drawSnake(snake.from, snake.to));
}

function updateTokenPosition(player) {
  const pos = numberToPercent(player.pos);
  player.token.style.left = `${pos.x}%`;
  player.token.style.top = `${pos.y}%`;
  player.token.style.transform = `translate(calc(-50% + ${player.offset.x}px), calc(-50% + ${player.offset.y}px))`;
}

function updateAllTokens() {
  players.forEach((player) => updateTokenPosition(player));
}

function log(message) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = message;
  logEl.prepend(entry);
}

function setTurnText() {
  turnInfo.textContent = `${players[state.current].name}'s turn`;
}

function switchTurn() {
  state.current = (state.current + 1) % players.length;
  setTurnText();
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function applyMove(playerIndex, roll) {
  const player = players[playerIndex];
  const target = player.pos + roll;

  if (target > 100) {
    log(`${player.name} needs an exact roll to reach 100.`);
    state.locked = false;
    switchTurn();
    return;
  }

  let steps = 0;
  const stepInterval = setInterval(() => {
    player.pos += 1;
    updateTokenPosition(player);
    steps += 1;
    if (steps >= roll) {
      clearInterval(stepInterval);
      setTimeout(() => resolveSquare(playerIndex), 250);
    }
  }, 180);
}

function resolveSquare(playerIndex) {
  const player = players[playerIndex];
  const entry = boardMap.get(player.pos);

  if (entry) {
    if (entry.type === "ladder") {
      log(`${player.name} climbs ${entry.name} to ${entry.to}.`);
    } else {
      log(`${player.name} meets ${entry.name} and falls to ${entry.to}.`);
    }
    setTimeout(() => {
      player.pos = entry.to;
      updateTokenPosition(player);
      finishTurn(playerIndex);
    }, 400);
  } else {
    finishTurn(playerIndex);
  }
}

function finishTurn(playerIndex) {
  const player = players[playerIndex];
  if (player.pos === 100) {
    state.gameOver = true;
    log(`${player.name} reaches Vaikuntha and wins.`);
    turnInfo.textContent = `${player.name} wins`;
    rollBtn.disabled = true;
    state.locked = false;
    return;
  }
  state.locked = false;
  switchTurn();
}

function handleRoll() {
  if (state.locked || state.gameOver) {
    return;
  }
  state.locked = true;
  const roll = rollDice();
  diceEl.textContent = roll;
  log(`${players[state.current].name} rolled ${roll}.`);
  applyMove(state.current, roll);
}

function resetGame() {
  players.forEach((player) => {
    player.pos = 0;
  });
  state.current = 0;
  state.locked = false;
  state.gameOver = false;
  diceEl.textContent = "-";
  rollBtn.disabled = false;
  logEl.innerHTML = "";
  setTurnText();
  updateAllTokens();
  log("The journey begins at square 1.");
}

function init() {
  renderBoard();
  renderOverlay();
  renderPairs();
  updateAllTokens();
  setTurnText();
  log("The journey begins at square 1.");
}

rollBtn.addEventListener("click", handleRoll);
resetBtn.addEventListener("click", resetGame);
window.addEventListener("resize", updateAllTokens);

init();
