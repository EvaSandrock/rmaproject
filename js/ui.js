"use strict";

function UI() {

    // this.pointsElem = document.getElementById('ui-bar__points').getElementsByTagName('span');
    // this.livesElem = document.getElementById('ui-bar__lives');

    this.liveIcon = '<i class="fa fa-heart"></i>';
    this.lostLiveIcon = '<i class="fa fa-heart-o"></i>';

}

/*

UI.prototype = {

    update: function (points, maxLives, lives) {

        this.pointsElem.innerHTML = points;

        var n;
        for (n = 0; n < maxLives; n += 1) {

            if (lives >= n) {
                this.livesElem.appendChild = this.liveIcon;
            } else {
                this.livesElem.appendChild = this.lostLiveIcon;
            }

        }

    },

    alert: {

        levelUp: function (level, points) {



        },

        gameOver: function (points) {



        }

    }

};

*/
