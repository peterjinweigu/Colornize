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

export class PlayerColour {
    strokeColour;
    fillColour;
    shadowColour;
    constructor(strokeColour, fillColour, shadowColour) {
        this.strokeColour = strokeColour;
        this.fillColour = fillColour;
        this.shadowColour = shadowColour;
    }
}

export const tileColours = [
    // gray
    new TileColour('blue', '#999999', '#b3b3b3', '#4d4d4d', '#666666'),
    // blue
    new TileColour('blue', '#3892ff', '#aadcff', "#4751ff", "#2974ff"),
    // red
    new TileColour('blue', '#f14545', '#f46868', "#95003d", "#b4003d"),
    // etc
]

export const playerColours = [
    // gray
    new PlayerColour("#515151", "#E1E1E1", "#A1A1A1"),
    // blue
    new PlayerColour("black", "#88d8ff", "#38b8ff"),
    // red
    new PlayerColour("black", "#ff8390", "#f96166"),
    // etc
]