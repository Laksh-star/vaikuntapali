const boardEl = document.getElementById("board");
const overlay = document.getElementById("overlay");
const diceEl = document.getElementById("dice");
const rollBtn = document.getElementById("roll-btn");
const resetBtn = document.getElementById("reset-btn");
const learnBtn = document.getElementById("learn-btn");
const logEl = document.getElementById("log");
const turnInfo = document.getElementById("turn-info");
const pairsEl = document.getElementById("pairs");
const boardStyleSelect = document.getElementById("board-style");
const boardStyleNote = document.getElementById("board-style-note");
const pageEl = document.querySelector(".page");
const boardFrame = document.querySelector(".board-frame");
const tooltipEl = document.getElementById("board-tooltip");
const teachingKicker = document.getElementById("teaching-kicker");
const teachingTitle = document.getElementById("teaching-title");
const teachingText = document.getElementById("teaching-text");
const teachingWhy = document.getElementById("teaching-why");
const teachingCounter = document.getElementById("teaching-counter");
const onboardingModal = document.getElementById("onboarding-modal");
const modalClose = document.getElementById("modal-close");
const modalPrev = document.getElementById("modal-prev");
const modalNext = document.getElementById("modal-next");
const modalBegin = document.getElementById("modal-begin");
const modalPanels = Array.from(document.querySelectorAll(".modal-panel"));

const teachingByName = {
  "Daya (Compassion)": {
    teaching: "Compassion opens the heart; mercy lifts the traveler.",
    why: "You met Daya and rose.",
    counterpart: "Krodha (Anger)"
  },
  "Shraddha (Faith)": {
    teaching: "Faith steadies the mind; trust in the path brings progress.",
    why: "You met Shraddha and rose.",
    counterpart: "Moha (Delusion)"
  },
  "Satya (Truth)": {
    teaching: "Truth clears the way; honesty aligns the soul.",
    why: "You met Satya and rose.",
    counterpart: "Tamas (Inertia)"
  },
  "Ahimsa (Non-violence)": {
    teaching: "Gentleness preserves harmony; restraint guards the soul.",
    why: "You met Ahimsa and rose.",
    counterpart: "Krodha (Anger)"
  },
  "Seva (Service)": {
    teaching: "Service dissolves the self; helping hands climb higher.",
    why: "You met Seva and rose.",
    counterpart: "Ahankara (Ego)"
  },
  "Jnana (Wisdom)": {
    teaching: "Wisdom dispels delusion; insight lights the path.",
    why: "You met Jnana and rose.",
    counterpart: "Moha (Delusion)"
  },
  "Tyaga (Renunciation)": {
    teaching: "Letting go frees the heart; detachment lifts the spirit.",
    why: "You met Tyaga and rose.",
    counterpart: "Lobha (Greed)"
  },
  "Bhakti (Devotion)": {
    teaching: "Devotion focuses the heart; love draws you upward.",
    why: "You met Bhakti and rose.",
    counterpart: "Matsarya (Jealousy)"
  },
  "Nishkama (Selfless Action)": {
    teaching: "Selfless action purifies intent; duty without desire elevates.",
    why: "You met Nishkama and rose.",
    counterpart: "Ahankara (Ego)"
  },
  "Krodha (Anger)": {
    teaching: "Anger burns clarity; heat without control brings a fall.",
    why: "You met Krodha and fell back.",
    counterpart: "Daya (Compassion)"
  },
  "Moha (Delusion)": {
    teaching: "Delusion clouds the path; clarity comes from seeking truth.",
    why: "You met Moha and fell back.",
    counterpart: "Jnana (Wisdom)"
  },
  "Mada (Pride)": {
    teaching: "Pride hardens the heart; humility keeps you steady.",
    why: "You met Mada and fell back.",
    counterpart: "Seva (Service)"
  },
  "Lobha (Greed)": {
    teaching: "Greed clutches and blinds; letting go restores balance.",
    why: "You met Lobha and fell back.",
    counterpart: "Tyaga (Renunciation)"
  },
  "Matsarya (Jealousy)": {
    teaching: "Jealousy narrows joy; gratitude expands it.",
    why: "You met Matsarya and fell back.",
    counterpart: "Bhakti (Devotion)"
  },
  "Ahankara (Ego)": {
    teaching: "Ego separates; service reunites.",
    why: "You met Ahankara and fell back.",
    counterpart: "Seva (Service)"
  },
  "Irsha (Envy)": {
    teaching: "Envy turns the gaze outward; contentment brings peace.",
    why: "You met Irsha and fell back.",
    counterpart: "Nishkama (Selfless Action)"
  },
  "Tamas (Inertia)": {
    teaching: "Inertia dims effort; discipline awakens the will.",
    why: "You met Tamas and fell back.",
    counterpart: "Satya (Truth)"
  }
};

