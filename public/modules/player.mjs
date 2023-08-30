import {Coord, coord} from './coord.mjs';
import { playerColours } from './colours.mjs';

export class Player {
    pos;
    colour;
    constructor(x, y, colour) {
        this.pos = coord(x, y);
        this.colour = colour;
    }
    drawIsometric(ctx, offset) {
        let location = this.pos.toIsometric().add(offset);

        location.y -= 7.5;

        ctx.beginPath();
        ctx.ellipse(location.x, location.y, 15, 7.5, 0, Math.PI , 2 * Math.PI, true);
        ctx.lineTo(location.x + 15, location.y + 5);
        ctx.moveTo(location.x - 15, location.y + 5);
        ctx.ellipse(location.x, location.y + 5, 15, 7.5, 0, Math.PI , 2 * Math.PI, true);
        ctx.moveTo(location.x - 15, location.y + 5);
        ctx.lineTo(location.x - 15, location.y);
        ctx.closePath();

        ctx.lineWidth = 1;
        ctx.strokeStyle = playerColours[this.colour].strokeColour;
        ctx.fillStyle = playerColours[this.colour].shadowColour;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(location.x, location.y, 15, 7.5, Math.PI * 2, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fillStyle = playerColours[this.colour].fillColour;
        ctx.fill();
        ctx.stroke();
    }
}