const User = require('./user');
const Player = require('./player');

class Room {
    static #REFRESH_RATE = 50;
    static #FRAME_RATE = 10;
    static io;
    code;
    users = []; // 1st player is the host
    interval;
    inGame;
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
        this.users[0].player = new Player(0.5*60, 3.5*60, 2);
        this.users[1].player = new Player(3.5*60, 0.5*60, 2);

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
    gameLoop() {
        return setInterval(()=>{
            this.users.forEach(user => {
                let player = user.player;
                let newPos = player.pos.add(player.calcVelIsometric());
                if (newPos.x >= 0 && newPos.x <= 4*60) player.moveX();
                if (newPos.y >= 0 && newPos.y <= 4*60) player.moveY();
            })   
            Room.io.to(this.code).emit('gameState', this.users);
        }, Room.#FRAME_RATE);
    }
}

module.exports = Room