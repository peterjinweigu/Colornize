const express = require('express');
const app = express();

// Socket.io Stuff
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io'); 
const io = new Server(server);

const port = 3000;

// future use?
// app.set("view engine", "ejs");

// static files
app.use(express.static('public'));

// testing
app.get("/", (req, res) => {
    res.sendFile("/index.html", { root:__dirname});
});

// app.get("/style.css", (req, res) => {
//     res.sendFile("/view/style.css", { root:__dirname});
// });

// app.get("/script.js", (req, res) => {
//     res.sendFile("/view/script.js", { root:__dirname});
// });


// Can't use app since socket.io requires http server.
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.use((req, res) => {
    res.status(404).send("<p> 404 error </p>");
})



// I know this is disgusting
const { Player } = require('./modules/player.js');

playerMap = {};

// Multiplayer
// remember to put promise
io.on("connection", socket => {
    const id = socket.id;
    playerMap[id] = new Player(0, 0, 2);
    
    //
    console.log(playerMap);
    // socket.emit("hello", "world");
    
    socket.on("keydown", key => {
        let player = playerMap[id];
        // console.log('keydown', id, key);
        if (key === 'w') player.moveUp();
        else if (key === 'a') player.moveLeft();
        else if (key === 's') player.moveDown();
        else if (key === 'd') player.moveRight();
    });
    
    socket.on("keyup", key => {
        let player = playerMap[id];
        // console.log('up', id, key);
        if (key === 'w') player.moveDown();
        else if (key === 'a') player.moveRight();
        else if (key === 's') player.moveUp();
        else if (key === 'd') player.moveLeft();
    });
});



setInterval(() => {
    // move all characters & broadcast
    Object.values(playerMap).forEach(player => {
        // let newPos = isoMovement ? player.pos.add(player.calcVelIsometric()) : player.pos.add(player.calcVel());
        let newPos = player.pos.add(player.calcVelIsometric());
        if (newPos.x >= 0 && newPos.x <= 4*60) player.moveX();
        if (newPos.y >= 0 && newPos.y <= 4*60) player.moveY();
    })   
    io.emit('game_state', playerMap);
}, 10);

// console.log('log');