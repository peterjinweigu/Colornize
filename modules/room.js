const User = require('./user');
const Player = require('./player');
const Grid = require('./grid');
const gridTypes = require('./gridTypes');

class Room {
    static #REFRESH_RATE = 50;
    static #FRAME_RATE = 10;
    static io;
    code;
    users = []; // 1st player is the host
    interval;
    inGame;

    // Grid in room?
    grid;

    constructor(io, code) {
        Room.io = io;
        this.code = code;
        this.interval = this.lobbyLoop();
        this.inGame == false;
    }
    addUser(user) {
        // temporary cap on room size
        if (this.getSize() == 2) return false;
        // just to stop bugs for now
        if (this.inGame) return false;
        // prevent duplicate sockets
        for (let i = 0; i < this.getSize(); i++) {
            if (this.users[i].socketId == user.socketId) {
                return false;
            }
        }
        this.users.push(user);
        return true;
    }
    removeUser(user) {
        for (let i = 0; i < this.getSize(); i++) {
            if (this.users[i].socketId == user.socketId) {
                this.users.splice(i, 1);
                return true;
            }
        }
        // check if room is empty
        return false;
    }
    getSize() {
        return this.users.length;
    }
    startGame() {
        // console.log("WTF");

        if (this.getSize() != 2) return false;
        this.users[0].player = new Player(0.5*60, 3.5*60, 2, 1);
        this.users[1].player = new Player(3.5*60, 0.5*60, 2, 2);

        // instatiate grid :\
        // if (this.getSize() == 2) this.grid = new Grid(4);
        if (this.getSize() == 2) this.grid = new Grid(gridTypes[0]);

        clearInterval(this.interval);
        
        this.inGame = true;

        Room.io.to(this.code).emit('startGame');

        console.log('started game');

        this.interval = this.gameLoop();

        return true;
    }
    lobbyLoop() {
        return setInterval(()=>{
            Room.io.to(this.code).emit('lobbyState', this.users);
        }, Room.#REFRESH_RATE);
    }

    manageGrid() {
        this.grid.updateGrid(Room.#FRAME_RATE);
    }

    manageTileClick(x, y, col) {
        if (this.grid.grid[x][y].colour == col) {
            this.grid.grid[x][y].active = false;
        } // not a fan
    }

    manageTileMove(x, y, col) {
        if (this.grid.grid[x][y].colour != col) {
            this.grid.grid[x][y].active = false;
        } // not a fan
    }

    gameLoop() {
        return setInterval(()=>{
            this.users.forEach(user => {
                let player = user.player;
                let newPos = player.pos.add(player.calcVelIsometric());
                if (newPos.x >= 0 && newPos.x <= 4*60) player.moveX();
                if (newPos.y >= 0 && newPos.y <= 4*60) player.moveY();  
                
                if (player.pos.x && player.pos.y) {

                    // Math round for now
                    // console.log(player.pos.x/60, player.pos.y/60)
                    this.manageTileMove(Math.floor(player.pos.y/60), Math.floor(player.pos.x/60), player.getColour());

                }
            })   
            this.manageGrid();
            Room.io.to(this.code).emit('gameState', this.users, this.grid);
        }, Room.#FRAME_RATE);
    }
}

module.exports = Room