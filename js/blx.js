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
    this.initialLives = 3;
    this.lives = this.initialLives;

    this.columns = 10;
    this.blockHeight = 30;
    this.blockWidth = 40;
    this.blockMargin = 6;
    this.canvasPadding = 73;
    this.level = 0;
    this.levelObject = new Level();

    this.isGameActive = false;
    this.isLoopRunning = false;
    this.loopID = 0;

    this.ballRadius = 12;
    this.ballSpeed = 5;
    this.ball = new Ball();

    this.paddleWidth = 80;
    this.paddleHeight = 8;
    this.paddleSpeed = 7;
    this.paddle = new Paddle();
    
    this.domGamePaused = null;
    this.domLevelCleared = null;
    this.domGameOver = null;

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
    
    this.setUpAlerts = function (gamePaused, levelCleared, gameOver) {
        this.domGamePaused = gamePaused;
        this.domLevelCleared = levelCleared;
        this.domGameOver = gameOver;
    };

    this.setupUI = function (uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon) {
        this.ui.init(uiLevel, uiPoints, uiLives, uiLiveIcon, uiLiveLostIcon, this.domGamePaused, this.domLevelCleared, this.domGameOver);

        this.ui.update(
            this.level,
            this.points,
            this.lives,
            this.maxLives
        );
    };

    this.setupObjects = function () {
        
        this.levelObject.init(
            this.columns,
            this.blockHeight,
            this.blockWidth,
            this.blockMargin,
            this.canvasPadding
        );

        this.levelObject.setCurrentLevel(this.level);
        this.levelObject.setupBlocks();
        
        this.ball.init(
            this.ballRadius,
            this.levelObject.levelList[this.levelObject.currentLevel].ballSpeed,
            this.canvasHeight - this.paddleHeight,
            this.canvasWidth
        );

        this.paddle.init(
            this.levelObject.levelList[this.levelObject.currentLevel].paddleWidth,
            this.paddleHeight,
            this.canvasWidth / 2 - this.levelObject.levelList[this.levelObject.currentLevel].paddleWidth / 2,
            this.canvasHeight - this.paddleHeight,
            this.paddleSpeed
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
            BLX.levelObject.levelList[BLX.levelObject.currentLevel].rows,
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

        if (BLX.levelObject.blocksInLevel === 0) {
            BLX.stopLoop();
            BLX.levelCleared();
        }

        if (BLX.isLoopRunning) {
            BLX.loopID = requestAnimationFrame(BLX.runLoop);
        }
    };

    this.startLoop = function () {
        setTimeout(function () {
            BLX.isGameActive = true;
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
            BLX.paddle.x = relativeX - BLX.levelObject.levelList[BLX.levelObject.currentLevel].paddleWidth / 2;
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
            BLX.ball.reset(BLX.levelObject.levelList[BLX.levelObject.currentLevel].ballSpeed);
            BLX.paddle.reset(BLX.levelObject.levelList[BLX.levelObject.currentLevel].paddleWidth, BLX.paddleSpeed);
            BLX.startLoop();
        }
    };

    this.gameOver = function () {
        BLX.isGameActive = false;
        BLX.ui.showGameOver(true);
        BLX.currentLevel = 0;
        BLX.lives = BLX.initialLives;
    };

    this.levelCleared = function () {
        BLX.isGameActive = false;
        BLX.ui.showLevelCleared(true);
    };
    
    this.goToNextLevel = function () {
        BLX.currentLevel += 1;
        if (BLX.currentLevel < BLX.levelObject.levelList.length - 1) {
            BLX.startLevel();
        } else {
            BLX.currentLevel = 0;
        }
    };
    
    this.startLevel = function () {
        BLX.levelObject.setCurrentLevel(BLX.currentLevel);
        BLX.levelObject.setupBlocks();
        BLX.ball.reset(BLX.levelObject.levelList[BLX.levelObject.currentLevel].ballSpeed);
        BLX.paddle.reset(BLX.levelObject.levelList[BLX.levelObject.currentLevel].paddleWidth, BLX.paddleSpeed);
        BLX.ui.showLevelCleared(false);
        BLX.ui.showGameOver(false);
        BLX.startLoop();
    };

}.call(BLX.prototype));

