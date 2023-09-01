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

// Handle room issues
socket.on('failedToJoinRoom', ()=>{
    // send another get request to the room
    // This handles bugs involving duplicate tabs since duplicated tabs don't make get requests.
    window.location.replace(window.location.search);
})

// update lobby state
let userObjects = []; // id for now
let userElements = []; // element on the page

// elements
const userListElement = document.getElementById('user-list');
const startGame = document.getElementById('start-game');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gameResult = document.getElementById('game-result-display');

// game graphics
const grid = [];
let userGameObjects = [];

const gridSize = 5;
const tileSize = 60;
const offset = coord(canvas.width/2, (canvas.height - tileSize * gridSize - IsometricTile.tileHeight)/2);

let selectedTile;

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
});

socket.on('startGame', () =>{
    startGame.disabled = true;

    // Init Grid
    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = new IsometricTile(i, j, tileSize, gridSize, 0);
        }
    }
    animate();
});

socket.on('gameOver', (winner) => {
    if (isHost) startGame.removeAttribute('disabled');
    gameResult.append(winner);
    console.log('Game Over!');
});

// periodically update gamestate
// also added grid being transmitted
socket.on('gameState', (users, tempGrid, newInGame) => {
    inGame = newInGame;
    userGameObjects = users;

    // not sure if i should put this here, maybe abstract a bit?

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid[i][j].colour = tempGrid.grid[i][j].colour;
            grid[i][j].active = tempGrid.grid[i][j].life;
            if (!grid[i][j].active) grid[i][j].fall();
            else grid[i][j].animationStatus = IsometricTile.animationStatus.IDLE;
        }
    }
});


function drawGrid() {
    // assume all grids are squares for now
    // renders tiles by order of manhattan distance from (0, 0)
    for (let sum = 0; sum < 2*gridSize-1; sum++) {
        for (let row = Math.max(0, sum-gridSize+1); row < Math.min(sum+1, gridSize); row++) {
            let col = sum-row;
            grid[row][col].draw(ctx, offset);
        }
    }
}

// browser inspect element testing methods
window.idle = function(i, j) {
    grid[i][j].animationStatus = IsometricTile.animationStatus.IDLE;
    grid[i][j].animationCounter = 0;
}

window.fall = function(i, j) {
    grid[i][j].animationStatus = IsometricTile.animationStatus.FALLING;
}

window.getGrid = function() {
    console.log(grid);
}
// end of testing

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    if (inGame) {
        userGameObjects.forEach(user => {
            let player = new Player(user.player.pos.x, user.player.pos.y, user.player.colour);
            if (user.player.active) player.drawIsometric(ctx, offset); // ngl this is devious 
            // have some animation thing here
        });
    }
    requestAnimationFrame(animate);
}

function hoverTile(r, c) {
    if (selectedTile) {
        grid[selectedTile.x][selectedTile.y].deselect();
    }
    if (0 <= r && r < gridSize && 0 <= c && c < gridSize) {
        grid[r][c].select();
        selectedTile = coord(r, c);
    }
    else {
        selectedTile = null;
    }
}

// Obsolete
// function getGridClick(x, y) {
//     for (let i = 0; i < gridSize; i++) {
//         for (let j = 0; j < gridSize; j++) {
//             if (grid[i][j].checkCollision(x, y, offset)) return [i, j];
//         }
//     }
//     return [-1, -1];
// }

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

function mouseDown(e) {
    if (!inGame) return;
    
    // Edison out here like quake inverse square root algo
    let mousePos = coord(e.offsetX, e.offsetY).subtract(offset).toCartesian().scale(1/tileSize).toInt();

    if (mousePos.x >= 0 && mousePos.x < gridSize && mousePos.y >= 0 && mousePos.y < gridSize) {
        socket.emit('mousedown', mousePos.y, mousePos.x);
    }
}

function mouseMove(e) {
    let mousePos = coord(e.offsetX, e.offsetY).subtract(offset).toCartesian().scale(1/tileSize).toInt();
    hoverTile(mousePos.y, mousePos.x);
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mousemove', mouseMove);
