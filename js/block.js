var Block = function (x, y, width, height, durability) {
    "use strict";

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.durability = durability;
    this.pointsForBlock = (this.durability + 1) * (this.durability + 1);
    this.isInPowerupMode = false;

    return this;
};

(function () {
    "use strict";

    this.colors = [
        '#03A9F4',
        '#3F51B5',
        '#9C27B0',
        '#E91E63',
        '#F57F17'
    ];

    this.draw = function (ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.colors[this.durability];
        ctx.fill();
        ctx.closePath();
    };

    this.isAlive = function () {
        return this.durability >= 0;
    };

}.call(Block.prototype));
