class TileColour {
    strokeColour;
    fillColour;
    selectColour;
    constructor(strokeColour, fillColour, selectColour) {
        this.strokeColour = strokeColour;
        this.fillColour = fillColour;
        this.selectColour = selectColour;
    }
}

const tileColours = [
    // gray
    // blue
    new TileColour('blue', '#74c2ff', '#aadcff'),
    // red
    // etc
]

module.exports = tileColours;