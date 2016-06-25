var Block = function (width, height, durability) {
    "use strict";

    this.width = width;
    this.height = height;
    this.durability = durability;

    return this;

};

(function () {

    "use strict";

    var colors = [
            '#03A9F4',
            '#3F51B5',
            '#9C27B0',
            '#E91E63',
            '#F57F17'
        ];

    this.draw = function (ctx, x, y) {
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.fillStyle = this.colors[this.durability];
        ctx.fill();
        ctx.closePath();
    };

    this.wasDestroyed = function () {
        return this.durability < 0;
    };

}.call(Block.prototype));
