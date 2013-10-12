function Game15UI() {
    var self = this;
    var size = 4;

    this.difficulty = 0;
    this.moves = 0;

    this.writeLine = function (t) {
        document.write(t + "<br />");
    };

    this.id = function (id) {
        return document.getElementById(id);
    };

    this.setClass = function (id, className) {
        self.id(id).className = className;
    };

    this.setEmptyClass = function (i, j) {
        self.setClass("t" + i + j, "empty");
    };

    this.removeEmptyClass = function (i, j) {
        self.setClass("t" + i + j, "");
    };

    this.cellNumberValue = function (num) {
        return (num || "");
    };

    this.setInnerHtml = function (id, html) {
        self.id(id).innerHTML = html;
    };

    this.setDifficutyText = function (diff) {
        self.difficulty = diff;
        self.setInnerHtml("difficulty", "Game difficulty: " + self.difficulty);
    };

    this.setMovesText = function (m) {
        self.moves = m;
        self.setInnerHtml("moves", "Moves made: " + self.moves);
    };

    this.game = new Game15(0);

    this.setGame = function (difficulty) {
        self.game = new Game15(difficulty);

        while (self.game.isSolved()) {
            self.game = new Game15(difficulty);
        }

        self.setDifficutyText(difficulty);
        self.setMovesText(0);
    };

    this.setCellNumberValue = function (i, j, num) {
        self.setInnerHtml("t" + i + j, self.cellNumberValue(num));
    };

    this.onGameSolved = function () {
        var msg = "Congratulations! You have solved the puzzle with difficulty " + self.difficulty + " in " + self.moves + (self.moves == 1 ? " move!" : " moves!");
        alert(msg);
        self.setInnerHtml("winMsg", msg);
        self.setClass("winMsg", "");
        self.setDifficutyText(0);
        self.setMovesText(0);
    };

    this.drawUI = function (id) {
        var html = "";
        html += "<table>";

        for (var i = 0; i < size; i++) {
            html += "<tr>";

            for (var j = 0; j < size; j++) {
                html += "<td id='t" + i + j + "'>" + self.cellNumberValue(self.game.field[i][j]) + "</td>";
            }

            html += "</tr>";
        }

        html += "</table>";

        self.setInnerHtml(id, html);

        var zero = self.game.zero();
        self.setEmptyClass(zero.r, zero.c);
        self.setDifficutyText(self.difficulty);
        self.setMovesText(self.moves);
    };//end this.ui

    this.startNewGame = function (difficultyInput) {
        var difficulty = parseInt(difficultyInput);

        if (isNaN(difficulty) || difficulty < 1) {
            alert("Invalid input: " + difficultyInput + "! Try entering positive integer!");
            return false;
        }

        self.id('inp').value = "";
        self.setGame(difficulty);

        self.drawUI("game15");
        self.setInnerHtml("winMsg", "");
        self.setClass("winMsg", "hidden");

    };//end this.newGame

    this.playMove = function (clickedElement) {
        var cellNumberValue = parseInt(clickedElement.innerHTML);

        if (!isNaN(cellNumberValue)) {
            if (cellNumberValue > 0 && cellNumberValue < 16) {
                var nextZeroAndNumberCellPosition = self.game.move(cellNumberValue);

                if (nextZeroAndNumberCellPosition) {
                    self.setCellNumberValue(nextZeroAndNumberCellPosition.z.r, nextZeroAndNumberCellPosition.z.c, 0);
                    self.setCellNumberValue(nextZeroAndNumberCellPosition.n.r, nextZeroAndNumberCellPosition.n.c, cellNumberValue);

                    self.setEmptyClass(nextZeroAndNumberCellPosition.z.r, nextZeroAndNumberCellPosition.z.c);
                    self.removeEmptyClass(nextZeroAndNumberCellPosition.n.r, nextZeroAndNumberCellPosition.n.c);

                    if (self.difficulty > 0) {
                        self.setMovesText(self.moves + 1);
                    }

                    if (self.game.isSolved() && self.difficulty > 0) {
                        self.onGameSolved();
                    }
                }
            }
        }
    };//end this.play

};//End Game15UI