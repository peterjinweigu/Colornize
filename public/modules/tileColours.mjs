export class TileColour {
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

export const tileColours = [
    // gray
    new TileColour('blue', '#999999', '#b3b3b3', '#4d4d4d', '#666666'),
    // blue
    new TileColour('blue', '#74c2ff', '#aadcff', "#478eff", "#5e9af4"),
    // red
    new TileColour('blue', '#f14545', '#f46868', "#95003d", "#b4003d"),
    // etc
]