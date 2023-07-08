import {Coord, coord} from './coord.mjs';

export class Player {
    static fillColour = "#E1E1E1";
    static strokeColour = "#515151";
    constructor(x, y, speed) {
        this.speed = speed;
        this.pos = coord(x, y);
        this.vel = coord(0, 0);
        this.moveState = coord(0, 0);
    }
    moveRight() {
        this.moveState.x = Math.min(this.moveState.x + 1,  1);
    }
    moveLeft() {
        this.moveState.x = Math.max(this.moveState.x - 1, -1);
    }
    moveDown() {
        this.moveState.y = Math.min(this.moveState.y + 1,  1);
    }
    moveUp() {
        this.moveState.y = Math.max(this.moveState.y - 1, -1);
    }
    // move() {
    //     this.calcVel();
    //     this.pos = this.pos.add(this.vel);
    // }
    // moveIsometric() {
    //     this.calcVelIsometric();
    //     this.pos = this.pos.add(this.vel);
    // }
    moveX() {
        this.pos.x += this.vel.x;
    }
    moveY() {
        this.pos.y += this.vel.y;
    }
    calcVel() {
        this.vel = this.moveState.getUnitVector().scale(this.speed);
        return this.vel;
    }
    calcVelIsometric() {
        this.vel = this.moveState.toCartesian().getUnitVector().scale(this.speed);
        return this.vel;
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