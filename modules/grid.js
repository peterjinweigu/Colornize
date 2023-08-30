const Tile = require('./tile')

class Grid {
    grid;
    size;

    constructor(gridType) {
        this.size = gridType.size;
        this.grid = [];
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = new Tile(gridType.grid[i][j]);
            }
        }
    }

    // Method to update tiles
    updateGrid(cnt) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                // console.log(this.grid[i][j].life);
                this.grid[i][j].update(cnt);
            }
        }
    }
}

module.exports = Grid