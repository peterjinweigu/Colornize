class Tile {
    // temporary stuff
    static tileLife = 200;
    static tileSize = 60; // client side


    colour;
    life;
    active;

    constructor(colour) {
        this.colour = colour;
        this.active = true;
        this.life = Tile.tileLife;
    }

    resetLife(col) {
        this.active = true;
        this.life = Tile.tileLife;
        this.colour = col;
    }

    update(cnt) {
        if (!this.active && this.life > 0) this.life -= cnt;
    }
}

module.exports = Tile