var Paddle = function () {
    "use strict";

    var width,
        height,
        initialX,
        initialY,
        x,
        y,
        speed,
        rightArrowPressed = false,
        leftArrowPressed = false;

    return this;

};

(function () {
    "use strict";

    this.init = function (width, height, x, y, speed) {
        this.width = width;
        this.height = height;
        this.initialX = x;
        this.initialY = y;
        this.x = this.initialX;
        this.y = this.initialY;
        this.speed = speed;
    };

    this.draw = function (ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#263238";
        ctx.fill();
        ctx.closePath();
    };

    this.updatePosition = function (canvasWidth) {
        if (this.rightArrowPressed && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        } else if (this.leftArrowPressed && this.x > 0) {
            this.x -= this.speed;
        }
    };

    this.reset = function (width, speed) {
        this.width = width;
        this.speed = speed;
        this.x = this.initialX;
        this.y = this.initialY;
    };

}.call(Paddle.prototype));
