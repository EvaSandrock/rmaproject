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

        if (this.ballHitsBottomEdge() && !this.ball.paddleCollision) {
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
        return this.paddle.x - this.ball.radius * 0.3;
    };

    this.getPaddleRightEdge = function () {
        return this.paddle.x + this.paddle.width + this.ball.radius * 0.3;
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

        for (row = 0; row < rows; row += 1) {
            for (col = 0; col < columns; col += 1) {

                block = blocks[row][col];
                if (block.isAlive() && this.checkBlockCollision(block)) {
                    if (!block.isAlive()) {
                        this.ball.pointsForOneMove += block.pointsForBlock;
                    }
                    this.ball.yDirectionPositive ^= true;
                    this.ball.updateNextPosition();
                }

            }
        }
    };

    this.checkBlockCollision = function (block) {

        var blockLeft = block.x - this.ball.radius,
            blockRight = block.x + block.width + this.ball.radius,
            blockTop = block.y - this.ball.radius,
            blockBottom = block.y + block.height + this.ball.radius;

        if (
            this.ball.nextPositionX > blockLeft &&
                this.ball.nextPositionX < blockRight &&
                this.ball.nextPositionY > blockTop &&
                this.ball.nextPositionY < blockBottom
        ) {
            this.sound.playBlockSound(block.durability);
            block.durability -= 1;
            return true;
        }

        return false;
    };


}.call(Collision.prototype));
