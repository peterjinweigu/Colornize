import { coord } from './coord.mjs';
import { drawRect } from './canvaTools.mjs';

export class TopDownTile {
    // Constants
    static strokeWidth = 1;
    static strokeColour = 'blue';
    static fillColour = '#74c2ff';
    static selectColour = '#aadcff';

    constructor(row, col, size) {
        this.row = row;
        this.col = col;
        this.size = size;
        this.selected = false;
    }
    select() {  
        this.selected = true;
    }
    deselect() {
        this.selected = false;
    }
    draw(ctx, offset) {
        let location = coord(this.col * this.size, this.row * this.size).add(offset);
        if (this.selected) {
            drawRect(ctx, location.x, location.y, this.size, this.size, TopDownTile.strokeWidth, TopDownTile.strokeColour, TopDownTile.selectColour);
            return;
        }
        drawRect(ctx, location.x, location.y, this.size, this.size, TopDownTile.strokeWidth, TopDownTile.strokeColour, TopDownTile.fillColour);
    }
    drawText(ctx, offset) {
        let location = coord(this.col * this.size, this.row * this.size).add(offset);

        ctx.font = "20px Sans-Serif";
        ctx.fillStyle = 'black';
        ctx.fillText(`(${this.row},${this.col})`, location.x + this.size/2 - 20, location.y + this.size / 2 + 5);
    }
}