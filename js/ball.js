var Ball = function () {
    "use strict";
    return this;
};

(function () {
    "use strict";

    this.resetDirections = function () {

        this.xDirectionPositive = true;
        this.yDirectionPositive = false;
    };

    this.init = function (radius, speed, bottomEdge, rightEdge, collision) {

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
        this.collisionChecker = collision;
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
        this.collisionChecker.checkBorderCollision();
        this.updateNextPosition();
        this.collisionChecker.checkPaddleCollision();
        this.updateNextPosition();
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
        console.log('Ball: ' + this.x + ', Paddle: ' + center + ', Speed: ' + this.speedX);
        if ((this.x < center && this.speedX > 0) || (this.x > center && this.speedX < 0)) {
            this.speedX *= -1;
            console.log('Ball: ' + this.x + ', Paddle: ' + center + ', Speed: ' + this.speedX);
        }
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
