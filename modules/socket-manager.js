const User = require("./user");

class SocketManager {

    // i have to. lol
    static serverManager;
    static io;

    constructor(io, serverManager) {
        SocketManager.serverManager = serverManager;
        SocketManager.io = io;
        io.on("connection", this.onConnection);
    }

    onConnection(socket) {
        const id = socket.id;
        let roomCode;
        let user = new User(id);
        let room;

        console.log('connect', id, new Date().toLocaleTimeString());

        socket.on('joinRoom', code => {
            if (!SocketManager.serverManager.joinRoom(code, user)) return;

            roomCode = code;
            room = SocketManager.serverManager.getRoom(code);

            socket.join(code);
        });

        socket.on('disconnect', () => {
            if (!roomCode) return;

            SocketManager.serverManager.leaveRoom(roomCode, user);
            console.log('dc', id, new Date().toLocaleTimeString());
        });

        socket.on('startGame', () => {
            if (!room || room.inGame) return;
            room.startGame();
        });

        socket.on("keydown", key => {
            if (!room || !room.inGame) return;

            let player = user.player;
            // console.log('keydown', id, key);

            if (key === 'w') player.moveUp();
            else if (key === 'a') player.moveLeft();
            else if (key === 's') player.moveDown();
            else if (key === 'd') player.moveRight();
        });
        
        socket.on("keyup", key => {
            if (!room || !room.inGame) return;

            let player = user.player;
            // console.log('up', id, key);
            if (key === 'w') player.moveDown();
            else if (key === 'a') player.moveRight();
            else if (key === 's') player.moveUp();
            else if (key === 'd') player.moveLeft();
        });

        // For clicks that come 
        socket.on('mousedown', (x, y) => {
            if (!room || !room.inGame) return;

            let player = user.player;
            // should i bring grid in??

            room.manageTileClick(x, y, player.getColour());
        })
    }
}

module.exports = SocketManager;