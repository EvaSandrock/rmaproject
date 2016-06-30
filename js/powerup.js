var Powerup = function (block, ball) {
    "use strict";

    this.block = block;
    this.ball = ball;
    this.block.appliedPowerup = this;
    this.initialTimer = 1800;
    this.timer = this.initialTimer;
    this.timerX = this.block.x + (this.block.width / 2);
    this.timerY = this.block.y + (this.block.height / 2);
    this.timerRadius = this.block.width / 2;
    this.timerStart = 1.5 * Math.PI;
    this.timerEnd = 1.5 * Math.PI;
    this.imgSize = this.block.width - 10;
    this.imgX = this.block.x + 9;
    this.imgY = this.block.y + 10;
    this.bonus = this.setBonus();
    this.bonusPoints = 50;

    return this;
};

(function () {
    "use strict";

    this.setBonus = function () {
        if (Math.random() < 0.5) {
            return 'points';
        } else {
            return 'life';
        }
    };

    this.draw = function (ctx) {
        this.drawTimer(ctx);
        if (this.bonus === 'points') {
            this.drawPoints(ctx);
        } else {
            this.drawLife(ctx);
        }
        this.timer -= this.ball.frameSpeed;
        if (this.timer <= 0) {
            this.removePowerupFromBlock();
        }
    };

    this.drawTimer = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(this.timerX, this.timerY);
        ctx.arc(this.timerX, this.timerY, this.timerRadius, this.timerStart, this.getTimerEnd(), true);
        ctx.lineTo(this.timerX, this.timerY);
        ctx.fillStyle = 'rgba(38, 50, 56, 0.8)';
        ctx.fill();
        ctx.closePath();
    };

    this.drawPoints = function (ctx) {
        ctx.drawImage(this.pointsImage, this.imgX - 1, this.imgY, this.imgSize, this.imgSize);
    };

    this.drawLife = function (ctx) {
        ctx.drawImage(this.lifeImage, this.imgX, this.imgY, this.imgSize, this.imgSize);
    };

    this.getTimerEnd = function () {
        var twelveOClockPoint = -90,
            convertTimerToDeg = 0.2,
            convertToRadian = Math.PI / 180;

        this.timerEnd = (twelveOClockPoint + ((this.initialTimer * convertTimerToDeg) - (this.timer * convertTimerToDeg))) * convertToRadian;
        return this.timerEnd;
    };

    this.removePowerupFromBlock = function () {
        this.block.appliedPowerup = null;
        this.block.isInPowerupMode = false;
    };

    this.pointsImage = new Image();
    this.pointsImage.src = 'img/diamond.svg';

    this.lifeImage = new Image();
    this.lifeImage.src = 'img/heart.svg';

}.call(Powerup.prototype));
