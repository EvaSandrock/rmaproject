"use strict";

var BLOCKS = BLOCKS || {};

BLOCKS.canvas = document.getElementById('canvas');
BLOCKS.canvasWidth = BLOCKS.canvas.width;
BLOCKS.canvasHeight = BLOCKS.canvas.height;
BLOCKS.ctx = BLOCKS.canvas.getContext('2d');

BLOCKS.level = 0;
BLOCKS.points = 123;
BLOCKS.maxLives = 5;
BLOCKS.lives = 3;

var Paddle;
BLOCKS.paddleWidth = 80;
BLOCKS.paddleHeight = 8;
BLOCKS.paddleSpeed = 7;
BLOCKS.paddle = new Paddle(
    BLOCKS.paddleWidth,
    BLOCKS.paddleHeight,
    BLOCKS.canvasWidth / 2 - BLOCKS.paddleWidth / 2,
    BLOCKS.canvasHeight - BLOCKS.paddleHeight,
    BLOCKS.paddleSpeed
);

var Ball;
BLOCKS.ballRadius = 12;
BLOCKS.ballSpeed = 5;
BLOCKS.ball = new Ball(
    BLOCKS.canvasWidth / 2,
    BLOCKS.canvasHeight - BLOCKS.ballRadius - BLOCKS.paddleHeight,
    BLOCKS.ballRadius,
    BLOCKS.ballSpeed
);

var UI;
BLOCKS.ui = new UI();

BLOCKS.clearCanvas = function () {
    BLOCKS.ctx.clearRect(0, 0, BLOCKS.canvasWidth, BLOCKS.canvasHeight);
};

BLOCKS.paintCanvas = function () {
    BLOCKS.clearCanvas();
    BLOCKS.ball.draw(BLOCKS.ctx);
    BLOCKS.paddle.draw(BLOCKS.ctx);
};

BLOCKS.isLoopRunning = false;
BLOCKS.loopID = 0;

BLOCKS.runLoop = function () {

    BLOCKS.paintCanvas();
    BLOCKS.paddle.updatePosition(BLOCKS.canvasWidth);
    BLOCKS.ball.checkCollisions(BLOCKS.canvasWidth, BLOCKS.canvasHeight, BLOCKS.paddle);

    if (BLOCKS.ball.checkDroppedBall(BLOCKS.canvasHeight, BLOCKS.paddle)) {

        BLOCKS.looseLive();

    } else {

        BLOCKS.ball.setPositionToNextPosition();

    }

    if (BLOCKS.isLoopRunning) {
        BLOCKS.loopID = requestAnimationFrame(BLOCKS.runLoop);
    }

};

BLOCKS.startLoop = function () {

    console.log('STARTING');
    setTimeout(function () {
        BLOCKS.isLoopRunning = true;
        BLOCKS.loopID = requestAnimationFrame(BLOCKS.runLoop);
    }, 1000);

};

BLOCKS.stopLoop = function () {

    BLOCKS.isRunning = false;
    cancelAnimationFrame(BLOCKS.loopID);
    console.log('STOPPED');

};

BLOCKS.keyDownHandler = function (e) {

    if (e.keyCode === 39) {
        
        BLOCKS.paddle.rightArrowPressed = true;
        
    } else if (e.keyCode === 37) {
        
        BLOCKS.paddle.leftArrowPressed = true;
        
    }

};

BLOCKS.keyUpHandler = function (e) {

    if (e.keyCode === 39) {
        
        BLOCKS.paddle.rightArrowPressed = false;
        
    } else if (e.keyCode === 37) {
        
        BLOCKS.paddle.leftArrowPressed = false;
        
    }

};

BLOCKS.mouseMoveHandler = function (e) {

    var relativeX = e.clientX - BLOCKS.canvas.offsetLeft;

    if (relativeX > 0 && relativeX < BLOCKS.canvasWidth) {
        
        BLOCKS.paddle.x = relativeX - BLOCKS.paddle.width / 2;
        
    }

};

window.addEventListener('keydown', BLOCKS.keyDownHandler, false);
window.addEventListener('keyup', BLOCKS.keyUpHandler, false);
window.addEventListener('mousemove', BLOCKS.mouseMoveHandler, false);

BLOCKS.startLoop();


/*
function App() {

        this.root.paintCanvas();
        this.root.paddle.updatePosition(root.canvasWidth);
        this.root.ball.updatePosition(root.canvasWidth, root.canvasHeight, root.paddle);

    var self = this;
    this.loop = new Loop(self);

    console.log(loop);
        canvas = document.getElementById('canvas'),
        canvasWidth = canvas.width,
        canvasHeight = canvas.height,
        ctx = canvas.getContext('2d'),

        paddleWidth = 80,
        paddleHeight = 8,
        paddleSpeed = 7,
        paddle = new Paddle(
            paddleWidth,
            paddleHeight,
            canvasWidth / 2 - paddleWidth / 2,
            canvasHeight - paddleHeight,
            paddleSpeed
        ),

        ballRadius = 12,
        ballSpeed = 5,
        ball = new Ball(
            canvasWidth / 2,
            canvasHeight - ballRadius - paddleHeight,
            ballRadius,
            ballSpeed
        ),

        ui = new UI(),

        level = 0,
        points = 123,
        maxLives = 5,
        lives = 3,

        loop = new Loop(self);

    function looseLive() {

        if(self.lives > 1) {
            self.lives--;
            self.ui.update(self.points, self.maxLives, self.lives);
            self.loop.stop();
            self.ball.reset(self.ballSpeed);

            setTimeout(function() {
                self.loop.start();
            }, 1000);

        } else {
            self.ui.alert.gameOver(self.points);
            self.loop.stop();
            self.ball.reset(self.ballSpeed);
            alert('Game Over');
        }

    }

};

var app = new App();

this.app.loop.start();






var self = this;

var canvas = document.getElementById('canvas'),
    canvasWidth = canvas.width,
    canvasHeight = canvas.height,
    ctx = canvas.getContext('2d');

var paddleWidth = 80,
    paddleHeight = 8,
    paddleSpeed = 7,
    paddle = new Paddle(
        paddleWidth,
        paddleHeight,
        canvasWidth / 2 - paddleWidth / 2,
        canvasHeight - paddleHeight,
        paddleSpeed
    );

var ballRadius = 12,
    ballSpeed = 5,
    ball = new Ball(
        canvasWidth / 2,
        canvasHeight - ballRadius - paddleHeight,
        ballRadius,
        ballSpeed
    );

var ui = new UI();

var level = 0,
    points = 123,
    maxLives = 5,
    lives = 3;

var loop = new Loop(self);

var looseLive = function() {

    if(self.lives > 1) {
        self.lives--;
        self.ui.update(self.points, self.maxLives, self.lives);
        self.loop.stop();
        self.ball.reset(self.ballSpeed);

        setTimeout(function() {
            self.loop.start();
        }, 1000);

    } else {
        self.ui.alert.gameOver(self.points);
        self.loop.stop();
        self.ball.reset(self.ballSpeed);
        alert('Game Over');
    }

};

var gainLive = function() {

    if(self.lives < self.maxLives) {
        self.lives++;
        self.ui.update(self.points, self.maxLives, self.lives);
    }

};

var levelUp = function() {

    self.level++;
    self.lives = self.maxLives;
    self.ui.alert.levelUp(self.level, self.points);

};

var clearCanvas = function() {
    self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
};

var paintCanvas = function() {
    self.clearCanvas();
    self.ball.draw(ctx);
    self.paddle.draw(ctx);
};

*/
