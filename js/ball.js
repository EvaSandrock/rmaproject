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
        this.frameSpeed = 1;
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

        this.paddleCollision = false;
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
            distance = Math.abs(this.nextPositionX - center);

        this.speedX = (this.speed * 2) * (distance / half);

        if (this.ballHitsPaddleLeft(center)) {
            this.xDirectionPositive = false;
        } else {
            this.xDirectionPositive = true;
        }
    };

    this.ballHitsPaddleLeft = function (paddleCenter) {
        return this.nextPositionX < paddleCenter;
    };

    this.reset = function (speed) {

        this.frameSpeed = 1;
        this.x = this.initialX;
        this.y = this.initialY;
        this.speed = speed;
        this.speedX = this.speed;
        this.resetDirections();
        this.updateNextPosition();
    };

    this.updateNextPosition = function () {

        if (this.xDirectionPositive) {
            this.nextPositionX = this.x + this.speedX * this.frameSpeed;
        } else {
            this.nextPositionX = this.x - this.speedX * this.frameSpeed;
        }

        if (this.yDirectionPositive) {
            this.nextPositionY = this.y + this.speed * this.frameSpeed;
        } else {
            this.nextPositionY = this.y - this.speed * this.frameSpeed;
        }
    };

}.call(Ball.prototype));
