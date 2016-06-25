var canvas = document.getElementById('canvas'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    ctx = canvas.getContext('2d');

var uiLevel = document.getElementById('level'),
    uiLives = document.getElementById('lives'),
    uiPoints = document.getElementById('points'),
    uiLiveIcon = '<i class="fa fa-heart"></i>',
    uiLiveLostIcon = '<i class="fa fa-heart-o"></i>';

var BLX = new BLX();

BLX.setupCanvas(canvas, canvasWidth, canvasHeight, ctx);
BLX.setupUI(uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon);
BLX.setupObjects();

window.addEventListener('keydown', BLX.keyDownHandler, false);
window.addEventListener('keyup', BLX.keyUpHandler, false);
window.addEventListener('mousemove', BLX.mouseMoveHandler, false);

BLX.startLoop();
