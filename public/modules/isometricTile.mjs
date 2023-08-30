import { coord } from './coord.mjs';
import { drawPolygon } from './canvaTools.mjs';
import { tileColours } from './colours.mjs';

export class IsometricTile {
    // Constants
    static tileHeight = 25;
    static strokeWidth = 1;

    // temp stuff for inkjoy
    colour;
    active;

    // stuff from edison
    static animationStatus = {
        IDLE: 1,
        FALLING: 2,
    }

    row;
    col;
    size;
    gridSize;
    selected;
    depth;
    animationStatus;
    animationCounter;

    constructor(row, col, size, gridSize, colour) {
        this.row = row;
        this.col = col;
        this.size = size;
        this.gridSize = gridSize;
        this.selected = false;
        this.colour = colour;
        this.active = true;
        this.depth = 0;
        this.animationStatus = IsometricTile.animationStatus.IDLE;
        this.animationCounter = 0;
    }

    select() {  
        this.selected = true;
    }
    deselect() {
        this.selected = false;
    }
    draw(ctx, offset) {

        // handle animations

        if (this.animationStatus == IsometricTile.animationStatus.FALLING) {
            if (this.animationCounter == 50) {
                this.depth = 0;
                return;
            }
            this.depth = 50 * this.animationCounter / 50;
            ctx.globalAlpha = 1 - this.animationCounter / 50;
            this.animationCounter++;
        }

        // draw tile

        let r = this.row;
        let c = this.col;
        let sz = this.size;

        // vertical shift
        offset = offset.add(coord(0, this.depth));

        let c0 = coord(c*sz, r*sz).toIsometric().add(offset);
        let c1 = coord(c*sz+sz, r*sz).toIsometric().add(offset);
        let c2 = coord(c*sz+sz, r*sz+sz).toIsometric().add(offset);
        let c3 = coord(c*sz, r*sz+sz).toIsometric().add(offset);

        // console.log(this.gridSize);

        let strokeColour = tileColours[this.colour].strokeColour;
        let selectColour = tileColours[this.colour].selectColour;
        let fillColour = tileColours[this.colour].fillColour;

        if (this.selected) {
            drawPolygon(ctx, [c0, c1, c2, c3], IsometricTile.strokeWidth, strokeColour, selectColour);
        } else {
            drawPolygon(ctx, [c0, c1, c2, c3], IsometricTile.strokeWidth, strokeColour, fillColour); 
        }

        // Bottom edge tiles
        let height = coord(0, IsometricTile.tileHeight);
        let leftShadow = tileColours[this.colour].leftShadow;
        let rightShadow = tileColours[this.colour].rightShadow;
        // if (this.row == this.gridSize - 1) {
            drawPolygon(
                ctx,
                [c3, c2, c2.add(height), c3.add(height)],
                IsometricTile.strokeWidth,
                strokeColour,
                leftShadow
            );
        // }
        // if (this.col == this.gridSize - 1) {
            drawPolygon(
                ctx,
                [c2, c1, c1.add(height), c2.add(height)],
                IsometricTile.strokeWidth,
                strokeColour,
                rightShadow
            );
        // }

        ctx.globalAlpha = 1;
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