const Grid = require('./grid')

// ||||||||||
// || NOTE ||  
// ||||||||||

// I will leave this here, but I am not sure if we really need it
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
    4,
    new Grid(4)
);

module.exports = {
    twoPlayerDiagonal5,
}