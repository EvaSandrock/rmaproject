var Block;

var Level = function () {
    "use strict";

    var columns,
        blockHeight,
        blockWidth,
        blockMargin,
        levelList = [],
        currentLevel = 0,
        blocks = [];

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
    };

    this.setUpBlocks = function () {
        this.blocks = [];
        var n, i;
        for (n = 0; n < this.levelList[this.currentLevel].rows; n += 1) {
            for (i = 0; i < this.columns; i += 1) {
                this.blocks.push(
                    new Block(
                        this.blockWidth,
                        this.blockHeight,
                        this.selectBlockDurability(this.random())
                    )
                );
            }
        }
    };

    this.setCurrentLevel = function (level) {
        this.currentLevel = level;
    };


}.call(Level.prototype));

/*


            {
                rows: 3,
                durabilities: [
                    100,
                    100,
                    100,
                    100,
                    100
                ],
                ballSpeed: 3,
                paddleWidth: 100
            },
            {
                rows: 3,
                durabilities: [
                    70,
                    100,
                    100,
                    100,
                    100
                ],
                ballSpeed: 4,
                paddleWidth: 95
            },
            {
                rows: 4,
                durabilities: [
                    50,
                    80,
                    100,
                    100,
                    100
                ],
                ballSpeed: 4,
                paddleWidth: 90
            }

*/
