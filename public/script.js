import { Coord, coord } from './modules/coord.mjs';
import { Player } from './modules/player.mjs';
import { IsometricTile } from './modules/isometricTile.mjs';
import { TopDownTile } from './modules/topDownTile.mjs';

// Socket
const socket = io();
let playerMap = {};

// Labels
const labels = document.getElementById('labels');
let label = labels.checked;

// Isometric Grid
const isometricTitle = document.getElementById('iso-view');
const isometricCanvas = document.getElementById('isometric');
const ctxIso = isometricCanvas.getContext('2d');
const isometricGrid = []

// Top Down Grid
const topDownTitle = document.getElementById('td-view');
const topDownCanvas = document.getElementById('topdown');
const ctxTD = topDownCanvas.getContext('2d');
const topDownGrid = []

// Set Width and Heights
const gridSize = 4;
let tileSize = 75;

// isometricCanvas.width = 680;
isometricCanvas.height = 400;
// topDownCanvas.width = 500;
topDownCanvas.height = 400;

// lol
tileSize = 60;
isometricCanvas.width = 500;
topDownCanvas.width = 400;

// if (window.innerWidth < 1250) {
//     tileSize = 60;
//     isometricCanvas.width = 500;
//     topDownCanvas.width = 400;
// }

const offsetIso = coord(isometricCanvas.width/2, (isometricCanvas.height - tileSize * gridSize - IsometricTile.tileHeight)/2);
const offsetTD = coord(topDownCanvas.width/2 - gridSize * tileSize / 2, (topDownCanvas.height - tileSize * gridSize)/2);

// Movement
let isoMovement = true;

// Init Arrays
for (let i = 0; i < gridSize; i++) {
    isometricGrid[i] = [];
    topDownGrid[i] = [];
    for (let j = 0; j < gridSize; j++) {
        isometricGrid[i][j] = new IsometricTile(i, j, tileSize, gridSize);
        topDownGrid[i][j] = new TopDownTile(i, j, tileSize);
    }
}

const player = new Player(0, 0, 2);
let selectedTile = null;

// Topdown grid
function drawTopDownGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            topDownGrid[i][j].draw(ctxTD, offsetTD);
        }
    }
}

function labelTopDownGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (topDownGrid[i][j].selected) {
                topDownGrid[i][j].drawText(ctxTD, offsetTD);
            }
        }
    }
}

// Isometric grid
function drawIsometricGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            isometricGrid[i][j].draw(ctxIso, offsetIso);
        }
    }
}

function labelIsometricGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (isometricGrid[i][j].selected) {
                isometricGrid[i][j].drawText(ctxIso, offsetIso);
            }
        }
    }
}

// Movement
function keyDown(e) {
    let key = e.key.toLowerCase();
    if ("wasd".includes(key)) {
        socket.emit('keydown', key);
    }
    // if (key === 'w') player.moveUp();
    // else if (key === 'a') player.moveLeft();
    // else if (key === 's') player.moveDown();
    // else if (key === 'd') player.moveRight();
}

function keyUp(e) {
    let key = e.key.toLowerCase();
    if ("wasd".includes(key)) {
        socket.emit('keyup', key);
    }
    // if (key === 'w') player.moveDown();
    // else if (key === 'a') player.moveRight();
    // else if (key === 's') player.moveUp();
    // else if (key === 'd') player.moveLeft();
}

function hoverTile(r, c) {
    if (selectedTile) {
        isometricGrid[selectedTile.x][selectedTile.y].deselect();
        topDownGrid[selectedTile.x][selectedTile.y].deselect();
    }
    if (0 <= r && r < gridSize && 0 <= c && c < gridSize) {
        isometricGrid[r][c].select();
        topDownGrid[r][c].select();
        selectedTile = coord(r, c);
    }
    else {
        selectedTile = null;
    }
}

// function movePlayer() {
//     var pos = player.pos.scale(1/tileSize).toInt();

//     if (!selectedTile || pos.y != selectedTile.x || pos.x != selectedTile.y) {
//         isometricGrid[pos.y][pos.x].deselect();
//         topDownGrid[pos.y][pos.x].deselect();
//     }

//     // check out of bounds before moving
//     let newPos = isoMovement ? player.pos.add(player.calcVelIsometric()) : player.pos.add(player.calcVel());
//     if (newPos.x >= 0 && newPos.x <= gridSize*tileSize) player.moveX();
//     if (newPos.y >= 0 && newPos.y <= gridSize*tileSize) player.moveY();

//     pos = player.pos.scale(1/tileSize).toInt();
//     isometricGrid[pos.y][pos.x].select();
//     topDownGrid[pos.y][pos.x].select();
// }

function animate() {
    ctxIso.clearRect(0, 0, isometricCanvas.width, isometricCanvas.height);
    ctxTD.clearRect(0, 0, topDownCanvas.width, topDownCanvas.height);

    drawIsometricGrid();
    drawTopDownGrid();

    // console.log(playerMap);
    Object.values(playerMap).forEach(p => {
        let player = new Player(p.pos.x, p.pos.y, 0);
        player.drawTopDown(ctxTD, offsetTD);
        player.drawIsometric(ctxIso, offsetIso);
    });
    
    // player.drawTopDown(ctxTD, offsetTD);
    // player.drawIsometric(ctxIso, offsetIso);

    if (label) {
        labelIsometricGrid();
        labelTopDownGrid();
    }

    requestAnimationFrame(animate);
}

// ConnectPromise
// const connectedPromise = new Promise(resolve => {
socket.on("game_state", players => {
    playerMap = players;
    // console.log(playerMap);
    // console.log("😔");
});     
// })


animate();

labels.addEventListener('click', ()=> {
    label = labels.checked;
});

isometricCanvas.addEventListener('mousemove', (e)=> {
    let mousePos = coord(e.offsetX, e.offsetY).subtract(offsetIso).toCartesian().scale(1/tileSize).toInt();
    hoverTile(mousePos.y, mousePos.x);
});

topDownCanvas.addEventListener('mousemove', (e)=> {
    let mousePos = coord(e.offsetX, e.offsetY).subtract(offsetTD).scale(1/tileSize).toInt();
    hoverTile(mousePos.y, mousePos.x);
});

isometricTitle.addEventListener('mousedown', (e)=> {
    isometricTitle.className = "";
    topDownTitle.className = "";
    isometricTitle.classList.add('selected');
    isoMovement = true;
});

topDownTitle.addEventListener('mousedown', (e)=> {
    isometricTitle.className = "";
    topDownTitle.className = "";
    topDownTitle.classList.add('selected');
    isoMovement = false;
});

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);