var UI = function () {
    "use strict";
    return this;
};

(function () {
    "use strict";

    this.setupUIBar = function (level, points, lives, uiLiveIcon, uiLiveLostIcon) {
        this.domLevel = level;
        this.domPoints = points;
        this.domLives = lives;
        this.iconLive = uiLiveIcon;
        this.iconLostLive = uiLiveLostIcon;
    };

    this.setupAlerts = function (domGamePaused, domLevelCleared, domClearedLevel, domGameOver, countdown) {
        this.domGamePaused = domGamePaused;
        this.domLevelCleared = domLevelCleared;
        this.domClearedLevel = domClearedLevel;
        this.domGameOver = domGameOver;
        this.domCountdown = countdown;
    };

    this.setup = function (canvas, level, points, lives, maxLives) {
        this.update(level, points, lives, maxLives);
        this.canvas = canvas;
    };

    this.update = function (level, points, lives, maxLives) {
        this.domLevel.innerText = level + 1;
        this.domPoints.innerText = points;
        this.domLives.innerHTML = this.concatLiveIcons(lives, maxLives);
    };

    this.concatLiveIcons = function (lives, maxLives) {
        var n,
            liveIcons = '';

        for (n = 1; n <= maxLives; n += 1) {
            if (n <= lives) {
                liveIcons += this.iconLive;
            } else {
                liveIcons += this.iconLostLive;
            }
        }
        return liveIcons;
    };

    this.pauseGame = function (pause) {
        if (pause) {
            this.domGamePaused.removeAttribute('hidden');
        } else {
            this.domGamePaused.setAttribute('hidden', 'hidden');
        }
    };

    this.showLevelCleared = function (show, level) {
        if (show) {
            this.domClearedLevel.innerText = level + 1;
            this.domLevelCleared.removeAttribute('hidden');
            this.hideMouseOnCanvas(false);
        } else {
            this.domLevelCleared.setAttribute('hidden', 'hidden');
            this.hideMouseOnCanvas(true);
        }
    };

    this.showGameOver = function (show) {
        if (show) {
            this.domGameOver.removeAttribute('hidden');
            this.hideMouseOnCanvas(false);
        } else {
            this.domGameOver.setAttribute('hidden', 'hidden');
            this.hideMouseOnCanvas(true);
        }
    };

    this.showCountdown = function (count) {
        if (count <= 0) {
            this.domCountdown.setAttribute('hidden', 'hidden');
        } else {
            this.domCountdown.innerText = count;
            this.domCountdown.removeAttribute('hidden', null);
        }
    };

    this.hideMouseOnCanvas = function (hide) {
        if (hide) {
            this.canvas.setAttribute('class', 'hideMouse');
        } else {
            this.canvas.removeAttribute('class');
        }
    }

}.call(UI.prototype));


