var canvas = document.getElementById('canvas'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    ctx = canvas.getContext('2d');

var BLX = BLX.init(canvas, canvasWidth, canvasHeight, ctx);

window.addEventListener('keydown', BLX.Handler.keyDownHandler, false);
window.addEventListener('keyup', BLX.Handler.keyUpHandler, false);
window.addEventListener('mousemove', BLX.Handler.mouseMoveHandler, false);

BLX.Loop.startLoop();
