// --- CONFIGURACIÓN GLOBAL Y NIVELES ---
let gameSettings = {
  gender: 'boy',
  difficulty: 'primaria',
  coins: 50,
  lives: 3,
  keys: 0,
  requiredKeys: 1,
  hat: 'none',
  skinColor: '#f1c27d',
  clothColor: '#3498db',
  currentLevel: 1
};

let gameState = 'MENU';

// BANCO AMPLIADO DE PUZZLES PARA LOS 3 NIVELES
const puzzleBank = {
  primaria: {
    1: [
      { q: "Nivel 1: ¿Cuánto es (15 + 5) ÷ 4?", options: ["4", "5", "6", "10"], correct: 1, reward: "key" }
    ],
    2: [
      { q: "Nivel 2 (Cofre A): ¿Cuál es el perímetro de un cuadrado de lado 6 cm?", options: ["12 cm", "24 cm", "36 cm", "18 cm"], correct: 1, reward: "key" },
      { q: "Nivel 2 (Cofre B): ¿Qué número sigue en la serie? 2, 4, 8, 16, ...", options: ["20", "24", "32", "64"], correct: 2, reward: "coins" }
    ],
    3: [
      { q: "Nivel 3 (Fragmento 1): Si tengo 3 docenas de llaves, ¿cuántas llaves son?", options: ["24", "30", "36", "48"], correct: 2, reward: "key" },
      { q: "Nivel 3 (Fragmento 2): Resuelve: (50 - 10) × 2", options: ["80", "100", "60", "40"], correct: 0, reward: "key" },
      { q: "Nivel 3 (Cofre Bonos): ¿Cuál es el triple de 15?", options: ["30", "45", "60", "35"], correct: 1, reward: "coins" }
    ]
  },
  secundaria: {
    1: [
      { q: "Nivel 1: Si 3x - 5 = 16, ¿cuál es el valor de x?", options: ["x = 5", "x = 7", "x = 8", "x = 6"], correct: 1, reward: "key" }
    ],
    2: [
      { q: "Nivel 2 (Cofre A): ¿Cuál es el valor de x en x² - 9 = 0 (x > 0)?", options: ["x = 1", "x = 3", "x = 9", "x = 81"], correct: 1, reward: "key" },
      { q: "Nivel 2 (Cofre B): ¿Cuál es el 25% de 200?", options: ["25", "40", "50", "75"], correct: 2, reward: "coins" }
    ],
    3: [
      { q: "Nivel 3 (Fragmento 1): Simplifica: 2(x + 4) - 3x = 5. ¿x es?", options: ["x = 3", "x = 1", "x = -3", "x = 5"], correct: 0, reward: "key" },
      { q: "Nivel 3 (Fragmento 2): Área de un triángulo con base 10m y altura 6m:", options: ["60 m²", "30 m²", "15 m²", "20 m²"], correct: 1, reward: "key" },
      { q: "Nivel 3 (Cofre Bonos): ¿Cuál es la raíz cuadrada de 144?", options: ["10", "11", "12", "14"], correct: 2, reward: "coins" }
    ]
  }
};

// SPRITES REUTILIZABLES
const assets = {
  floor: new Image(), wall: new Image(), carpet: new Image(),
  boy: new Image(), girl: new Image(), shadow: new Image(),
  cabinet: new Image(), chest: new Image(), door: new Image(), coin: new Image()
};

assets.floor.src = 'assets/tile_floor.png';
assets.wall.src = 'assets/tile_wall.png';
assets.carpet.src = 'assets/carpet.png';
assets.boy.src = 'assets/player_boy.png';
assets.girl.src = 'assets/player_girl.png';
assets.shadow.src = 'assets/shadow.png';
assets.cabinet.src = 'assets/cabinet.png';
assets.chest.src = 'assets/chest.png';
assets.door.src = 'assets/door.png';
assets.coin.src = 'assets/coin.png';

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');

  if (screenId === 'shop-screen') {
    document.getElementById('shop-coins').innerText = gameSettings.coins;
  } else if (screenId === 'customize-screen') {
    updatePreview();
  }
}

function selectGender(gender) {
  gameSettings.gender = gender;
  document.getElementById('btn-boy').classList.toggle('active', gender === 'boy');
  document.getElementById('btn-girl').classList.toggle('active', gender === 'girl');
}

