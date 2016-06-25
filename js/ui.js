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

    this.init = function (level, points, lives, uiLiveIcon, uiLiveLostIcon) {
        this.uiLevel = level;
        this.uiPoints = points;
        this.uiLives = lives;
        this.iconLive = uiLiveIcon;
        this.iconLostLive = uiLiveLostIcon;
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


}.call(UI.prototype));


