export class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // (x, y) => (x - y, (x + y)/2)
    toIsometric() {
        return coord(this.x - this.y, (this.x + this.y)/2);
    }
    // (x, y) => (y + x/2, y - x/2)
    toCartesian() {
        return coord(this.y + this.x/2, this.y - this.x/2);
    }
    // k(x, y) => (kx, ky)
    scale(k) {
        return coord(this.x * k, this.y * k);
    }
    // (x, y) + (a, b) => (x + a, y + b);
    add(other) {
        return coord(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return coord(this.x - other.x, this.y - other.y);
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    getUnitVector() {
        if (this.getMagnitude() == 0) {
            return this;
        }
        return this.scale(1/this.getMagnitude());
    }
    toInt() {
        return coord(Math.floor(this.x), Math.floor(this.y));
    }
}

export function coord(x, y) {
    return new Coord(x, y);
}