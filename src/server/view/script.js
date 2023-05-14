const canvas = document.querySelector('.game');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(255,250,250)';
ctx.fillRect(0,0,width,height);

const tileA = new Image();
tileA.src = "assets/tiles/grass.png";

var anchorX = 600;
var anchorY = 50;

var posX = 600;
var posY = 50;
var moveX = 0;
var moveY = 0;

function drawTilesA(){
    ctx.fillStyle = "rgb(50,50,50)";
    var offSetX = 50;
    var offSetY = 25;
    for (var i = 0; i < 10; i++) {
        var curX = anchorX - i*offSetX;
        var curY = anchorY + i*offSetY;
        for (var j = 0; j < 10; j++) {
            ctx.drawImage(tileA, curX + j*offSetX, curY + j*offSetY);
        }
    }
}

function drawCharacter(){
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fillRect(posX,posY,20,20);
}

function update(){
    posX += moveX;
    posY += moveY;
}

tileA.onload = function gameLoop(){

    ctx.fillStyle = 'rgb(255,250,250)';
    ctx.fillRect(0,0,width,height);

    drawTilesA();
    drawCharacter();
    update();

    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", move);
window.addEventListener("keyup", stop);

function move(event){
    var keyCode = event.keyCode;
    switch(keyCode){
        case 87:
            moveY = -1;
        break;
        case 68:
            moveX = 1;
        break;
        case 83:
            moveY = 1;
        break;
        case 65:
            moveX = -1;
        break;
    }
}

function stop(event){
    var keyCode = event.keyCode;
    switch(keyCode){
        case 87:
            if (moveY == -1) moveY += 1;
        break;
        case 68:
            if (moveX == 1) moveX -= 1;
        break;
        case 83:
            if (moveY == 1) moveY -= 1;
        break;
        case 65:
            if (moveX == -1) moveX += 1;
        break;
    }
}