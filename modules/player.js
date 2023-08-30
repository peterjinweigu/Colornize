const { Coord, coord } = require('./coord.js');

class Player {

    speed;
    pos;
    vel;
    moveState;
    colour;
    active;

    constructor(x, y, speed, colour) {
        this.speed = speed;
        this.pos = coord(x, y);
        this.vel = coord(0, 0);
        this.moveState = coord(0, 0);
        this.colour = colour;
        this.active = true;
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
    getColour() {
        return this.colour;
    }
    shutdown() {
        this.active = false;
    }
}

module.exports = Player