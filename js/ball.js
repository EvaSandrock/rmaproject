/*jslint bitwise: true */

function Ball() {

    "use strict";

    var initialX,
        initialY,
        x,
        y,
        radius,
        speed,
        nextPositionX,
        nextPositionY,
        xDirectionPositive,
        yDirectionPositive;

    return this;
}

Ball.prototype = {

    resetDirections: function () {

        "use strict";

        this.xDirectionPositive = true;
        this.yDirectionPositive = false;

    },

    init: function (x, y, radius, speed) {

        "use strict";

        this.resetDirections();

        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;

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

    startNextMove: function (canvasWidth, canvasHeight, paddle) {

        "use strict";

        this.checkBorderCollision(canvasWidth);
        this.checkPaddleCollision(canvasHeight, paddle);
        this.updateNextPosition();
    },

    checkBorderCollision: function (canvasWidth) {

        "use strict";

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

        "use strict";

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

        "use strict";

        var bottomEdge = canvasHeight - paddle.height - this.radius;

        if (this.nextPositionY > bottomEdge && !this.checkPaddleCollision) {

            return true;
        }

        return false;
    },

    setBallToNextPosition: function () {

        "use strict";

        this.x = this.nextPositionX;
        this.y = this.nextPositionY;
    },

    reset: function (speed) {

        "use strict";

        this.x = this.initialX;
        this.y = this.initialY;
        this.speed = speed;
        this.resetDirections();
        this.updateNextPosition();
        this.setBallToNextPosition();
    },

    updateNextPosition: function () {

        "use strict";

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
