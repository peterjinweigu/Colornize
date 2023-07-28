const Room = require('./room');

class ServerManager {
    static #CODE_LENGTH = 7;

    users;
    rooms;
    io;

    constructor(io) {
        this.users = {};
        this.rooms = {}; 
        this.io = io;
    }

    // random 7 digit code
    #genID() {
        let code = "";
        for (let i = 0; i < ServerManager.#CODE_LENGTH; i++) {
            code += this.#randChar();
        }
        return code;
    }

    #randChar() {
        // random digit
        if (Math.random() * 36 < 10) {
            return Math.trunc(Math.random() * 10); 
        // random letter
        } else {
            return String.fromCharCode(Math.trunc(Math.random() * 26 + 97));
        }
    }

    createRoom() {
        let code = "";
        do {
            code = this.#genID();
        } while (code in this.rooms);

        this.rooms[code] = new Room(this.io, code);
        return code;
    }

    roomExists(code) {
        return code in this.rooms;
    }

    getRoom(code) {
        if (!this.roomExists(code)) return null;
        return this.rooms[code];
    }

    joinRoom(code, user) {
        return this.getRoom(code).addUser(user);
    }

    leaveRoom(code, user) {
        let room = this.getRoom(code);
        room.removeUser(user);
        // delete empty rooms
        if (room.getSize() == 0) {
            clearInterval(room.interval);
            delete this.rooms[code];
        }
    }
}

module.exports = ServerManager;