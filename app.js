var canvas = document.getElementById('canvas'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    ctx = canvas.getContext('2d');

var uiLevel = document.getElementById('level'),
    uiLives = document.getElementById('lives'),
    uiPoints = document.getElementById('points'),
    uiLiveIcon = '<i class="fa fa-heart"></i>',
    uiLiveLostIcon = '<i class="fa fa-heart-o"></i>';

var BLX = BLX.init(
    canvas,
    canvasWidth,
    canvasHeight,
    ctx,
    uiLevel,
    uiPoints,
    uiLives,
    uiLiveIcon,
    uiLiveLostIcon
);

window.addEventListener('keydown', BLX.Handler.keyDownHandler, false);
window.addEventListener('keyup', BLX.Handler.keyUpHandler, false);
window.addEventListener('mousemove', BLX.Handler.mouseMoveHandler, false);

BLX.Loop.startLoop();
