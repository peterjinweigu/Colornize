import { coord } from './coord.mjs';
import { drawPolygon } from './canvaTools.mjs';

export class IsometricTile {
    // Constants
    static tileHeight = 25;
    static strokeWidth = 1;
    static strokeColour = 'blue';
    static fillColour = '#74c2ff';
    static selectColour = '#aadcff';

    // down horrendus (testing)
    static colour1 = '#FF0000';
    static colour2 = '#0000FF';

    // temp stuff for inkjoy
    colour;
    active;

    constructor(row, col, size, gridSize, colour) {
        this.row = row;
        this.col = col;
        this.size = size;
        this.gridSize = gridSize;
        this.selected = false;
        this.colour = colour;
        this.active = true;
    }

    select() {  
        this.selected = true;
    }
    deselect() {
        this.selected = false;
    }
    draw(ctx, offset) {
        let r = this.row;
        let c = this.col;
        let sz = this.size;

        let c0 = coord(c*sz, r*sz).toIsometric().add(offset);
        let c1 = coord(c*sz+sz, r*sz).toIsometric().add(offset);
        let c2 = coord(c*sz+sz, r*sz+sz).toIsometric().add(offset);
        let c3 = coord(c*sz, r*sz+sz).toIsometric().add(offset);

        console.log(this.gridSize);

        if (this.selected) {
            drawPolygon(ctx, [c0, c1, c2, c3], IsometricTile.strokeWidth, IsometricTile.strokeColour, IsometricTile.selectColour);
        } else {
            // testing 
            if (this.colour == 0) {
                drawPolygon(ctx, [c0, c1, c2, c3], IsometricTile.strokeWidth, IsometricTile.strokeColour, IsometricTile.fillColour); 
            } else if (this.colour == 1) {
                drawPolygon(ctx, [c0, c1, c2, c3], IsometricTile.strokeWidth, IsometricTile.strokeColour, IsometricTile.colour1);
            } else if (this.colour == 2) {
                drawPolygon(ctx, [c0, c1, c2, c3], IsometricTile.strokeWidth, IsometricTile.strokeColour, IsometricTile.colour2);
            }
        }

        // Bottom edge tiles
        let height = coord(0, IsometricTile.tileHeight);
        if (this.row == this.gridSize - 1) {
            drawPolygon(
                ctx,
                [c3, c2, c2.add(height), c3.add(height)],
                IsometricTile.strokeWidth,
                IsometricTile.strokeColour,
                "#478eff"
            );
        }
        if (this.col == this.gridSize - 1) {
            drawPolygon(
                ctx,
                [c2, c1, c1.add(height), c2.add(height)],
                IsometricTile.strokeWidth,
                IsometricTile.strokeColour,
                "#5e9af4"
            );
        }
    }
    drawText(ctx, offset) {
        let r = this.row;
        let c = this.col;
        let sz = this.size;
        let c0 = coord(c*sz, r*sz).toIsometric().add(offset);

        ctx.font = "20px Sans-Serif";
        ctx.fillStyle = 'black';
        ctx.fillText(`(${this.row},${this.col})`, c0.x - 20, c0.y + this.size / 2 + 5);
    }

    // Obsolete
    // checkCollision(x, y, offset) {
    //     let r = this.row;
    //     let c = this.col;
    //     let sz = this.size;

    //     let c0 = coord(c*sz, r*sz).toIsometric().add(offset);
    //     let c1 = coord(c*sz+sz, r*sz).toIsometric().add(offset);
    //     let c2 = coord(c*sz+sz, r*sz+sz).toIsometric().add(offset);
    //     let c3 = coord(c*sz, r*sz+sz).toIsometric().add(offset);

    //     let xVert = [c0.x, c1.x, c2.x, c3.x];
    //     let yVert = [c0.y, c1.y, c2.y, c3.y];

    //     xVert.sort();
    //     yVert.sort();

    //     return (x >= xVert[0] && x <= xVert[3] && y >= yVert[0] && y <= yVert[3]);
        
    //     // return (c.x > lX && c.x < rX && c.y > uY && c.y < dY);
    // }
}