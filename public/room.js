import { Coord, coord } from './modules/coord.mjs';
import { Player } from './modules/player.mjs';
import { IsometricTile } from './modules/isometricTile.mjs';

const socket = io();
let isHost = false;
let inGame = false;

// get room code and emit to server
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('g');
socket.emit("joinRoom", roomCode);

// update lobby state
let userObjects = []; // id for now
let userElements = []; // element on the page

// elements
const userListElement = document.getElementById('user-list');
const startGame = document.getElementById('start-game');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// game graphics
const grid = [];
let userGameObjects = [];

const gridSize = 4;
const tileSize = 60;
const offset = coord(canvas.width/2, (canvas.height - tileSize * gridSize - IsometricTile.tileHeight)/2);

// Init Grid
for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
        grid[i][j] = new IsometricTile(i, j, tileSize, gridSize);
    }
}

// --------------- Update Lobbies -------------------//

var temp = undefined;

// updates player list periodically (socket ids)
socket.on("lobbyState", users => {
    // algorithm to update player list
    let index = 0;
    while(index < Math.max(users.length, userObjects.length)) {
        if (index >= users.length) {
            for (let i = index; i < userElements.length; i++) {
                userElements[i].remove();
            }
            userElements.splice(index, userElements.length - index);
            userObjects.splice(index, userObjects.length - index);
        }
        else if (index >= userObjects.length) {
            let div = document.createElement('div');
            div.innerText = users[index].socketId;
            userListElement.append(div);
            userElements.push(div);
            userObjects.push(users[index].socketId);
        }
        else if (userObjects[index] != users[index].socketId){
            userElements[index].remove();
            userElements.splice(index, 1);
            userObjects.splice(index, 1);
        }
        else {
            index += 1;
        }
    }

    // enable start game button if this user is the host
    // should change to only enable when 2 people are in the lobby.
    if (users[0].socketId == socket.id && !isHost) {
        isHost = true;
        startGame.removeAttribute('disabled');
    }

    temp = users;
});

// ------=====--- Update Game -------------------//

// start game
startGame.addEventListener('click', ()=>{
    socket.emit('startGame');
})

socket.on('startGame', () =>{
    animate();
});

// periodically update gamestate
socket.on('gameState', users => {
    inGame = true;
    userGameObjects = users;
});

function drawGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid[i][j].draw(ctx, offset);
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    if (inGame) {
        userGameObjects.forEach(user => {
            let player = new Player(user.player.pos.x, user.player.pos.y);
            player.drawIsometric(ctx, offset);
        });
    }
    requestAnimationFrame(animate);
}

// User Input
function keyDown(e) {
    if (!inGame) return;
    if (e.shiftKey || e.ctrlKey) return;
    
    let key = e.key.toLowerCase();
    if ("wasd".includes(key)) {
        socket.emit('keydown', key);
    }
}

function keyUp(e) {
    if (!inGame) return;
    if (e.shiftKey || e.ctrlKey) return;

    let key = e.key.toLowerCase();
    if ("wasd".includes(key)) {
        socket.emit('keyup', key);
    }
}

// You make this peter! Send click information to server.
function mouseDown(e) {

}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// add a listener for the mouse peter