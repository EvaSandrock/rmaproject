var Block,
    Levels;

var Level = function () {
    "use strict";

    this.columns = null;
    this.blockHeight = null;
    this.blockWidth = null;
    this.blockMargin = null;
    this.currentLevel = 0;
    this.levelList = new Levels();

    return this;
};

(function () {
    "use strict";

    this.init = function (
        columns,
        blockHeight,
        blockWidth,
        blockMargin
    ) {
        this.columns = columns;
        this.blockHeight = blockHeight;
        this.blockWidth = blockWidth;
        this.blockMargin = blockMargin;
    };

    this.random = function () {
        return Math.floor(Math.random() * 100) + 1;
    };

    this.selectBlockDurability = function (random) {
        var n;
        for (n = 0; n < this.levelList[this.currentLevel].durabilities.length; n += 1) {
            if (random < this.levelList[this.currentLevel].durabilities[n]) {
                return n;
            }
        }
        return 0;
    };

    this.setupBlocks = function () {

        var row, col;

        this.blocks = [];

        for (row = 0; row < this.levelList[this.currentLevel].rows; row += 1) {

            this.blocks[row] = [];

            for (col = 0; col < this.columns; col += 1) {

                this.blocks[row][col] = new Block(
                    this.getBlockX(col),
                    this.getBlockY(row),
                    this.blockWidth,
                    this.blockHeight,
                    this.selectBlockDurability(this.random())
                );
            }
        }
    };

    this.drawBlocks = function (ctx) {

        var row, col,
            currentBlock;

        for (row = 0; row < this.levelList[this.currentLevel].rows; row += 1) {
            for (col = 0; col < this.columns; col += 1) {

                currentBlock = this.blocks[row][col];
                if (currentBlock.isAlive()) {
                    currentBlock.draw(ctx);
                }
            }
        }
    };

    this.getBlockX = function (col) {
        return this.blockMargin + col * (this.blockWidth + this.blockMargin);
    };

    this.getBlockY = function (row) {
        return this.blockMargin + row * (this.blockHeight + this.blockMargin);
    };

    this.setCurrentLevel = function (level) {
        this.currentLevel = level;
    };


}.call(Level.prototype));
