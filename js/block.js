"use strict";

var Block = function () {

    return {

        draw: this.draw

    };

};

Block.prototype = {

    draw: function (ctx, x, y, color) {

        ctx.beginPath();
        ctx.rect(x, y, 80, 20);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();

    }

};
