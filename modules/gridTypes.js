const Grid = require('./grid')
const assert = require('assert');

class GridType {
    size;
    grid;
    constructor(grid) {
        this.size = grid.length;
        this.grid = grid;
        for (let i = 0; i < this.size; i++) {
            assert(grid[i].length == this.size);
        }
    }
}

// 0 = neutral, [1-9] = colour
const twoPlayerDiagonal5 = new GridType(
    [
        [0, 2, 2, 2, 2],
        [1, 0, 2, 2, 2],
        [1, 1, 0, 2, 2],
        [1, 1, 1, 0, 2],
        [1, 1, 1, 1, 0],
    ]
);

module.exports = [
    twoPlayerDiagonal5,
]