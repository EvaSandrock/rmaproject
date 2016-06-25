var Block = function () {
    "use strict";

    var durability,
        destroyed = false,
        colors = ['#03A9F4', '#3F51B5', '#9C27B0', '#E91E63', '#F57F17'];

    return this;

};

(function () {

    "use strict";

    this.draw = function (ctx, x, y) {

        ctx.beginPath();
        ctx.rect(x, y, 80, 20);
        ctx.fillStyle = this.colors[this.durability];
        ctx.fill();
        ctx.closePath();

    };

}.call(Block.prototype));
