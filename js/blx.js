var Ball,
    Paddle,
    UI,
    Level,
    Collision,
    Sound;

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
    this.count = 3;
    this.countdownInterval = null;

    this.sound = new Sound();

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

    this.setupAlerts = function (gamePaused, levelCleared, clearedLevel, gameOver, countdown) {
        this.ui.setupAlerts(gamePaused, levelCleared, clearedLevel, gameOver, countdown);
    };

    this.setupUIBar = function (uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon) {
        this.ui.setupUIBar(uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon);
    };

    this.setupUI = function () {
        BLX.updateUI();
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
            this.canvasHeight, // - this.paddle.height,
            this.paddle,
            this.level,
            this.ball,
            this.sound
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

    this.updateUI = function () {
        BLX.ui.update(
            BLX.level.currentLevel,
            BLX.points,
            BLX.lives,
            BLX.maxLives
        );
    };

}.call(BLX.prototype));

// LOOP FUNCTIONS
(function () {
    "use strict";

    this.runLoop = function (timestamp) {

        var thisLoop = timestamp;

        if (!BLX.lastLoop) {
            BLX.ball.frameSpeed = 1;
        } else {
            BLX.ball.frameSpeed = (thisLoop - BLX.lastLoop) / 16;
        }

        BLX.lastLoop = thisLoop;
        // console.log('Fps: ' + Math.round(60 / BLX.ball.frameSpeed));
        BLX.paintCanvas();
        BLX.paddle.updatePosition(BLX.canvasWidth);
        BLX.ball.startNextMove(BLX.paddle);

        BLX.collision.iterateBlocksForCollisionCheck();

        if (BLX.collision.checkDroppedBall()) {
            BLX.liveLost();
            return;
        } else {
            BLX.ball.setBallToNextPosition();
        }

        if (BLX.ball.pointsForOneMove !== 0) {
            BLX.points += BLX.ball.pointsForOneMove;
            BLX.uiHasChanged = true;
        }

        if (BLX.uiHasChanged) {
            BLX.updateUI();
        }

        if (BLX.level.blocksInLevel === 0) {
            BLX.stopLoop();
            BLX.levelCleared();
            return;
        }

        if (BLX.isLoopRunning) {
            BLX.loopID = requestAnimationFrame(BLX.runLoop);
        }
    };

    this.startLoop = function () {
        BLX.isGameActive = true;
        BLX.isLoopRunning = true;
        BLX.loopID = requestAnimationFrame(BLX.runLoop);
    };

    this.stopLoop = function () {
        BLX.count = 3;
        BLX.lastLoop = null;
        BLX.isLoopRunning = false;
        cancelAnimationFrame(BLX.loopID);
    };

}.call(BLX.prototype));

// EVENT HANDLER FUNCTIONS
(function () {
    "use strict";

    this.keyPressHandler = function (e) {
        if (e.keyCode === 32) {
            if (BLX.isGameActive) {
                if (BLX.isLoopRunning) {
                    BLX.ui.pauseGame(true);
                    BLX.stopLoop();
                } else {
                    BLX.ui.pauseGame(false);
                    BLX.startLoop();
                }
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
        BLX.updateUI();

        if (BLX.lives < 1) {
            BLX.gameOver();
        } else {
            BLX.ball.reset(BLX.level.levelList[BLX.level.currentLevel].ballSpeed);
            BLX.paddle.reset(BLX.level.levelList[BLX.level.currentLevel].paddleWidth, BLX.paddleSpeed);
            BLX.paintCanvas();
            BLX.countdown();
        }
    };

    this.gameOver = function () {
        BLX.isGameActive = false;
        BLX.ui.showGameOver(true);
        BLX.level.currentLevel = 0;
    };

    this.levelCleared = function () {
        BLX.isGameActive = false;
        BLX.ui.showLevelCleared(true, BLX.level.currentLevel);
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
        BLX.paintCanvas();
        BLX.updateUI();
        BLX.ui.showLevelCleared(false);
        BLX.ui.showGameOver(false);
        BLX.countdown();
    };

    this.countdown = function () {
        BLX.isGameActive = false;
        BLX.countdownInterval = setInterval(function () {
            BLX.showCountdown();
        }, 1000);
    };

    this.showCountdown = function () {
        BLX.ui.showCountdown(BLX.count);
        if (BLX.count <= 0) {
            clearInterval(BLX.countdownInterval);
            BLX.startLoop();
            return;
        } else {
            BLX.count -= 1;
        }
    };

}.call(BLX.prototype));

