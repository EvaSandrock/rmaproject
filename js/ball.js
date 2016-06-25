/*jslint bitwise: true */

var Ball = function () {
    "use strict";

    var initialX,
        initialY,
        x,
        y,
        radius,
        speed,
        speedX,
        nextPositionX,
        nextPositionY,
        xDirectionPositive,
        yDirectionPositive,
        bottomEdge,
        rightEdge,
        paddleCollision = false;

    return this;
};

(function () {
    "use strict";

    this.resetDirections = function () {

        this.xDirectionPositive = true;
        this.yDirectionPositive = false;
    };

    this.init = function (radius, speed, bottomEdge, rightEdge) {

        this.resetDirections();
        this.initialX = rightEdge / 2;
        this.initialY = bottomEdge - radius;
        this.x = this.initialX;
        this.y = this.initialY;
        this.radius = radius;
        this.speed = speed;
        this.speedX = this.speed;
        this.bottomEdge = bottomEdge;
        this.rightEdge = rightEdge - this.radius;
        this.pointsForOneMove = 0;
    };

    this.draw = function (ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#263238';
        ctx.fill();
        ctx.closePath();
        this.updateNextPosition();
    };

    this.startNextMove = function (paddle) {

        this.pointsForOneMove = 0;
        this.checkBorderCollision();
        this.updateNextPosition();
        this.checkPaddleCollision(paddle);
        this.updateNextPosition();
    };

    this.checkBorderCollision = function () {

        if (this.nextPositionX < this.radius || this.nextPositionX > this.rightEdge) {
            this.xDirectionPositive ^= true;
        }

        if (this.nextPositionY < this.radius) {
            this.yDirectionPositive ^= true;
        }
    };

    this.checkPaddleCollision = function (paddle) {

        var paddleLeft = paddle.x - this.radius * 0.3,
            paddleRight = paddle.x + paddle.width + this.radius * 0.3;

        if (this.nextPositionY > this.bottomEdge - this.radius) {

            if (this.nextPositionX > paddleLeft && this.nextPositionX < paddleRight) {

                this.paddleCollision = true;
                this.yDirectionPositive ^= true;
                this.calculateSpeedX(paddleLeft, paddleRight);
                this.updateNextPosition();
            }
        } else {
            this.paddleCollision = false;
        }
    };

    this.iterateBlocksForCollisionCheck = function (rows, columns, blocks) {

        var row, col, block;

        for (row = 0; row < rows; row += 1) {
            for (col = 0; col < columns; col += 1) {

                block = blocks[row][col];
                if (block.isAlive() && this.checkBlockCollision(block)) {
                    if (!block.isAlive()) {
                        this.pointsForOneMove += block.pointsForBlock;
                    }
                    this.yDirectionPositive ^= true;
                    this.updateNextPosition();
                }

            }
        }
    };

    this.checkBlockCollision = function (block) {

        var blockLeft = block.x - this.radius,
            blockRight = block.x + block.width + this.radius,
            blockTop = block.y - this.radius,
            blockBottom = block.y + block.height + this.radius;

        if (
            this.nextPositionX > blockLeft &&
                this.nextPositionX < blockRight &&
                this.nextPositionY > blockTop &&
                this.nextPositionY < blockBottom
        ) {
            block.durability -= 1;
            return true;
        }

        return false;
    };

    this.checkDroppedBall = function () {

        if (this.nextPositionY > this.bottomEdge && !this.paddleCollision) {
            return true;
        }
        return false;
    };

    this.setBallToNextPosition = function () {

        this.x = this.nextPositionX;
        this.y = this.nextPositionY;
    };

    this.calculateSpeedX = function (paddleLeft, paddleRight) {

        var half = (paddleRight - paddleLeft) / 2,
            center = paddleLeft + half,
            distance = (this.nextPositionX - center);
        this.speedX = this.speed * (distance / 20);

    };

    this.reset = function (speed) {

        this.x = this.initialX;
        this.y = this.initialY;
        this.speed = speed;
        this.speedX = this.speed;
        this.resetDirections();
        this.updateNextPosition();
        this.setBallToNextPosition();
    };

    this.updateNextPosition = function () {

        if (this.xDirectionPositive) {
            this.nextPositionX = this.x + this.speedX;
        } else {
            this.nextPositionX = this.x - this.speedX;
        }

        if (this.yDirectionPositive) {
            this.nextPositionY = this.y + this.speed;
        } else {
            this.nextPositionY = this.y - this.speed;
        }
    };

}.call(Ball.prototype));
