const Tile = require('./tile')

class Grid {
    grid;
    size;

    constructor(size) {
        // idk wtf is going on anymore
        this.size = size;
        this.grid = [];

        for (let i = 0; i < size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < size; j++) {
                this.grid[i][j] = new Tile(1);
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