function selectDifficulty(diff) {
  gameSettings.difficulty = diff;
  document.getElementById('btn-pri').classList.toggle('active', diff === 'primaria');
  document.getElementById('btn-sec').classList.toggle('active', diff === 'secundaria');
}

function setSkinColor(color) {
  gameSettings.skinColor = color;
  updatePreview();
}

function setClothColor(color) {
  gameSettings.clothColor = color;
  updatePreview();
}

function setHat(hat) {
  gameSettings.hat = hat;
  updatePreview();
}

function buyHat(hatType, price) {
  if (gameSettings.coins >= price) {
    gameSettings.coins -= price;
    gameSettings.hat = hatType;
    document.getElementById('shop-coins').innerText = gameSettings.coins;
    alert("¡Objeto equipado con éxito!");
  } else {
    alert("Monedas insuficientes.");
  }
}

function updatePreview() {
  let pCanvas = document.getElementById('previewCanvas');
  if (!pCanvas) return;
  let pCtx = pCanvas.getContext('2d');
  pCtx.clearRect(0, 0, 120, 120);
  pCtx.fillStyle = '#111';
  pCtx.fillRect(0, 0, 120, 120);
  drawCustomCharacter(pCtx, 60, 60, 48);
}

// RENDERING DEL PERSONAJE PERSONALIZADO
function drawCustomCharacter(context, x, y, size) {
  context.fillStyle = gameSettings.clothColor;
  context.fillRect(x - size / 2, y - size / 4, size, size * 0.75);

  context.fillStyle = gameSettings.skinColor;
  context.fillRect(x - size / 3, y - size / 2, size * 0.66, size * 0.4);

  context.fillStyle = '#000';
  context.fillRect(x - size / 6, y - size / 2.5, 4, 4);
  context.fillRect(x + size / 12, y - size / 2.5, 4, 4);

  if (gameSettings.hat === 'cap' || gameSettings.hat === 'detective') {
    context.fillStyle = '#2c3e50';
    context.fillRect(x - size / 2, y - size / 1.8, size, 6);
  } else if (gameSettings.hat === 'crown') {
    context.fillStyle = '#f1c40f';
    context.fillRect(x - size / 3, y - size / 1.6, size * 0.66, 8);
  } else if (gameSettings.hat === 'helmet') {
    context.fillStyle = '#00cec9';
    context.fillRect(x - size / 2.5, y - size / 1.8, size * 0.8, 10);
  }
}

// VARIABLES DINÁMICAS DEL JUEGO Y MONSTRUOS
let canvas, ctx;
let keysPressed = {};
let isHiddenInCabinet = false;
let currentInteractiveObject = null;

let player = { x: 100, y: 310, size: 32, speed: 3.5 };

// Soporte para múltiples monstruos en niveles avanzados
let monsters = [];

let coins = [];
let cabinets = [];
let chests = [];
let door = { x: 750, y: 200, width: 30, height: 80 };

// OBJETOS CINEMÁTICA SECUESTRO
let van = { x: -200, y: 270, width: 140, height: 70, speed: 3.5 };
let kidnapper1 = { x: -50, y: 300 };
let kidnapper2 = { x: -50, y: 300 };

let cutscenePhase = 1; 
let cutsceneTimer = 0;
let fadeAlpha = 0;
let blurAmount = 10;
let tutorialStep = 0;

let rainDrops = [];
for (let i = 0; i < 40; i++) {
  rainDrops.push({ x: Math.random() * 800, y: Math.random() * 450, length: Math.random() * 12 + 8, speed: Math.random() * 4 + 6 });
}

function startCutscene() {
  showScreen('game-screen');
  gameState = 'CUTSCENE_CITY';
  cutscenePhase = 1;
  cutsceneTimer = 0;
  fadeAlpha = 0;

  player.x = 80;
  player.y = 310;
  van.x = -200;

  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  document.getElementById('hud').classList.add('hidden');
  document.getElementById('tutorial-banner').classList.add('hidden');
  document.getElementById('cutscene-dialog').classList.add('hidden');
  document.getElementById('btn-skip-cutscene').classList.remove('hidden');
  document.getElementById('cutscene-banner').classList.remove('hidden');
  
  updateBannerText("🎵 Un paseo tranquilo por la ciudad a altas horas de la noche...");
  requestAnimationFrame(gameLoop);
}

function skipCutscene() {
  startMansionCutscene();
}

