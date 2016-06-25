/*jslint bitwise: true */

function Ball() {
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
}

Ball.prototype = {

    resetDirections: function () {
        "use strict";
        this.xDirectionPositive = true;
        this.yDirectionPositive = false;

    },

    init: function (radius, speed, bottomEdge, rightEdge) {
        "use strict";
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

    },

    draw: function (ctx) {
        "use strict";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
        this.updateNextPosition();
    },

    startNextMove: function (paddle) {
        "use strict";
        this.checkBorderCollision();
        this.updateNextPosition();
        this.checkPaddleCollision(paddle);
        this.updateNextPosition();
    },

    checkBorderCollision: function () {
        "use strict";
        if (this.nextPositionX < this.radius || this.nextPositionX > this.rightEdge) {
            this.xDirectionPositive ^= true;
        }

        if (this.nextPositionY < this.radius) {
            this.yDirectionPositive ^= true;
        }
    },

    checkPaddleCollision: function (paddle) {
        "use strict";
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
    },

    checkDroppedBall: function () {
        "use strict";
        if (this.nextPositionY > this.bottomEdge && !this.paddleCollision) {
            return true;
        }
        return false;
    },

    setBallToNextPosition: function () {
        "use strict";
        this.x = this.nextPositionX;
        this.y = this.nextPositionY;
    },

    calculateSpeedX: function (paddleLeft, paddleRight) {
        "use strict";
        var half = (paddleRight - paddleLeft) / 2,
            center = paddleLeft + half,
            distance = (this.nextPositionX - center);
        this.speedX = this.speed * (distance / 20);

    },

    reset: function (speed) {
        "use strict";
        this.x = this.initialX;
        this.y = this.initialY;
        this.speed = speed;
        this.speedX = this.speed;
        this.resetDirections();
        this.updateNextPosition();
        this.setBallToNextPosition();
    },

    updateNextPosition: function () {
        "use strict";
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
    }
};
