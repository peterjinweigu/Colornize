class Grid {
    grid;
    constructor(size) {
        this.grid = [];
        for (let i = 0; i < size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < size; j++) {
                this.grid[i][j] = new Tile();
            }
        }
    }
}

module.exports = Grid