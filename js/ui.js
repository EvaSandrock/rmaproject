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
            this.domGamePaused.removeAttribute('hidden', null);
        } else {
            this.domGamePaused.setAttribute('hidden', 'hidden');
        }
    };

    this.showLevelCleared = function (show, level) {
        if (show) {
            this.domClearedLevel.innerText = level + 1;
            this.domLevelCleared.removeAttribute('hidden', null);
        } else {
            this.domLevelCleared.setAttribute('hidden', 'hidden');
        }
    };

    this.showGameOver = function (show) {
        if (show) {
            this.domGameOver.removeAttribute('hidden', null);
        } else {
            this.domGameOver.setAttribute('hidden', 'hidden');
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

    /*
    this.clearNode = function (parentNode) {
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    };
    */


}.call(UI.prototype));


