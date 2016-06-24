"use strict";

var Paddle,
    Ball,
    UI;

var BLX = BLX || {

    canvasObject: null,
    canvasWidth: null,
    canvasHeight: null,
    ctx: null,

    level: 0,
    points: 123,
    maxLives: 5,
    lives: 3,

    isLoopRunning: false,
    loopID: 0,

    ballRadius: 12,
    ballSpeed: 5,
    ball: new Ball(),

    paddleWidth: 80,
    paddleHeight: 8,
    paddleSpeed: 7,
    paddle: new Paddle(),

    ui: new UI(),

    init: function (canvas, canvasWidth, canvasHeight, ctx) {

        this.canvasObject = canvas;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ctx = ctx;

        this.ball.init(

            this.canvasWidth / 2,
            this.canvasHeight - this.ballRadius - this.paddleHeight,
            this.ballRadius,
            this.ballSpeed
        );

        this.paddle.init(

            this.paddleWidth,
            this.paddleHeight,
            this.canvasWidth / 2 - this.paddleWidth / 2,
            this.canvasHeight - this.paddleHeight,
            this.paddleSpeed
        );

        return this;
    }
};

BLX.Canvas = {

    clearCanvas: function () {

        BLX.ctx.clearRect(0, 0, BLX.canvasWidth, BLX.canvasHeight);
    },

    paintCanvas: function () {

        BLX.Canvas.clearCanvas();
        BLX.ball.draw(BLX.ctx);
        BLX.paddle.draw(BLX.ctx);
    }
};

BLX.Loop = {

    runLoop: function () {

        BLX.Canvas.paintCanvas();
        BLX.paddle.updatePosition(BLX.canvasWidth);
        BLX.ball.startNextMove(BLX.canvasWidth, BLX.canvasHeight, BLX.paddle);

        if (BLX.ball.checkDroppedBall(BLX.canvasHeight, BLX.paddle)) {

            BLX.looseLive();

        } else {

            BLX.ball.setBallToNextPosition();
        }

        if (BLX.isLoopRunning) {
            BLX.loopID = requestAnimationFrame(BLX.Loop.runLoop);
        }
    },

    startLoop: function () {

        console.log('STARTING');
        setTimeout(function () {
            BLX.isLoopRunning = true;
            BLX.loopID = requestAnimationFrame(BLX.Loop.runLoop);
        }, 1000);
    },

    stopLoop: function () {

        BLX.isRunning = false;
        cancelAnimationFrame(BLX.loopID);
        console.log('STOPPED');
    }
};

BLX.Handler = {

    keyDownHandler: function (e) {

        if (e.keyCode === 39) {

            BLX.paddle.rightArrowPressed = true;

        } else if (e.keyCode === 37) {

            BLX.paddle.leftArrowPressed = true;
        }
    },

    keyUpHandler: function (e) {

        if (e.keyCode === 39) {

            BLX.paddle.rightArrowPressed = false;

        } else if (e.keyCode === 37) {

            BLX.paddle.leftArrowPressed = false;
        }
    },

    mouseMoveHandler: function (e) {

        var relativeX = e.clientX - BLX.canvasObject.offsetLeft;

        if (relativeX > 0 && relativeX < BLX.canvasWidth) {

            BLX.paddle.x = relativeX - BLX.paddle.width / 2;
        }
    }

};