const teachingDefault = {
  kicker: "The Moral Ladder",
  title: "Each move is a lesson",
  text:
    "Vaikuntapali is a journey of virtue and vice. Ladders lift the soul, serpents humble it. Reach 100 to ascend to Vaikuntha.",
  why: "Land on a stair to rise. Land on a serpent head to fall.",
  counterpart: ""
};

const hoverSupported = window.matchMedia("(hover: hover)").matches;
let tooltipCell = null;
let tooltipLocked = false;
let teachingLast = null;

function buildEntries(entries, type) {
  return entries.map((entry) => {
    const extra = teachingByName[entry.name] ?? {};
    const effect = type === "ladder" ? `Climb to ${entry.to}.` : `Fall to ${entry.to}.`;
    return { ...entry, ...extra, effect, type };
  });
}

const laddersDefault = buildEntries(
  [
    { from: 4, to: 14, name: "Daya (Compassion)" },
    { from: 9, to: 31, name: "Shraddha (Faith)" },
    { from: 20, to: 38, name: "Satya (Truth)" },
    { from: 28, to: 55, name: "Ahimsa (Non-violence)" },
    { from: 40, to: 59, name: "Seva (Service)" },
    { from: 51, to: 72, name: "Jnana (Wisdom)" },
    { from: 63, to: 83, name: "Tyaga (Renunciation)" },
    { from: 71, to: 92, name: "Bhakti (Devotion)" },
    { from: 81, to: 98, name: "Nishkama (Selfless Action)" }
  ],
  "ladder"
);

const snakesDefault = buildEntries(
  [
    { from: 17, to: 7, name: "Krodha (Anger)" },
    { from: 35, to: 5, name: "Moha (Delusion)" },
    { from: 47, to: 26, name: "Mada (Pride)" },
    { from: 62, to: 18, name: "Lobha (Greed)" },
    { from: 74, to: 53, name: "Matsarya (Jealousy)" },
    { from: 88, to: 24, name: "Ahankara (Ego)" },
    { from: 95, to: 65, name: "Irsha (Envy)" },
    { from: 99, to: 41, name: "Tamas (Inertia)" }
  ],
  "snake"
);

const laddersArt = buildEntries(
  [
    { from: 13, to: 32, name: "Daya (Compassion)" },
    { from: 23, to: 45, name: "Satya (Truth)" },
    { from: 48, to: 72, name: "Bhakti (Devotion)" },
    { from: 59, to: 84, name: "Jnana (Wisdom)" }
  ],
  "ladder"
);

const snakesArt = buildEntries(
  [
    { from: 76, to: 57, name: "Krodha (Anger)" },
    { from: 74, to: 55, name: "Mada (Pride)" },
    { from: 57, to: 38, name: "Lobha (Greed)" },
    { from: 54, to: 34, name: "Moha (Delusion)" },
    { from: 35, to: 16, name: "Ahankara (Ego)" }
  ],
  "snake"
);

const boardModes = {
  "art-aligned": {
    className: "mode-art-aligned",
    ladders: laddersArt,
    snakes: snakesArt,
    note: "Overlay and gameplay positions are adjusted to follow the ladders and snakes in the artwork."
  },
  "art-only": {
    className: "mode-art-only",
    ladders: laddersDefault,
    snakes: snakesDefault,
    note: "Uses the original artwork as-is and hides the overlay."
  },
  "indian-gameplay": {
    className: "mode-indian",
    ladders: laddersDefault,
    snakes: snakesDefault,
    note: "Uses a new Indian-style board art while keeping the current ladder and snake positions."
  },
  plain: {
    className: "mode-plain",
    ladders: laddersDefault,
    snakes: snakesDefault,
    note: "Uses the original plain board styling without any background artwork."
  }
};

let ladders = laddersDefault;
let snakes = snakesDefault;

const boardMap = new Map();

