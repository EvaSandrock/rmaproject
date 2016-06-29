/*global
    requestAnimationFrame, cancelAnimationFrame,
    Ball, Paddle, UI, Level, Collision, Powerup, Sound
*/

var BLX = function () {
    "use strict";

    this.points = 0;
    this.initialMaxLives = 5;
    this.maxLives = this.initialMaxLives;
    this.initialLives = 3;
    this.lives = this.initialLives;

    this.columns = 10;
    this.blockHeight = 40;
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

    this.initialPointsForNextPowerup = [500, 250, 100, 50, 25];
    this.pointsForNextPowerup = this.initialPointsForNextPowerup;
    this.nextPowerupAt = this.pointsForNextPowerup[this.pointsForNextPowerup.length - 1];

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
        BLX.ui.setup(
            BLX.canvasObject,
            BLX.level.currentLevel,
            BLX.points,
            BLX.lives,
            BLX.maxLives
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
            this.getBallSpeed(),
            this.canvasHeight - this.paddleHeight,
            this.canvasWidth,
            this.collision
        );

        this.paddle.init(
            BLX.getPaddleWidth(),
            this.paddleHeight,
            this.getPaddleX(),
            this.canvasHeight - this.paddleHeight,
            this.paddleSpeed
        );

        this.collision.init(
            this.canvasWidth - this.ball.radius,
            this.canvasHeight,
            this.paddle,
            this.level,
            this.ball,
            this.sound
        );
    };

    this.getBallSpeed = function () {
        return this.level.levelList[this.level.currentLevel].ballSpeed;
    };

    this.getPaddleWidth = function () {
        return this.level.levelList[this.level.currentLevel].paddleWidth;
    };

    this.getPaddleX = function () {
        return this.canvasWidth / 2 - this.level.levelList[this.level.currentLevel].paddleWidth / 2;
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

        BLX.checkPowerup();

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

        if (BLX.ball.bonusLifeForOneMove !== 0) {
            BLX.addBonusLife(BLX.ball.bonusLifeForOneMove);
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
    };

    this.levelCleared = function () {
        BLX.isGameActive = false;
        BLX.ui.showLevelCleared(true, BLX.level.currentLevel);
    };

    this.goToNextLevel = function () {
        BLX.level.currentLevel += 1;
        if (BLX.level.currentLevel > BLX.level.levelList.length - 1) {
            BLX.level.currentLevel = 0;
        }
        BLX.startLevel();
    };

    this.newGame = function () {
        BLX.level.currentLevel = 0;
        BLX.lives = BLX.initialLives;
        BLX.maxLives = BLX.initialMaxLives;
        BLX.pointsForNextPowerup = BLX.initialPointsForNextPowerup;
        BLX.points = 0;
        BLX.startLevel();
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

// POWERUP
(function () {
    "use strict";

    this.checkPowerup = function () {
        if (this.enoughPointsForPowerup() && BLX.level.blocksInLevel > 0) {
            BLX.applyPowerupToBlock();
            BLX.setNextPointsForPowerup();
        }
    };

    this.setNextPointsForPowerup = function () {
        if (BLX.pointsForNextPowerup.length > 1) {
            BLX.pointsForNextPowerup.pop();
        } else {
            BLX.pointsForNextPowerup[0] += BLX.initialPointsForNextPowerup[0];
        }
    };

    this.enoughPointsForPowerup = function () {
        return BLX.points >= BLX.pointsForNextPowerup[BLX.pointsForNextPowerup.length - 1];
    };

    this.applyPowerupToBlock = function () {
        var targetBlock = BLX.chooseRandomActiveBlock();
        targetBlock.isInPowerupMode = true;
        targetBlock.appliedPowerup = new Powerup(targetBlock, BLX.ball);
    };

    this.chooseRandomActiveBlock = function () {
        var block,
            row,
            col,
            maxRow = BLX.level.blocks.length - 1,
            maxCol = BLX.level.blocks[0].length - 1,
            startRow = BLX.getRandomNumber(maxRow),
            startCol = BLX.getRandomNumber(maxCol);

        console.log('startRow: ' + startRow + ', startCol: ' + startCol);
        for (row = startRow; true; row += 0) {
            for (col = startCol; true; row += 0) {
                block = BLX.level.blocks[row][col];
                if (block.isAlive() && !block.isInPowerupMode) {
                    return block;
                }
                col += 1;
                col = col % maxCol;
                if (col === startCol) {
                    break;
                };
            }
            row += 1;
            row = row % maxRow;
            console.log('row: ' + row + ', col: ' + col);
        }

        return BLX.level.blocks[row][col];
    };

    this.getRandomNumber = function (max) {
        return Math.floor(Math.random() * max);
    };

    this.addBonusLife = function (lives) {
        BLX.lives += lives;
        var n;
        for (n = 0; n < lives; n += 1) {
            BLX.lives += 1;
            if (BLX.lives > BLX.maxLives) {
                BLX.maxLives += 1;
            }
        };
    };

}.call(BLX.prototype));



