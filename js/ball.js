/*jslint bitwise: true */
"use strict";

function Ball() {

    var initialX,
        initialY,
        x,
        y,
        radius,
        speed,
        nextPositionX,
        nextPositionY;

    this.xDirectionPositive = true;
    this.yDirectionPositive = false;

    return this;
}

Ball.prototype = {

    init: function (x, y, radius, speed) {

        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;

    },

    draw: function (ctx) {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
        this.updateNextPosition();

    },

    startNextMove: function (canvasWidth, canvasHeight, paddle) {

        this.checkBorderCollision(canvasWidth);
        this.checkPaddleCollision(canvasHeight, paddle);
        this.updateNextPosition();
    },

    checkBorderCollision: function (canvasWidth) {

        var rightEdge = canvasWidth - this.radius;

        if (this.nextPositionX < this.radius || this.nextPositionX > rightEdge) {

            this.xDirectionPositive ^= true;
            this.updateNextPosition();
        }

        if (this.nextPositionY < this.radius) {

            this.yDirectionPositive ^= true;
            this.updateNextPosition();
        }

    },

    checkPaddleCollision: function (canvasHeight, paddle) {

        var bottomEdge = canvasHeight - paddle.height - this.radius,
            paddleLeft = paddle.x - this.radius,
            paddleRight = paddle.x + paddle.width - this.radius;

        if (this.nextPositionY > bottomEdge) {

            if (this.nextPositionX > paddleLeft && this.nextPositionX < paddleRight) {

                this.yDirectionPositive ^= true;
                this.updateNextPosition();
                return true;
            }
        }

        this.updateNextPosition();
        return false;
    },

    checkDroppedBall: function (canvasHeight, paddle) {

        var bottomEdge = canvasHeight - paddle.height - this.radius;

        if (this.nextPositionY > bottomEdge && !this.checkPaddleCollision) {

            return true;

        } else {

            return false;
        }
    },

    setBallToNextPosition: function () {

        this.x = this.nextPositionX;
        this.y = this.nextPositionY;
    },

    reset: function (speed) {

        this.x = this.initialX;
        this.y = this.initialY;
        this.speed = speed;
        this.xDirectionPositive = true;
        this.yDirectionPositive = false;
        this.updateNextPosition();
    },

    updateNextPosition: function () {

        if (this.xDirectionPositive) {
            this.nextPositionX = this.x + this.speed;
        } else {
            this.nextPositionX = this.x - this.speed;
        }

        if (this.yDirectionPositive) {
            this.nextPositionY = this.y + this.speed;
        } else {
            this.nextPositionY = this.y - this.speed;
        }
    }
};
