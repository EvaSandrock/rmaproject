var canvas = document.getElementById('canvas'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    ctx = canvas.getContext('2d');

var gamePaused = document.getElementById('gamePaused'),
    levelCleared = document.getElementById('levelCleared'),
    clearedLevel = document.getElementById('clearedLevel'),
    gameOver = document.getElementById('gameOver'),
    countdown = document.getElementById('countdown');

var uiLevel = document.getElementById('level'),
    uiLives = document.getElementById('lives'),
    uiPoints = document.getElementById('points'),
    uiLiveIcon = '<i class="fa fa-heart"></i>',
    uiLiveLostIcon = '<i class="fa fa-heart-o"></i>';

var BLX = new BLX();

BLX.setupCanvas(canvas, canvasWidth, canvasHeight, ctx);
BLX.setupAlerts(gamePaused, levelCleared, clearedLevel, gameOver, countdown);
BLX.setupUIBar(uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon);
BLX.setupUI();
BLX.setupObjects();

function nextLevel(e) {
    "use strict";
    BLX.goToNextLevel();
}

function newGame(e) {
    "use strict";
    BLX.lives = BLX.initialLives;
    BLX.points = 0;
    BLX.startLevel();
}

window.addEventListener('keydown', BLX.keyDownHandler, false);
window.addEventListener('keyup', BLX.keyUpHandler, false);
window.addEventListener('keypress', BLX.keyPressHandler, false);
window.addEventListener('mousemove', BLX.mouseMoveHandler, false);

BLX.paintCanvas();
BLX.countdown();
