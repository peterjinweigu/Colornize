const User = require('./user');
const Player = require('./player');
const Grid = require('./grid');
const Tile = require('./tile');
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
        if (this.getSize() != 2) return false;

        // only 1 grid type for now.
        this.grid = new Grid(gridTypes[0]);     
        let startPositions = gridTypes[0].startPositions;

        for (let i = 0; i < this.getSize(); i++) {
            let pos = startPositions[i].scale(Tile.tileSize);
            // center player on tile
            pos.x += Tile.tileSize/2;
            pos.y += Tile.tileSize/2;
            this.users[i].player = new Player(pos.x, pos.y, 2, i+1);
        }

        // defintely delete this soon
        this.grid.grid[1][0].colour = 1;
        this.grid.grid[2][0].colour = 1;
        this.grid.grid[2][1].colour = 1;
        this.grid.grid[3][0].colour = 1;
        this.grid.grid[3][1].colour = 1;
        this.grid.grid[3][2].colour = 1;

        this.grid.grid[2][3].colour = 2;
        this.grid.grid[1][3].colour = 2;
        this.grid.grid[1][2].colour = 2;
        this.grid.grid[0][3].colour = 2;
        this.grid.grid[0][2].colour = 2;
        this.grid.grid[0][1].colour = 2;



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
        if (this.grid.grid[x][y].colour != col && this.grid.grid[x][y].colour != 0) {
            this.grid.grid[x][y].active = false;
        } // not a fan
    }

    gameLoop() {
        return setInterval(()=>{
            this.users.forEach(user => {
                let player = user.player;
                let newPos = player.pos.add(player.calcVelIsometric());

                // edge of map collision
                if (newPos.x >= 0 && newPos.x <= this.grid.size*Tile.tileSize) player.moveX();
                if (newPos.y >= 0 && newPos.y <= this.grid.size*Tile.tileSize) player.moveY();  
                
                if (player.pos.x && player.pos.y) {
                    this.manageTileMove(
                        Math.floor(player.pos.y/Tile.tileSize), 
                        Math.floor(player.pos.x/Tile.tileSize), 
                        player.getColour()
                    );
                }
            })   
            this.manageGrid();
            Room.io.to(this.code).emit('gameState', this.users, this.grid);
        }, Room.#FRAME_RATE);
    }
}

module.exports = Room