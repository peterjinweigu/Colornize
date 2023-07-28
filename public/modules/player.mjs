import {Coord, coord} from './coord.mjs';

export class Player {
    static fillColour = "#E1E1E1";
    static strokeColour = "#515151";
    constructor(x, y) {
        this.pos = coord(x, y);
    }
    drawTopDown(ctx, offset) {
        let location = this.pos.add(offset);
        ctx.beginPath();
        ctx.arc(location.x, location.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = Player.strokeStyle;
        ctx.fillStyle = Player.fillColour;
        ctx.stroke();
        ctx.fill();
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
        ctx.strokeStyle = Player.strokeColour;
        ctx.fillStyle = "#A1A1A1";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(location.x, location.y, 15, 7.5, Math.PI * 2, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.fillStyle = Player.fillColour;
        ctx.fill();
        ctx.stroke();
    }
}