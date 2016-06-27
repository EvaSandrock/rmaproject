var Ball,
    Paddle,
    UI,
    Level,
    Collision;

var BLX = function () {
    "use strict";

    this.points = 0;
    this.maxLives = 5;
    this.initialLives = 3;
    this.lives = this.initialLives;

    this.columns = 10;
    this.blockHeight = 30;
    this.blockWidth = 40;
    this.blockMargin = 6;
    this.canvasPadding = 73;
    this.level = new Level();

    this.isGameActive = false;
    this.isLoopRunning = false;
    this.loopID = 0;

    this.ballRadius = 12;
    this.ballSpeed = this.level.levelList[this.level.currentLevel].ballSpeed;
    this.ball = new Ball();

    this.paddleWidth = this.level.levelList[this.level.currentLevel].paddleWidth;
    this.paddleHeight = 8;
    this.paddleSpeed = 7;
    this.paddle = new Paddle();

    this.collision = new Collision();

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

    this.setupAlerts = function (gamePaused, levelCleared, gameOver, countdown) {
        this.ui.setupAlerts(gamePaused, levelCleared, gameOver, countdown);
    };

    this.setupUIBar = function (uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon) {
        this.ui.setupUIBar(uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon);
    };

    this.setupUI = function () {
        this.ui.update(
            this.level.currentLevel,
            this.points,
            this.lives,
            this.maxLives
        );
    };

    this.setupObjects = function () {

        this.level.init(
            this.columns,
            this.blockHeight,
            this.blockWidth,
            this.blockMargin,
            this.canvasPadding
        );

        this.level.setupBlocks();

        this.ball.init(
            this.ballRadius,
            this.level.levelList[this.level.currentLevel].ballSpeed,
            this.canvasHeight - this.paddleHeight,
            this.canvasWidth,
            this.collision
        );

        this.paddle.init(
            this.level.levelList[this.level.currentLevel].paddleWidth,
            this.paddleHeight,
            this.canvasWidth / 2 - this.level.levelList[this.level.currentLevel].paddleWidth / 2,
            this.canvasHeight - this.paddleHeight,
            this.paddleSpeed
        );

        this.collision.init(
            this.canvasWidth - this.ball.radius,
            this.canvasHeight - this.paddle.height,
            this.paddle,
            this.level,
            this.ball
        );
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
        BLX.level.drawBlocks(BLX.ctx);
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

        BLX.collision.iterateBlocksForCollisionCheck();

        if (BLX.collision.checkDroppedBall()) {
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
                BLX.level.currentLevel,
                BLX.points,
                BLX.lives,
                BLX.maxLives
            );
        }

        if (BLX.level.blocksInLevel === 0) {
            BLX.stopLoop();
            BLX.levelCleared();
        }

        if (BLX.isLoopRunning) {
            BLX.loopID = requestAnimationFrame(BLX.runLoop);
        }
    };

    this.startLoop = function () {
        BLX.isGameActive = true;
        BLX.isLoopRunning = true;
        BLX.runLoop();
    };

    this.stopLoop = function () {
        BLX.isLoopRunning = false;
        cancelAnimationFrame(BLX.loopID);
    };

}.call(BLX.prototype));

// EVENT HANDLER FUNCTIONS
(function () {
    "use strict";

    this.keyPressHandler = function (e) {
        if (e.keyCode === 32) {
            if (BLX.isLoopRunning) {
                BLX.ui.pauseGame(true);
                BLX.isLoopRunning = false;
            } else if (BLX.isGameActive) {
                BLX.ui.pauseGame(false);
                BLX.isLoopRunning = true;
                BLX.runLoop();
            }
        }
    };

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
            BLX.paddle.x = relativeX - BLX.level.levelList[BLX.level.currentLevel].paddleWidth / 2;
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
            BLX.ball.reset(BLX.level.levelList[BLX.level.currentLevel].ballSpeed);
            BLX.paddle.reset(BLX.level.levelList[BLX.level.currentLevel].paddleWidth, BLX.paddleSpeed);
            BLX.startLoop();
        }
    };

    this.gameOver = function () {
        BLX.isGameActive = false;
        BLX.ui.showGameOver(true);
        BLX.level.currentLevel = 0;
        BLX.lives = BLX.initialLives;
    };

    this.levelCleared = function () {
        BLX.isGameActive = false;
        BLX.ui.showLevelCleared(true);
    };

    this.goToNextLevel = function () {
        BLX.level.currentLevel += 1;
        if (BLX.level.currentLevel < BLX.level.levelList.length - 1) {
            BLX.startLevel();
        } else {
            BLX.level.currentLevel = 0;
        }
    };

    this.startLevel = function () {
        BLX.level.setupBlocks();
        BLX.ball.reset(BLX.level.levelList[BLX.level.currentLevel].ballSpeed);
        BLX.paddle.reset(BLX.level.levelList[BLX.level.currentLevel].paddleWidth, BLX.paddleSpeed);
        BLX.ui.showLevelCleared(false);
        BLX.ui.showGameOver(false);
        BLX.startLoop();
    };

    this.startCountdown = function () {
        var count = 0;
        this.countdown(count);
    };

    this.countdown = function (count) {
        setTimeout(function (count) {
            BLX.ui.showCountdown(count);
            count -= 1;
            if (count < 0) {
                BLX.startLoop();
            } else {
                BLX.countdown(count);
            }
        }, 1000);
    };

}.call(BLX.prototype));

