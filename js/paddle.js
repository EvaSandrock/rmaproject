function Paddle(width, height, x, y, speed) {

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = speed;

    this.rightArrowPressed = false;
    this.leftArrowPressed = false;

}

Paddle.prototype = {

    draw: function(ctx) {

        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.closePath();

    },

    updatePosition: function(canvasWidth) {

        if(this.rightArrowPressed && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        }
        else if(this.leftArrowPressed && this.x > 0) {
            this.x -= this.speed;
        }

    }

}
