var UI = function () {
    "use strict";

    var uiLevel,
        uiPoints,
        uiLives,
        iconLive,
        iconLostLive;

    return this;

};

(function () {
    "use strict";

    this.init = function (level, points, lives, uiLiveIcon, uiLiveLostIcon, domGamePaused, domLevelCleared, domGameOver) {
        this.uiLevel = level;
        this.uiPoints = points;
        this.uiLives = lives;
        this.iconLive = uiLiveIcon;
        this.iconLostLive = uiLiveLostIcon;
        this.domGamePaused = domGamePaused;
        this.domLevelCleared = domLevelCleared;
        this.domGameOver = domGameOver;
    };

    this.update = function (level, points, lives, maxLives) {
        this.uiLevel.innerText = level + 1;
        this.uiPoints.innerText = points;
        this.clearNode(this.uiLives);
        this.uiLives.innerHTML = this.concatLiveIcons(lives, maxLives);
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

    this.clearNode = function (parentNode) {
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    };
    
    this.pauseGame = function (pause) {
        if (pause) {
            this.domGamePaused.removeAttribute('hidden', null);
        } else {
            this.domGamePaused.setAttribute('hidden', 'hidden');
        }
    };
    
    this.showLevelCleared = function (show) {
        if (show) {
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


}.call(UI.prototype));


