var Ball,
    Paddle,
    UI,
    Level;

var BLX = function () {
    "use strict";

    this.canvasObject = null;
    this.canvasWidth = null;
    this.canvasHeight = null;
    this.ctx = null;

    this.points = 0;
    this.maxLives = 5;
    this.lives = 3;

    this.columns = 9;
    this.blockHeight = 20;
    this.blockWidth = 60;
    this.blockMargin = 6;
    this.level = 9;
    this.levelObject = new Level();

    this.isLoopRunning = false;
    this.loopID = 0;

    this.ballRadius = 12;
    this.ballSpeed = 5;
    this.ball = new Ball();

    this.paddleWidth = 80;
    this.paddleHeight = 8;
    this.paddleSpeed = 7;
    this.paddle = new Paddle();

    this.uiHasChanged = false;
    this.ui = new UI();

    return this;
};

// SETUP FUNCTIONS
(function () {
    "use strict";

    this.setupCanvas = function (canvas, canvasWidth, canvasHeight, ctx) {
        this.canvasObject = canvas;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ctx = ctx;
    };

    this.setupUI = function (uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon) {
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
    };

    this.setupObjects = function () {
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

        this.levelObject.init(
            this.columns,
            this.blockHeight,
            this.blockWidth,
            this.blockMargin
        );

        this.levelObject.setCurrentLevel(this.level);
        this.levelObject.setupBlocks();
    };

}.call(BLX.prototype));

// CANVAS FUNCTIONS
(function () {
    "use strict";

    this.clearCanvas = function () {
        BLX.ctx.clearRect(0, 0, BLX.canvasWidth, BLX.canvasHeight);
    };

    this.paintCanvas = function () {
        BLX.clearCanvas();
        BLX.levelObject.drawBlocks(BLX.ctx);
        BLX.ball.draw(BLX.ctx);
        BLX.paddle.draw(BLX.ctx);
    };

}.call(BLX.prototype));

// LOOP FUNCTIONS
(function () {
    "use strict";

    this.runLoop = function () {
        BLX.paintCanvas();
        BLX.paddle.updatePosition(BLX.canvasWidth);
        BLX.ball.startNextMove(BLX.paddle);

        BLX.ball.iterateBlocksForCollisionCheck(
            BLX.levelObject.levelList[BLX.level].rows,
            BLX.columns,
            BLX.levelObject.blocks
        );

        if (BLX.ball.checkDroppedBall()) {
            BLX.liveLost();
        } else {
            BLX.ball.setBallToNextPosition();
        }

        if (BLX.ball.pointsForOneMove !== 0) {
            BLX.points += BLX.ball.pointsForOneMove;
            BLX.uiHasChanged = true;
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
            BLX.loopID = requestAnimationFrame(BLX.runLoop);
        }
    };

    this.startLoop = function () {
        setTimeout(function () {
            BLX.isLoopRunning = true;
            BLX.runLoop();
        }, 2000);
    };

    this.stopLoop = function () {
        BLX.isLoopRunning = false;
        cancelAnimationFrame(BLX.loopID);
    };

}.call(BLX.prototype));

// EVENT HANDLER FUNCTIONS
(function () {
    "use strict";

    this.keyDownHandler = function (e) {
        if (e.keyCode === 39) {
            BLX.paddle.rightArrowPressed = true;
        } else if (e.keyCode === 37) {
            BLX.paddle.leftArrowPressed = true;
        }
    };

    this.keyUpHandler = function (e) {
        if (e.keyCode === 39) {
            BLX.paddle.rightArrowPressed = false;
        } else if (e.keyCode === 37) {
            BLX.paddle.leftArrowPressed = false;
        }
    };

    this.mouseMoveHandler = function (e) {
        var relativeX = e.clientX - BLX.canvasObject.offsetLeft;

        if (relativeX > 0 && relativeX < BLX.canvasWidth) {
            BLX.paddle.x = relativeX - BLX.paddle.width / 2;
        }
    };

}.call(BLX.prototype));

// GAME LOGIC FUNCTIONS
(function () {
    "use strict";

    this.liveLost = function () {
        BLX.stopLoop();
        BLX.lives -= 1;
        BLX.uiHasChanged = true;

        if (BLX.lives < 1) {
            BLX.gameOver();
        } else {
            BLX.ball.reset(BLX.ballSpeed);
            BLX.paddle.reset(BLX.paddleWidth, BLX.paddleSpeed);
            BLX.startLoop();
        }
    };

    this.gameOver = function () {
        console.log("Sorry - Game Over");
    };

    this.levelCleared = function () {
        console.log("Level cleared");
    };

}.call(BLX.prototype));

