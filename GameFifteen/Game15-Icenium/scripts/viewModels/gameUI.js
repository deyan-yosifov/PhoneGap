(function (global) {
    var GameViewModel,
        app = global.app = global.app || {},
        cellsCount = 15;   

    GameViewModel = kendo.data.ObservableObject.extend({
        width: 200,
        height: 200,
        cellWidth: 50,
        cellHeight: 50,
        cellBorder: 0,
        cellOffset: 0,
        game: new Game15(0),
        showNumbers: true,
        areNumbersWhite: true,
        showBorders: true,

        showPicture: false,
        img: "",

        sizePercent: 0.618,

        isGameOver: true,
        isGameOn: false,
        difficulty: 100,
        moves: 0,
        scrambleButtonText: "Start new game!",

        setShowBorders: function(value){
            this.showBorders = value;
            this.onResize();
        },

        setAreNumbersWhite: function(value){
            this.areNumbersWhite = value;
            this.onResize();
        },

        setShowNumbers: function(value){
            this.showNumbers = value;
            this.onResize();
        },

        setShowPicture: function (imageInfoJson) {
            this.showPicture = imageInfoJson.showImg;
            this.img = imageInfoJson.src;

            if (this.showPicture && this.img) {
                this.width = imageInfoJson.width;
                this.height = imageInfoJson.height;
            }
            else {
                this.width = 200;
                this.height = 200;
            }

            this.fitToSize(global.innerWidth, global.innerHeight);
        },

        setDifficulty: function(value){
            this.set("difficulty", value);
            this.newGameCommand();
        },

        fitToSize: function(screenWidth, screenHeight){
            var that = this;

            var container = document.getElementById("game-container");
            container.setAttribute("style",
                "width:" + screenWidth + "px;" +
                "height:" + screenHeight + "px;"
                );

            var fieldMaxWidth = screenWidth * that.sizePercent;
            var fieldMaxHeight = screenHeight * that.sizePercent;

            var scaleFactor = (fieldMaxWidth / that.width) * that.height <= fieldMaxHeight
            ? (fieldMaxWidth / that.width)
            : (fieldMaxHeight / that.height);
                     
            that.scale(scaleFactor);
        },

        scale: function(scaleFactor){
            var that = this;

            that.setWidthHeight(scaleFactor * that.width, scaleFactor * that.height);
        },

        onResize: function(){
            var that = this;

            var field = document.getElementById("game-field");

            var style = 
                "width:" + that.width + "px;" +
                "font-size:" + (that.showNumbers ? that.cellHeight * 0.5 : 0) + "px;" +
                "height:" + that.height + "px;";

            if (!that.areNumbersWhite) {
                style += "color: black;"
            }

            field.setAttribute("style", style);
            
            for (var i = 1; i <= cellsCount; i++) {
                that.moveCell(i);
            }
        },

        moveCell: function(i){
            var that = this;

            var solvedRowColumn = that.game.solvedRowColumn(i);
            var currentRowColumn = that.game.find(i);

            var cell = document.getElementById("game-cell" + i);

            var style = 
            "width:" + that.cellWidth + "px;" +
            "height:" + that.cellHeight + "px;" +
            "line-height:" + that.cellHeight + "px;" +
            "left:" + that.calculateXOffset(currentRowColumn.c) + "px;" +
            "top:" + that.calculateYOffset(currentRowColumn.r) + "px;";

            if (that.showBorders) {
                style += "border:" + that.cellBorder + "px solid black;";
            }

            if (that.showPicture && that.img) {
                style +=                     
                "background-size:" + that.width + "px " + that.height + "px;" +
                "background-position:" + (-that.calculateXOffset(solvedRowColumn.c)) + "px " + (-that.calculateYOffset(solvedRowColumn.r)) + "px;" +
                "background-image:url('" + that.img + "');"
                ;
            }

            cell.setAttribute("style", style);
        },

        calculateYOffset: function(row){
            return row * (this.cellHeight + this.cellOffset);
        },

        calculateXOffset: function (column) {
            return column * (this.cellWidth + this.cellOffset);
        },

        setWidthHeight: function(w, h){
            var that = this;

            that.width = w;
            that.height = h;
            that.cellOffset = Math.min(w, h) / 100;
            that.cellBorder = that.cellOffset * 1.5;

            if (that.showPicture && that.img) {
                that.cellOffset = 0;
            }

            that.cellWidth = (w - 3 * that.cellOffset) / 4;
            that.cellHeight = (h - 3 * that.cellOffset) / 4;

            that.onResize();
        },

        onGameSolved: function () {
            var that = this;

            that.set("isGameOver", true);
            that.set("isGameOn", false);

            var msg = 'Solved difficulty '
                + that.difficulty + ' with ' + that.moves + ' moves!';

            navigator.notification.vibrate(2500);
            navigator.notification.beep(3);


            navigator.notification.confirm(
                msg,  // message
                function (buttonIndex) {
                    if (buttonIndex == 1) {
                        var name = prompt("Input name: ", "Unknown");
                        if (name == null) {
                            return;
                        }

                        app.scoreService.viewModel.addScore({
                            name: name,
                            moves: that.moves,
                            difficulty: that.difficulty,
                            score: (that.difficulty / that.moves)
                        });
                    }

                    that.set("moves", 0);
                    that.set("scrambleButtonText", "Start new game!");                    
                },// callback to invoke with index of button pressed
                'Victory!',// title
                ' Save score , Cancel '// buttonLabels
            );            
        },

        onGameStart: function () {
            var that = this;

            that.set("isGameOver", false);
            that.set("isGameOn", true);
            that.set("moves", 0);
            that.set("scrambleButtonText", "Scramble field");

            that.onResize();
        },

        newGameCommand: function () {
            var that = this;            

            that.game = new Game15(that.difficulty);
            while (that.game.isSolved()) {
                that.game = new Game15(that.difficulty);
            }
            that.onGameStart();
        },

        playMove: function (e) {
            var self = this;
            var cellNumberValue = parseInt(e.target.innerHTML);

            if (!isNaN(cellNumberValue)) {
                if (cellNumberValue > 0 && cellNumberValue < 16) {
                    var nextZeroAndNumberCellPosition = self.game.move(cellNumberValue);

                    if (nextZeroAndNumberCellPosition) {
                        self.moveCell(cellNumberValue);

                        if (self.difficulty > 0 && self.isGameOn) {
                            self.set("moves", self.moves + 1);
                        }

                        if (self.game.isSolved() && self.difficulty > 0 && self.isGameOn) {
                            self.onGameSolved();
                        }
                    }
                }
            }
        }
    });


    var gameVM = new GameViewModel();

    function initGameField() {
        var field = document.getElementById("game-field");

        var inner = "";
        for (var i = 1; i <= cellsCount; i += 1) {
            inner += '<div class="game-cell" id="game-cell' + i + '">' + i + '</div>';
        }
        
        field.innerHTML = inner;

        gameVM.fitToSize(global.innerWidth, global.innerHeight);
    };

    app.gameService = {
        viewModel: gameVM,
        initField: initGameField
    };
})(window);