(function (global) {
    var ScoresViewModel,
        app = global.app = global.app || {};

    ScoresViewModel = kendo.data.ObservableObject.extend({
        scoresArray: [],
        storageKey: "game15-scores",
        addScore: function (jsonScoreInfo) {
            var that = this;

            that.scoresArray.push(jsonScoreInfo);

            var arr = [];
            for (var i = 0; i < that.scoresArray.length; i++) {
                arr[i] = that.scoresArray[i];
            }
            arr.sort(function (a, b) { return b.score - a.score; });

            while (arr.length > 20) {
                that.scoresArray.pop();
            }

            that.set("scoresArray", arr);
            this.setScoresInStorage();
        },
        setScoresInStorage: function () {
            if (!global.localStorage) {
                return;
            }

            var that = this;

            var json = JSON.stringify(that.scoresArray);
            global.localStorage.setItem(that.storageKey, json);
        },
        getScoresFromStorage: function () {
            if (!global.localStorage) {
                return;
            }

            var that = this;

            var scores = [];

            var value = global.localStorage.getItem(that.storageKey);
            if (value) {
                scores = JSON.parse(value);
                if (!(scores instanceof Array)) {
                    scores = [];
                }
            }

            that.set("scoresArray", scores);
        }
    });

    var scoresVM = new ScoresViewModel();

    function initScores() {
        scoresVM.getScoresFromStorage();
    };

    app.scoreService = {
        viewModel: scoresVM,
        initScores: initScores
    };
})(window);