function setBoardMap() {
  boardMap.clear();
  ladders.forEach((ladder) => {
    boardMap.set(ladder.from, { ...ladder, type: "ladder" });
  });
  snakes.forEach((snake) => {
    boardMap.set(snake.from, { ...snake, type: "snake" });
  });
}

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

let modalStep = 0;

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

function setTeachingDefault() {
  if (!teachingTitle) {
    return;
  }
  teachingKicker.textContent = teachingDefault.kicker;
  teachingTitle.textContent = teachingDefault.title;
  teachingText.textContent = teachingDefault.text;
  teachingWhy.textContent = teachingDefault.why;
  teachingCounter.textContent = "";
}

function renderTeaching(entry) {
  if (!teachingTitle) {
    return;
  }
  if (!entry) {
    setTeachingDefault();
    return;
  }
  teachingKicker.textContent = entry.type === "ladder" ? "Virtue" : "Vice";
  teachingTitle.textContent = entry.name;
  teachingText.textContent = entry.teaching ?? "";
  teachingWhy.textContent = entry.why ?? entry.effect ?? "";
  if (entry.counterpart) {
    teachingCounter.textContent = `Counterpoint: ${entry.counterpart}`;
  } else {
    teachingCounter.textContent = "";
  }
}

function previewTeaching(entry) {
  if (!entry) {
    return;
  }
  renderTeaching(entry);
}

function pinTeaching(entry) {
  teachingLast = entry;
  renderTeaching(entry);
}

function restoreTeaching() {
  if (teachingLast) {
    renderTeaching(teachingLast);
  } else {
    setTeachingDefault();
  }
}

function showTooltip(cell, entry) {
  if (!tooltipEl || !boardFrame) {
    return;
  }
  tooltipEl.innerHTML = `
    <div class="type ${entry.type}">${entry.type === "ladder" ? "Virtue" : "Vice"}</div>
    <div class="name">${entry.name}</div>
    <div class="effect">${entry.effect}</div>
    <div class="teaching">${entry.teaching ?? ""}</div>
  `;
  tooltipEl.style.visibility = "hidden";
  tooltipEl.classList.add("visible");
  tooltipEl.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    const frameRect = boardFrame.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();
    let x = cellRect.left - frameRect.left + (cellRect.width - tipRect.width) / 2;
    let y = cellRect.top - frameRect.top - tipRect.height - 10;
    if (y < 8) {
      y = cellRect.bottom - frameRect.top + 10;
    }
    x = Math.max(8, Math.min(x, frameRect.width - tipRect.width - 8));
    if (y + tipRect.height > frameRect.height - 8) {
      y = frameRect.height - tipRect.height - 8;
    }
    tooltipEl.style.left = `${x}px`;
    tooltipEl.style.top = `${y}px`;
    tooltipEl.style.visibility = "visible";
  });
}

function hideTooltip() {
  if (!tooltipEl) {
    return;
  }
  tooltipEl.classList.remove("visible");
  tooltipEl.setAttribute("aria-hidden", "true");
}

function pulseOverlay(type) {
  overlay.classList.remove("pulse-virtue", "pulse-vice");
  void overlay.offsetWidth;
  overlay.classList.add(type === "ladder" ? "pulse-virtue" : "pulse-vice");
}

function openModal() {
  if (!onboardingModal) {
    return;
  }
  onboardingModal.classList.add("open");
  onboardingModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!onboardingModal) {
    return;
  }
  onboardingModal.classList.remove("open");
  onboardingModal.setAttribute("aria-hidden", "true");
}

function setModalStep(index) {
  if (!modalPanels.length || !modalPrev || !modalNext || !modalBegin) {
    return;
  }
  const clamped = Math.max(0, Math.min(index, modalPanels.length - 1));
  modalPanels.forEach((panel, idx) => {
    panel.classList.toggle("active", idx === clamped);
  });
  modalPrev.disabled = clamped === 0;
  modalNext.style.display = clamped === modalPanels.length - 1 ? "none" : "inline-flex";
  modalBegin.style.display = clamped === modalPanels.length - 1 ? "inline-flex" : "none";
  modalStep = clamped;
}

