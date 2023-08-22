class GridType {
    size;
    grid;
    constructor(size, grid) {
        this.size = size;
        this.grid = grid;
    }
}

// 0 = neutral, [1-9] = colour
const twoPlayerDiagonal5 = new GridType(
    5,
    [
        [0, 2, 2, 2, 2],
        [1, 0, 2, 2, 2],
        [1, 1, 0, 2, 2],
        [1, 1, 1, 0, 2],
        [1, 1, 1, 1, 0],
    ]
);

module.exports = {
    twoPlayerDiagonal5,
}