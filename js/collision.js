/*jslint bitwise: true */

var Collision = function () {
    "use strict";
    return this;
};

(function () {
    "use strict";

    this.init = function (rightEdge, bottomEdge, paddle, level, ball, sound) {

        this.rightEdge = rightEdge;
        this.bottomEdge = bottomEdge;
        this.paddle = paddle;
        this.level = level;
        this.ball = ball;
        this.sound = sound;
        this.ball.paddleCollision = false;
    };

    this.checkDroppedBall = function () {

        if (this.ballHitsBottomEdge() && !this.ballHitsPaddle()) {
            this.sound.playDroppedBallSound();
            return true;
        }
        return false;
    };

    this.checkBorderCollision = function () {

        if (this.ballHitsWall()) {
            this.sound.playWallSound();
            this.ball.xDirectionPositive ^= true;
        }
        if (this.ballHitsCeiling()) {
            this.sound.playWallSound();
            this.ball.yDirectionPositive ^= true;
        }
    };

    this.checkPaddleCollision = function () {

        if (this.ballHitsBottomEdge() && this.ballHitsPaddle()) {
            this.sound.playPaddleSound();
            this.turnBallAround();
            this.ball.paddleCollision = true;
        } else {
            this.ball.paddleCollision = false;
        }
    };

    this.ballHitsBottomEdge = function () {
        return this.ball.nextPositionY > this.bottomEdge - this.ball.radius;
    };

    this.ballHitsCeiling = function () {
        return this.ball.nextPositionY < this.ball.radius;
    };

    this.ballHitsWall = function () {
        return this.ball.nextPositionX < this.ball.radius || this.ball.nextPositionX > this.rightEdge;
    };

    this.ballHitsPaddle = function () {
        return this.ball.nextPositionX > this.getPaddleLeftEdge() && this.ball.nextPositionX < this.getPaddleRightEdge();
    };

    this.getPaddleLeftEdge = function () {
        return this.paddle.x - this.ball.radius * 0.5;
    };

    this.getPaddleRightEdge = function () {
        return this.paddle.x + this.paddle.width + this.ball.radius * 0.5;
    };

    this.turnBallAround = function () {
        this.ball.yDirectionPositive ^= true;
        this.ball.calculateSpeedX(this.getPaddleLeftEdge(), this.getPaddleRightEdge());
        this.ball.updateNextPosition();
    };

    this.iterateBlocksForCollisionCheck = function () {

        var blocks = this.level.blocks,
            rows = blocks.length,
            columns = blocks[0].length,
            row,
            col,
            block;

        if (this.ballIsBelowBottomRow()) {
            return;
        }

        for (row = 0; row < rows; row += 1) {
            for (col = 0; col < columns; col += 1) {

                block = blocks[row][col];
                if (block.isAlive() && this.checkBlockCollision(block)) {
                    if (!block.isAlive()) {
                        this.ball.pointsForOneMove += block.pointsForBlock;
                    }
                    if (this.collisionH) {
                        this.ball.yDirectionPositive ^= true;
                    } else if (this.collisionV) {
                        this.ball.xDirectionPositive ^= true;
                    }

                    this.ball.updateNextPosition();
                }
                this.collisionV = false;
                this.collisionH = false;
            }
        }
    };

    this.ballIsBelowBottomRow = function () {
        var blockInLastRow = this.level.blocks[this.level.blocks.length - 1][0],
            bottomRow = blockInLastRow.y + blockInLastRow.height;

        return this.ball.nextPositionY - this.ball.radius > bottomRow;
    };

    this.checkBlockCollision = function (block) {

        var blockLeft = block.x - this.ball.radius,
            blockRight = block.x + block.width + this.ball.radius,
            blockTop = block.y - this.ball.radius,
            blockBottom = block.y + block.height + this.ball.radius;

        this.collisionV = false;
        this.collisionH = false;

        if (
            this.ball.nextPositionX > blockLeft &&
                this.ball.nextPositionX < blockRight &&
                this.ball.nextPositionY > blockTop &&
                this.ball.nextPositionY < blockBottom
        ) {
            if (this.blockCollidedWithVerticalEdges(blockLeft, blockRight)) {
                this.collisionV = true;
            } else if (this.blockCollidedWithHorizontalEdges(blockTop, blockBottom)) {
                this.collisionH = true;
            }

            if (block.isInPowerupMode) {
                this.addPowerupBonus(block);
                block.appliedPowerup.removePowerupFromBlock();
                this.sound.playBonusSound();
            } else {
                this.sound.playBlockSound(block.durability);
            }
            block.durability -= 1;
            return true;
        }

        return false;
    };

    this.blockCollidedWithVerticalEdges = function (blockLeft, blockRight) {
        var collisionV = false;

        if (this.ball.x < blockLeft && this.ball.nextPositionX > blockLeft) {
            collisionV = true;
        }
        if (this.ball.x > blockRight && this.ball.nextPositionX < blockRight) {
            collisionV = true;
        }

        return collisionV;
    };

    this.blockCollidedWithHorizontalEdges = function (blockTop, blockBottom) {
        var collisionH = false;

        if (this.ball.y < blockTop && this.ball.nextPositionY > blockTop) {
            collisionH = true;
        }
        if (this.ball.y > blockBottom && this.ball.nextPositionY < blockBottom) {
            collisionH = true;
        }

        return collisionH;
    };

    this.addPowerupBonus = function (block) {
        if (block.appliedPowerup.bonus === 'life') {
            this.ball.bonusLifeForOneMove += 1;
        } else if (block.appliedPowerup.bonus === 'points') {
            this.ball.pointsForOneMove += block.appliedPowerup.bonusPoints;
        }
    };

}.call(Collision.prototype));
