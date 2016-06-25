function UI() {

    "use strict";

    var uiLevel,
        uiPoints,
        uiLives,
        iconLive,
        iconLostLive;

    return this;

}

UI.prototype = {

    init: function (level, points, lives, uiLiveIcon, uiLiveLostIcon) {
        "use strict";
        this.uiLevel = level;
        this.uiPoints = points;
        this.uiLives = lives;
        this.iconLive = uiLiveIcon;
        this.iconLostLive = uiLiveLostIcon;
    },

    update: function (level, points, lives, maxLives) {
        "use strict";
        this.uiLevel.innerText = level;
        this.uiPoints.innerText = points;
        this.clearNode(this.uiLives);
        this.uiLives.innerHTML = this.concatLiveIcons(lives, maxLives);
    },

    concatLiveIcons: function (lives, maxLives) {
        "use strict";
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
    },

    clearNode: function (parentNode) {
        "use strict";
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
    }
};