function startMansionCutscene() {
  gameState = 'CUTSCENE_MANSION';
  fadeAlpha = 1;
  blurAmount = 12;

  player.x = 100;
  player.y = 240;

  document.getElementById('cutscene-banner').classList.add('hidden');
  document.getElementById('btn-skip-cutscene').classList.add('hidden');
  document.getElementById('cutscene-dialog').classList.remove('hidden');
  updateDialogText("😵‍💫 Ugh... mi cabeza... Fui secuestrado... ¿Dónde me tienen encerrado?");
}

function startTutorial() {
  gameState = 'TUTORIAL';
  tutorialStep = 1;
  loadLevelData(1); // Carga mapa del Nivel 1

  document.getElementById('cutscene-dialog').classList.add('hidden');
  document.getElementById('tutorial-banner').classList.remove('hidden');
  updateTutorialText("Usa W, A, S, D o las Flechas para caminar hacia el círculo brillante.");

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

// SISTEMA DE CARGA DE NIVELES PROGRESIVOS
function loadLevelData(levelNum) {
  gameSettings.currentLevel = levelNum;
  gameSettings.keys = 0;
  isHiddenInCabinet = false;
  player.x = 100;
  player.y = 240;

  if (levelNum === 1) {
    gameSettings.requiredKeys = 1;
    monsters = [
      { x: 450, y: 100, size: 32, speed: 2.0, visionRadius: 150, isChasing: false, patrolTargetY: 380, patrolMinY: 80, patrolMaxY: 380 }
    ];
    cabinets = [{ x: 140, y: 80, width: 50, height: 60 }];
    chests = [{ id: 0, x: 670, y: 380, width: 45, height: 40, opened: false }];
    coins = [
      { x: 220, y: 140, collected: false },
      { x: 380, y: 360, collected: false },
      { x: 580, y: 220, collected: false }
    ];
  } 
  else if (levelNum === 2) {
    gameSettings.requiredKeys = 1;
    monsters = [
      { x: 500, y: 120, size: 32, speed: 2.5, visionRadius: 165, isChasing: false, patrolTargetY: 360, patrolMinY: 90, patrolMaxY: 360 }
    ];
    cabinets = [
      { x: 150, y: 80, width: 50, height: 60 },
      { x: 450, y: 370, width: 50, height: 60 }
    ];
    chests = [
      { id: 0, x: 350, y: 100, width: 45, height: 40, opened: false },
      { id: 1, x: 680, y: 360, width: 45, height: 40, opened: false }
    ];
    coins = [
      { x: 200, y: 200, collected: false },
      { x: 550, y: 140, collected: false },
      { x: 620, y: 280, collected: false },
      { x: 300, y: 380, collected: false }
    ];
  } 
  else if (levelNum === 3) {
    gameSettings.requiredKeys = 2; // Requiere 2 partes de la llave para escapar
    monsters = [
      { x: 350, y: 100, size: 32, speed: 2.3, visionRadius: 150, isChasing: false, patrolTargetY: 380, patrolMinY: 80, patrolMaxY: 380 },
      { x: 600, y: 350, size: 32, speed: 2.6, visionRadius: 160, isChasing: false, patrolTargetY: 80, patrolMinY: 80, patrolMaxY: 350 }
    ];
    cabinets = [
      { x: 120, y: 80, width: 50, height: 60 },
      { x: 380, y: 220, width: 50, height: 60 },
      { x: 650, y: 80, width: 50, height: 60 }
    ];
    chests = [
      { id: 0, x: 250, y: 380, width: 45, height: 40, opened: false },
      { id: 1, x: 520, y: 100, width: 45, height: 40, opened: false },
      { id: 2, x: 700, y: 370, width: 45, height: 40, opened: false }
    ];
    coins = [
      { x: 180, y: 150, collected: false },
      { x: 450, y: 120, collected: false },
      { x: 580, y: 380, collected: false },
      { x: 300, y: 260, collected: false }
    ];
  }

  updateHUD();
}

function updateHUD() {
  document.getElementById('coins-count').innerText = gameSettings.coins;
  document.getElementById('lives-count').innerText = gameSettings.lives;
  document.getElementById('keys-count').innerText = `${gameSettings.keys}/${gameSettings.requiredKeys}`;
  document.getElementById('level-count').innerText = gameSettings.currentLevel;
}

function updateBannerText(text) {
  document.getElementById('cutscene-banner-text').innerText = text;
}

function updateDialogText(text) {
  document.getElementById('dialog-text').innerText = text;
  document.getElementById('btn-next-dialog').innerText = "Continuar ▶";
}

function nextCutsceneStep() {
  if (gameState === 'CUTSCENE_MANSION') {
    startTutorial();
  }
}

function updateTutorialText(msg) {
  document.getElementById('tutorial-text').innerText = msg;
}

function updateCutsceneCity() {
  cutsceneTimer++;

  rainDrops.forEach(drop => {
    drop.y += drop.speed;
    drop.x -= 1.5;
    if (drop.y > 450) {
      drop.y = -10;
      drop.x = Math.random() * 800;
    }
  });

  if (cutscenePhase === 1) {
    if (player.x < 350) {
      player.x += 0.8;
    } else {
      cutscenePhase = 2;
      cutsceneTimer = 0;
      updateBannerText("🚗 ¡CUIDADO! Una camioneta sospechosa frena de golpe...");
    }
  }
  else if (cutscenePhase === 2) {
    if (van.x < 260) {
      van.x += van.speed;
    } else {
      if (cutsceneTimer > 60) {
        cutscenePhase = 3;
        cutsceneTimer = 0;
        kidnapper1.x = van.x + 40;
        kidnapper1.y = van.y + 20;
        kidnapper2.x = van.x + 80;
        kidnapper2.y = van.y + 20;
        updateBannerText("🚨 ¡Dos encapuchados bajan de la camioneta!");
      }
    }
  }
  else if (cutscenePhase === 3) {
    let targetX = player.x - 20;
    if (kidnapper1.x < targetX) kidnapper1.x += 1.5;
    if (kidnapper2.x < targetX + 35) kidnapper2.x += 1.5;

    if (Math.abs(kidnapper1.x - targetX) < 5) {
      if (cutsceneTimer > 40) {
        cutscenePhase = 4;
        cutsceneTimer = 0;
        updateBannerText("😱 ¡Te han atrapado! ¡Te suben a la fuerza!");
      }
    }
  }
  else if (cutscenePhase === 4) {
    player.x = van.x + 60;
    kidnapper1.x = van.x + 40;
    kidnapper2.x = van.x + 80;

    if (cutsceneTimer > 50) {
      van.x += 4.5;
    }

    if (van.x > 820) {
      cutscenePhase = 5;
    }
  }
  else if (cutscenePhase === 5) {
    fadeAlpha += 0.02;
    if (fadeAlpha >= 1) {
      startMansionCutscene();
    }
  }
}

function updateCutsceneMansion() {
  if (fadeAlpha > 0) fadeAlpha -= 0.015;
  if (blurAmount > 0) blurAmount -= 0.08;
}

function updateTutorial() {
  if (isHiddenInCabinet) return;

  if (keysPressed['arrowup'] || keysPressed['w']) player.y -= player.speed;
  if (keysPressed['arrowdown'] || keysPressed['s']) player.y += player.speed;
  if (keysPressed['arrowleft'] || keysPressed['a']) player.x -= player.speed;
  if (keysPressed['arrowright'] || keysPressed['d']) player.x += player.speed;

  player.x = Math.max(45, Math.min(canvas.width - 50, player.x));
  player.y = Math.max(65, Math.min(canvas.height - 70, player.y));

  if (tutorialStep === 1) {
    let dist = Math.hypot(player.x - 250, player.y - 240);
    if (dist < 30) {
      tutorialStep = 2;
      updateTutorialText("¡Bien! Ahora acércate al armario morado y presiona [E] para esconderte.");
    }
  }

  checkProximity();
}

function handleKeyDown(e) {
  keysPressed[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === 'e') handleInteraction();
}

function handleKeyUp(e) {
  keysPressed[e.key.toLowerCase()] = false;
}

function handleInteraction() {
  if (!currentInteractiveObject) return;

  if (currentInteractiveObject.type === 'cabinet') {
    isHiddenInCabinet = !isHiddenInCabinet;
    if (gameState === 'TUTORIAL' && tutorialStep === 2) {
      tutorialStep = 3;
      updateTutorialText("¡Excelente! Esconderte evita que los monstruos te vean. Sal del armario y examina el cofre.");
    }
  } else if (currentInteractiveObject.type === 'chest') {
    let targetChest = chests[currentInteractiveObject.index];
    if (gameState === 'TUTORIAL' && tutorialStep === 3) {
      alert("📜 Nota de Tutorial: 'Para escapar, responde las preguntas de los cofres para obtener llaves y abrir la puerta principal.'");
      document.getElementById('tutorial-banner').classList.add('hidden');
      initGame();
    } else if (gameState === 'GAME' && !targetChest.opened) {
      openPuzzleModal(targetChest);
    }
  } else if (currentInteractiveObject.type === 'door' && gameState === 'GAME') {
    if (gameSettings.keys >= gameSettings.requiredKeys) {
      if (gameSettings.currentLevel < 3) {
        alert(`🎉 ¡Excelente! Has completado el Nivel ${gameSettings.currentLevel}. ¡Avanzando al siguiente sector de la Mansión!`);
        loadLevelData(gameSettings.currentLevel + 1);
      } else {
        triggerEndGame(true, "🏆 ¡FELICIDADES! Has escapado exitosamente de la Mansión de las Sombras.");
      }
    } else {
      alert(`La puerta está sellada. Necesitas ${gameSettings.requiredKeys} llave(s)/fragmentos. Tienes: ${gameSettings.keys}`);
    }
  }
}

function updateMonsterAI() {
  monsters.forEach(m => {
    let dist = Math.hypot(player.x - m.x, player.y - m.y);

    if (!isHiddenInCabinet && dist < m.visionRadius) {
      m.isChasing = true;
      let angle = Math.atan2(player.y - m.y, player.x - m.x);
      m.x += Math.cos(angle) * m.speed;
      m.y += Math.sin(angle) * m.speed;
    } else {
      m.isChasing = false;
      if (m.y < m.patrolTargetY) {
        m.y += m.speed * 0.8;
        if (m.y >= m.patrolMaxY) m.patrolTargetY = m.patrolMinY;
      } else {
        m.y -= m.speed * 0.8;
        if (m.y <= m.patrolMinY) m.patrolTargetY = m.patrolMaxY;
      }
    }
  });
}

function drawMonsterVision(context) {
  monsters.forEach(m => {
    context.save();
    context.beginPath();
    context.arc(m.x, m.y, m.visionRadius, 0, Math.PI * 2);
    let color = m.isChasing ? 'rgba(231, 76, 60, 0.25)' : 'rgba(142, 68, 173, 0.15)';
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = m.isChasing ? '#e74c3c' : '#8e44ad';
    context.lineWidth = 1;
    context.stroke();
    context.restore();
  });
}

function updateGame() {
  if (isHiddenInCabinet) {
    updateMonsterAI();
    return;
  }

  if (keysPressed['arrowup'] || keysPressed['w']) player.y -= player.speed;
  if (keysPressed['arrowdown'] || keysPressed['s']) player.y += player.speed;
  if (keysPressed['arrowleft'] || keysPressed['a']) player.x -= player.speed;
  if (keysPressed['arrowright'] || keysPressed['d']) player.x += player.speed;

  player.x = Math.max(45, Math.min(canvas.width - 50, player.x));
  player.y = Math.max(65, Math.min(canvas.height - 70, player.y));

  updateMonsterAI();

  coins.forEach(c => {
    if (!c.collected && isColliding(player, { x: c.x, y: c.y, size: 20 })) {
      c.collected = true;
      gameSettings.coins += 10;
      updateHUD();
    }
  });

  monsters.forEach(m => {
    if (!isHiddenInCabinet && isColliding(player, m)) {
      gameSettings.lives -= 1;
      updateHUD();
      player.x = 100;
      player.y = 240;

      if (gameSettings.lives <= 0) {
        triggerEndGame(false, "Tu mente ha sucumbido...");
      }
    }
  });

  checkProximity();
}

function drawCutsceneCity() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let skyGrad = ctx.createLinearGradient(0, 0, 0, 300);
  skyGrad.addColorStop(0, '#0c0517');
  skyGrad.addColorStop(1, '#2c1342');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, 300);

  ctx.fillStyle = '#0a0514';
  ctx.fillRect(40, 60, 90, 240);
  ctx.fillRect(150, 40, 110, 260);
  ctx.fillRect(300, 80, 100, 220);
  ctx.fillRect(430, 30, 120, 270);
  ctx.fillRect(580, 70, 90, 230);

  ctx.fillStyle = '#f1c40f';
  for (let wy = 80; wy < 260; wy += 30) {
    ctx.fillRect(170, wy, 12, 10);
    ctx.fillRect(200, wy, 12, 10);
    ctx.fillRect(460, wy, 12, 10);
  }

  ctx.fillStyle = '#181721';
  ctx.fillRect(0, 290, canvas.width, 160);
  ctx.fillStyle = '#f39c12';
  for (let rx = 0; rx < canvas.width; rx += 60) {
    ctx.fillRect(rx, 360, 30, 5);
  }

  drawStreetLamp(120, 190);
  drawStreetLamp(680, 190);

  if (cutscenePhase < 4) {
    drawCustomCharacter(ctx, player.x, player.y, player.size);
  }

  ctx.fillStyle = '#1e272c';
  ctx.fillRect(van.x, van.y, van.width, van.height);
  ctx.fillStyle = '#34495e';
  ctx.fillRect(van.x + 20, van.y - 15, van.width - 40, 20);
  
  ctx.fillStyle = '#7f8c8d';
  ctx.fillRect(van.x + 80, van.y - 10, 30, 12);
  
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(van.x + 30, van.y + van.height, 14, 0, Math.PI * 2);
  ctx.arc(van.x + 110, van.y + van.height, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(van.x, van.y + 10, 6, 12);
  ctx.fillStyle = '#f1c40f';
  ctx.fillRect(van.x + van.width - 6, van.y + 10, 6, 12);

  if (cutscenePhase >= 3 && cutscenePhase < 5) {
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(kidnapper1.x, kidnapper1.y, 28, 28);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(kidnapper1.x + 6, kidnapper1.y + 8, 5, 4);
    ctx.fillRect(kidnapper1.x + 17, kidnapper1.y + 8, 5, 4);

    ctx.fillStyle = '#111';
    ctx.fillRect(kidnapper2.x, kidnapper2.y, 28, 28);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(kidnapper2.x + 6, kidnapper2.y + 8, 5, 4);
    ctx.fillRect(kidnapper2.x + 17, kidnapper2.y + 8, 5, 4);
  }

  ctx.strokeStyle = 'rgba(174, 194, 224, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  rainDrops.forEach(drop => {
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 3, drop.y + drop.length);
  });
  ctx.stroke();

  if (fadeAlpha > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawMansionScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 40; x < canvas.width - 40; x += 40) {
    for (let y = 50; y < canvas.height - 50; y += 40) {
      drawSprite(assets.floor, x, y, 40, 40, ((x + y) / 40) % 2 === 0 ? '#11111d' : '#171728');
    }
  }

  for (let x = 0; x < canvas.width; x += 40) {
    drawSprite(assets.wall, x, 0, 40, 50, '#222235');
    drawSprite(assets.wall, x, canvas.height - 50, 40, 50, '#222235');
  }

  drawSprite(assets.carpet, 220, 180, 360, 140, '#5c1212');

  cabinets.forEach(cab => {
    drawSprite(assets.cabinet, cab.x - 25, cab.y - 30, cab.width, cab.height, '#3c184e');
  });

  chests.forEach(ch => {
    drawSprite(assets.chest, ch.x - 20, ch.y - 20, ch.width, ch.height, ch.opened ? '#57606f' : '#d35400');
  });

  drawSprite(assets.door, door.x, door.y, door.width, door.height, '#c0392b');

  if (gameState === 'GAME') {
    coins.forEach(c => {
      if (!c.collected) drawSprite(assets.coin, c.x - 10, c.y - 10, 20, 20, '#f1c40f');
    });

    drawMonsterVision(ctx);
    monsters.forEach(m => {
      drawSprite(assets.shadow, m.x - 16, m.y - 16, m.size, m.size, '#0c0c14');
    });
  }

  if (gameState === 'TUTORIAL' && tutorialStep === 1) {
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(250, 240, 25, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (!isHiddenInCabinet) {
    drawCustomCharacter(ctx, player.x, player.y, player.size);
  }

  let gradient = ctx.createRadialGradient(player.x, player.y, 30, player.x, player.y, 200);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.92)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === 'CUTSCENE_MANSION') {
    if (blurAmount > 0.5) {
      ctx.fillStyle = `rgba(15, 10, 25, ${Math.min(0.8, blurAmount / 12)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (fadeAlpha > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}

function drawStreetLamp(x, y) {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(x, y, 6, 100);
  ctx.fillStyle = '#f1c40f';
  ctx.fillRect(x - 5, y - 5, 16, 8);

  let lampGrad = ctx.createRadialGradient(x + 3, y, 5, x + 3, y + 80, 90);
  lampGrad.addColorStop(0, 'rgba(241, 196, 15, 0.35)');
  lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lampGrad;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + 3);
  ctx.lineTo(x - 60, y + 100);
  ctx.lineTo(x + 66, y + 100);
  ctx.closePath();
  ctx.fill();
}

function checkProximity() {
  let prompt = document.getElementById('action-prompt');
  currentInteractiveObject = null;

  for (let i = 0; i < cabinets.length; i++) {
    if (isColliding(player, { x: cabinets[i].x, y: cabinets[i].y, size: 50 })) {
      currentInteractiveObject = { type: 'cabinet', index: i };
      prompt.innerText = isHiddenInCabinet ? "Presiona [E] para Salir" : "Presiona [E] para Esconderte";
      prompt.classList.remove('hidden');
      return;
    }
  }

  for (let i = 0; i < chests.length; i++) {
    if (isColliding(player, { x: chests[i].x, y: chests[i].y, size: 40 })) {
      currentInteractiveObject = { type: 'chest', index: i };
      prompt.innerText = gameState === 'TUTORIAL' ? "Presiona [E] para Leer Nota" : (chests[i].opened ? "Cofre Abierto" : "Presiona [E] para Abrir Cofre");
      prompt.classList.remove('hidden');
      return;
    }
  }

  if (isColliding(player, { x: door.x, y: door.y, size: 50 })) {
    currentInteractiveObject = { type: 'door' };
    prompt.innerText = "Presiona [E] para Abrir Puerta";
    prompt.classList.remove('hidden');
    return;
  }

  prompt.classList.add('hidden');
}

function isColliding(a, b) {
  let aSize = a.size || 20;
  let bSize = b.size || 20;
  return Math.abs(a.x - b.x) < (aSize + bSize) / 2 &&
         Math.abs(a.y - b.y) < (aSize + bSize) / 2;
}

function drawSprite(img, x, y, width, height, fallbackColor) {
  if (img.complete && img.naturalWidth !== 0) {
    ctx.drawImage(img, x, y, width, height);
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(x, y, width, height);
  }
}

function initGame() {
  gameState = 'GAME';
  document.getElementById('hud').classList.remove('hidden');
  updateHUD();
}

function gameLoop() {
  if (gameState === 'CUTSCENE_CITY') {
    updateCutsceneCity();
    drawCutsceneCity();
  } else if (gameState === 'CUTSCENE_MANSION') {
    updateCutsceneMansion();
    drawMansionScene();
  } else if (gameState === 'TUTORIAL') {
    updateTutorial();
    drawMansionScene();
  } else if (gameState === 'GAME') {
    updateGame();
    drawMansionScene();
  }

  if (gameState !== 'GAMEOVER') {
    requestAnimationFrame(gameLoop);
  }
}

function openPuzzleModal(targetChest) {
  let modal = document.getElementById('puzzle-modal');
  let bank = puzzleBank[gameSettings.difficulty][gameSettings.currentLevel];
  let puzzle = bank[targetChest.id] || bank[0];

  document.getElementById('puzzle-question').innerText = puzzle.q;
  let optionsDiv = document.getElementById('puzzle-options');
  optionsDiv.innerHTML = '';

  puzzle.options.forEach((opt, idx) => {
    let btn = document.createElement('button');
    btn.className = 'puzzle-btn';
    btn.innerText = `${idx + 1}. ${opt}`;
    btn.onclick = () => {
      if (idx === puzzle.correct) {
        targetChest.opened = true;
        if (puzzle.reward === "key") {
          gameSettings.keys += 1;
          alert("¡Correcto! Has obtenido una Llave / Fragmento 🔑");
        } else {
          gameSettings.coins += 25;
          alert("¡Correcto! Has obtenido un botín extra de 25 Monedas 🪙");
        }
        updateHUD();
        modal.classList.add('hidden');
      } else {
        alert("Incorrecto. Intenta de nuevo.");
        modal.classList.add('hidden');
      }
    };
    optionsDiv.appendChild(btn);
  });

  modal.classList.remove('hidden');
}

function triggerEndGame(won, message) {
  gameState = 'GAMEOVER';
  let modal = document.getElementById('end-modal');
  document.getElementById('end-title').innerText = won ? "🏆 ¡VICTORIA DE ESCAPE!" : "💀 GAME OVER";
  document.getElementById('end-message').innerText = message;
  modal.classList.remove('hidden');
}