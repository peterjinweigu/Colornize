const User = require('./user');
const Player = require('./player');
const Grid = require('./grid');
const Tile = require('./tile');
const gridTypes = require('./gridTypes');

class Room {
    static #REFRESH_RATE = 50;
    static #FRAME_RATE = 10;
    static #GAME_OVER = 12000;
    static io;

    code;
    users = []; // 1st player is the host
    interval;
    inGame;
    grid;
    gameOverBuffer;
    winner;

    // some abstraction could be done lol

    constructor(io, code) {
        Room.io = io;
        this.code = code;
        this.interval = this.lobbyLoop();
        this.inGame == false;
        this.gameOverBuffer = Room.#GAME_OVER;
    }
    destroyLoop() {
        clearInterval(this.interval);
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

        this.destroyLoop();
        
        this.inGame = true;
        this.gameOverBuffer = Room.#GAME_OVER;
        this.winner = "Draw";

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

    manageTileClick(i, j, col) {
        if (this.grid.grid[i][j].colour == col) {
            this.grid.grid[i][j].active = false;
        } // not a fan
    }

    manageTileMove(i, j, col) {
        if (this.grid.grid[i][j].colour != col && this.grid.grid[i][j].colour != 0) {
            this.grid.grid[i][j].active = false;
        } // not a fan
    }

    checkPlayer(i, j) {
        return (this.grid.grid[i][j].life != 0);
    }

    gameLoop() {
        return setInterval(()=>{
            let userCount = 0;
            this.users.forEach(user => {
                let player = user.player;
                let newPos = player.pos.add(player.calcVelIsometric());

                // edge of map collision
                if (newPos.x >= 0 && newPos.x <= this.grid.size*Tile.tileSize) player.moveX();
                if (newPos.y >= 0 && newPos.y <= this.grid.size*Tile.tileSize) player.moveY();  
                
                if (player.pos.x && player.pos.y && player.active) {
                    let curY = Math.floor(player.pos.y/Tile.tileSize);
                    let curX = Math.floor(player.pos.x/Tile.tileSize);

                    this.manageTileMove(
                        curY, 
                        curX, 
                        player.getColour()
                    );

                    if (!this.checkPlayer(curY, curX)) {
                        player.shutdown();
                    }
                }

                if (player.active) userCount++;
            })   
            if (userCount <= 1) this.gameOverBuffer -= Room.#REFRESH_RATE;
            if (userCount == 1) {
                this.users.forEach(user => {
                    let player = user.player;
                    if (player.active) this.winner = user.socketId;
                })
            }

            this.manageGrid();
            Room.io.to(this.code).emit('gameState', this.users, this.grid, this.inGame);
            
            if (this.gameOverBuffer == 0) {
                this.inGame = false;
                
                Room.io.to(this.code).emit('gameOver', "User " + this.winner + " is the winner");
                this.destroyLoop();
                return;
            }
        }, Room.#FRAME_RATE);
    }
}

module.exports = Room