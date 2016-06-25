var Ball,
    Paddle,
    UI;

var BLX = BLX || {

    canvasObject: null,
    canvasWidth: null,
    canvasHeight: null,
    ctx: null,

    level: 2,
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

    uiHasChanged: false,
    ui: new UI(),

    init: function (
        canvas,
        canvasWidth,
        canvasHeight,
        ctx,
        uiLevel,
        uiPoints,
        uiLives,
        uiLiveIcon,
        uiLiveLostIcon
    ) {
        "use strict";
        this.canvasObject = canvas;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ctx = ctx;

        this.ball.init(
            this.ballRadius,
            this.ballSpeed,
            this.canvasHeight - this.paddleHeight,
            this.canvasWidth
        );

        this.paddle.init(
            this.paddleWidth,
            this.paddleHeight,
            this.canvasWidth / 2 - this.paddleWidth / 2,
            this.canvasHeight - this.paddleHeight,
            this.paddleSpeed
        );

        this.ui.init(
            uiLevel,
            uiPoints,
            uiLives,
            uiLiveIcon,
            uiLiveLostIcon
        );

        this.ui.update(
            this.level,
            this.points,
            this.lives,
            this.maxLives
        );

        return this;
    }
};

BLX.Canvas = {

    clearCanvas: function () {
        "use strict";
        BLX.ctx.clearRect(0, 0, BLX.canvasWidth, BLX.canvasHeight);
    },

    paintCanvas: function () {
        "use strict";
        BLX.Canvas.clearCanvas();
        BLX.ball.draw(BLX.ctx);
        BLX.paddle.draw(BLX.ctx);
    }
};

BLX.Loop = {

    runLoop: function () {
        "use strict";
        BLX.Canvas.paintCanvas();
        BLX.paddle.updatePosition(BLX.canvasWidth);
        BLX.ball.startNextMove(BLX.paddle);

        if (BLX.ball.checkDroppedBall()) {
            BLX.Game.looseLive();
        } else {
            BLX.ball.setBallToNextPosition();
        }
        if (BLX.uiHasChanged) {
            BLX.ui.update(
                BLX.level,
                BLX.points,
                BLX.lives,
                BLX.maxLives
            );
        }
        if (BLX.isLoopRunning) {
            BLX.loopID = requestAnimationFrame(BLX.Loop.runLoop);
        }
    },

    startLoop: function () {
        "use strict";
        setTimeout(function () {
            BLX.isLoopRunning = true;
            BLX.Loop.runLoop();
        }, 1000);
    },

    stopLoop: function () {
        "use strict";
        BLX.isLoopRunning = false;
        cancelAnimationFrame(BLX.loopID);
    }
};

BLX.Handler = {

    keyDownHandler: function (e) {
        "use strict";
        if (e.keyCode === 39) {
            BLX.paddle.rightArrowPressed = true;
        } else if (e.keyCode === 37) {
            BLX.paddle.leftArrowPressed = true;
        }
    },

    keyUpHandler: function (e) {
        "use strict";
        if (e.keyCode === 39) {
            BLX.paddle.rightArrowPressed = false;
        } else if (e.keyCode === 37) {
            BLX.paddle.leftArrowPressed = false;
        }
    },

    mouseMoveHandler: function (e) {
        "use strict";
        var relativeX = e.clientX - BLX.canvasObject.offsetLeft;

        if (relativeX > 0 && relativeX < BLX.canvasWidth) {
            BLX.paddle.x = relativeX - BLX.paddle.width / 2;
        }
    }

};

BLX.Game = {

    looseLive: function () {
        "use strict";
        BLX.Loop.stopLoop();
        BLX.lives -= 1;
        BLX.uiHasChanged = true;

        if (BLX.lives < 1) {
            BLX.Game.gameOver();
        } else {
            BLX.ball.reset(BLX.ballSpeed);
            BLX.paddle.reset(BLX.paddleWidth, BLX.paddleSpeed);
            BLX.Loop.startLoop();
        }
    },

    gameOver: function () {
        "use strict";
        console.log("Sorry - Game Over");
    },

    clearLevel: function () {
        "use strict";
        console.log("Level cleared");
    }
};

