class TileColour {
    strokeColour;
    fillColour;
    selectColour;
    leftShadow;
    rightShadow;
    constructor(strokeColour, fillColour, selectColour, leftShadow, rightShadow) {
        this.strokeColour = strokeColour;
        this.fillColour = fillColour;
        this.selectColour = selectColour;
        this.leftShadow = leftShadow;
        this.rightShadow = rightShadow;
    }
}

const tileColours = [
    // gray
    // blue
    new TileColour('blue', '#74c2ff', '#aadcff', "#478eff", "#5e9af4"),
    // red
    // etc
]

module.exports = tileColours;