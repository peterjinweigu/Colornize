const Grid = require('./grid')
const { Coord, coord } = require('./coord.js');
const assert = require('assert');

class GridType {
    size;
    grid;
    startPositions;
    constructor(grid, startPositions) {
        this.size = grid.length;
        this.grid = grid;
        for (let i = 0; i < this.size; i++) {
            assert(grid[i].length == this.size);
        }
        this.startPositions = startPositions;
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
    ],
    [
        coord(0, 4),
        coord(4, 0)
    ]
);

module.exports = [
    twoPlayerDiagonal5,
]