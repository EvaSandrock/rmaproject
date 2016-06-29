/*global Audio */

var Sound = function () {
    "use strict";

    this.wallSound = [
        new Audio('audio/packun_eating.mp3'),
        new Audio('audio/packun_eating.mp3'),
        new Audio('audio/packun_eating.mp3'),
        new Audio('audio/packun_eating.mp3'),
        new Audio('audio/packun_eating.mp3')
    ];

    this.paddleSound = new Audio('audio/poka02.mp3');
    this.droppedBallSound = new Audio('audio/powerdown07.mp3');

    this.blocksounds = [
        [
            new Audio('audio/button01a.mp3'),
            new Audio('audio/button01a.mp3'),
            new Audio('audio/button01a.mp3'),
            new Audio('audio/button01a.mp3'),
            new Audio('audio/button01a.mp3')
        ],
        [
            new Audio('audio/button02a.mp3'),
            new Audio('audio/button02a.mp3'),
            new Audio('audio/button02a.mp3'),
            new Audio('audio/button02a.mp3'),
            new Audio('audio/button02a.mp3')
        ],
        [
            new Audio('audio/button03a.mp3'),
            new Audio('audio/button03a.mp3'),
            new Audio('audio/button03a.mp3'),
            new Audio('audio/button03a.mp3'),
            new Audio('audio/button03a.mp3')
        ],
        [
            new Audio('audio/button04a.mp3'),
            new Audio('audio/button04a.mp3'),
            new Audio('audio/button04a.mp3'),
            new Audio('audio/button04a.mp3'),
            new Audio('audio/button04a.mp3')
        ],
        [
            new Audio('audio/button05.mp3'),
            new Audio('audio/button05.mp3'),
            new Audio('audio/button05.mp3'),
            new Audio('audio/button05.mp3'),
            new Audio('audio/button05.mp3')
        ]
    ];

    return this;
};

(function () {
    "use strict";
    this.num = 0;

    this.playWallSound = function () {
        this.wallSound[this.num].play();
        this.increaseNum();
    };

    this.playPaddleSound = function () {
        this.paddleSound.play();
    };

    this.playDroppedBallSound = function () {
        this.droppedBallSound.play();
    };

    this.playBlockSound = function (blockDuration) {
        this.blocksounds[blockDuration][this.num].play();
        this.increaseNum();
    };

    this.increaseNum = function () {
        this.num += 1;
        this.num = this.num % 5;
    };

}.call(Sound.prototype));
