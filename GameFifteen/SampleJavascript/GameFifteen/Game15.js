function Game15(difficulty) {
    this.field = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
    ];

    var size = 4;

    var self = this;

    this.cellNumber = function (rowColumn) {
        var r = rowColumn.r;
        var c = rowColumn.c;
        if (r < 0 || c < 0 || r >= size || c >= size) {
            return NaN;
        }
        return ((c % size + r * size) + 1) % (size * size);
    };//end this.num

    this.isSolved = function () {
        for (var i = 0; i < size; i++)
            for (var j = 0; j < size; j++) {
                if (self.cellNumber({ r: i, c: j }) != self.field[i][j])
                    return false;
            }
        return true;
    };//end this.isSolved

    this.find = function (n) {
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (n == self.field[i][j])
                    return { r: i, c: j };
            }
        }
        return false;
    };//end this.find

    this.zero = function () {
        return self.find(0);
    };//end this.zero

    this.move = function (numberInCell) {
        var oldZero = self.zero();
        var oldNumberCell = self.find(numberInCell);
        if (!oldNumberCell || !oldZero) return false;

        var difference = Math.abs(oldNumberCell.r - oldZero.r) + Math.abs(oldNumberCell.c - oldZero.c);
        if (difference != 1) return false;

        self.field[oldZero.r][oldZero.c] = self.field[oldNumberCell.r][oldNumberCell.c];
        self.field[oldNumberCell.r][oldNumberCell.c] = 0;
        return { z: oldNumberCell, n: oldZero };
    };//end this.move

    this.getZeroAndCo = function () {
        var cellIndexes = [];
        var z = self.zero();
        cellIndexes.push(z);
        if (z.r + 1 < size) cellIndexes.push({ r: z.r + 1, c: z.c });
        if (z.c + 1 < size) cellIndexes.push({ r: z.r, c: z.c + 1 });
        if (z.r - 1 >= 0) cellIndexes.push({ r: z.r - 1, c: z.c });
        if (z.c - 1 >= 0) cellIndexes.push({ r: z.r, c: z.c - 1 });

        return cellIndexes;
    };

    this.randMove = function () {
        var zeroAndNeighbours = self.getZeroAndCo();
        var max = zeroAndNeighbours.length - 1;
        var i = (parseInt(Math.random() * max)) + 1;
        var zero = zeroAndNeighbours[0];
        var neighbourToMove = zeroAndNeighbours[i];
        self.field[zero.r][zero.c] = self.field[neighbourToMove.r][neighbourToMove.c];
        self.field[neighbourToMove.r][neighbourToMove.c] = 0;
    };

    for (var c = 0; c < difficulty; c++) {
        this.randMove();
    }

};//End Game15