function applyMode(modeKey) {
  const mode = boardModes[modeKey] ?? boardModes["indian-gameplay"];
  pageEl.classList.remove("mode-art-aligned", "mode-art-only", "mode-indian", "mode-plain");
  pageEl.classList.add(mode.className);
  ladders = mode.ladders;
  snakes = mode.snakes;
  if (boardStyleNote) {
    boardStyleNote.textContent = mode.note;
  }
  tooltipLocked = false;
  tooltipCell = null;
  setBoardMap();
  renderBoard();
  renderOverlay();
  renderPairs();
  hideTooltip();
  teachingLast = null;
  restoreTeaching();
  resetGame();
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
        cell.dataset.type = entry.type;
        cell.dataset.name = entry.name;
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

function getEntryFromCell(cell) {
  const num = Number(cell.dataset.number);
  if (!num) {
    return null;
  }
  return boardMap.get(num) ?? null;
}

function handleCellEnter(event) {
  if (!hoverSupported) {
    return;
  }
  const cell = event.target.closest(".cell");
  if (!cell || !boardEl.contains(cell)) {
    return;
  }
  const entry = getEntryFromCell(cell);
  if (!entry) {
    return;
  }
  tooltipLocked = false;
  tooltipCell = cell;
  showTooltip(cell, entry);
  previewTeaching(entry);
}

function handleCellLeave(event) {
  if (!hoverSupported) {
    return;
  }
  const cell = event.target.closest(".cell");
  if (!cell || !boardEl.contains(cell)) {
    return;
  }
  if (cell.contains(event.relatedTarget)) {
    return;
  }
  if (!tooltipLocked) {
    hideTooltip();
  }
  restoreTeaching();
}

function handleCellClick(event) {
  const cell = event.target.closest(".cell");
  if (!cell || !boardEl.contains(cell)) {
    return;
  }
  const entry = getEntryFromCell(cell);
  if (!entry) {
    return;
  }
  if (tooltipCell === cell && tooltipLocked) {
    tooltipLocked = false;
    hideTooltip();
    restoreTeaching();
    return;
  }
  tooltipLocked = true;
  tooltipCell = cell;
  showTooltip(cell, entry);
  pinTeaching(entry);
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
    player.token.classList.remove("moving");
    state.locked = false;
    switchTurn();
    return;
  }

  let steps = 0;
  player.token.classList.add("moving");
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
    pinTeaching(entry);
    pulseOverlay(entry.type);
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
    player.token.classList.remove("moving");
    return;
  }
  player.token.classList.remove("moving");
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
    player.token.classList.remove("moving");
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
  teachingLast = null;
  restoreTeaching();
}

function init() {
  if (boardStyleSelect) {
    applyMode(boardStyleSelect.value);
  } else {
    setBoardMap();
    renderBoard();
    renderOverlay();
    renderPairs();
    updateAllTokens();
    setTurnText();
    log("The journey begins at square 1.");
    setTeachingDefault();
  }
  if (localStorage.getItem("vaikuntapali_onboarded") !== "1") {
    modalStep = 0;
    setModalStep(0);
    openModal();
  }
}

rollBtn.addEventListener("click", handleRoll);
resetBtn.addEventListener("click", resetGame);
if (learnBtn) {
  learnBtn.addEventListener("click", () => {
    modalStep = 0;
    setModalStep(0);
    openModal();
  });
}
if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}
if (modalPrev) {
  modalPrev.addEventListener("click", () => setModalStep(modalStep - 1));
}
if (modalNext) {
  modalNext.addEventListener("click", () => setModalStep(modalStep + 1));
}
if (modalBegin) {
  modalBegin.addEventListener("click", () => {
    localStorage.setItem("vaikuntapali_onboarded", "1");
    closeModal();
  });
}
if (onboardingModal) {
  onboardingModal.addEventListener("click", (event) => {
    if (event.target === onboardingModal) {
      closeModal();
    }
  });
}
if (boardStyleSelect) {
  boardStyleSelect.addEventListener("change", (event) => {
    applyMode(event.target.value);
  });
}
boardEl.addEventListener("mouseover", handleCellEnter);
boardEl.addEventListener("mouseout", handleCellLeave);
boardEl.addEventListener("click", handleCellClick);
document.addEventListener("click", (event) => {
  if (boardFrame && !boardFrame.contains(event.target)) {
    tooltipLocked = false;
    hideTooltip();
    restoreTeaching();
  }
});
window.addEventListener("resize", () => {
  updateAllTokens();
  if (tooltipCell && tooltipEl && tooltipEl.classList.contains("visible")) {
    const entry = getEntryFromCell(tooltipCell);
    if (entry) {
      showTooltip(tooltipCell, entry);
    }
  }
});

init();
