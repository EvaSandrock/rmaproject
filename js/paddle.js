function Paddle() {

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

}

Paddle.prototype = {

    init: function (width, height, x, y, speed) {

        "use strict";

        this.width = width;
        this.height = height;
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.speed = speed;

    },

    draw: function (ctx) {

        "use strict";

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.closePath();

    },

    updatePosition: function (canvasWidth) {

        "use strict";

        if (this.rightArrowPressed && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        } else if (this.leftArrowPressed && this.x > 0) {
            this.x -= this.speed;
        }

    },

    reset: function (width, speed) {

        "use strict";

        this.width = width;
        this.speed = speed;
        this.x = this.initialX;
        this.y = this.initialY;

    }
};
