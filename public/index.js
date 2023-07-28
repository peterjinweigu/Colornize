let createGameBtn = document.getElementById('create-game');
let joinGameBtn = document.getElementById('join-game');
let gameCode = document.getElementById('game-code');

function createGame() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            window.location.href = `/?g=${this.responseText}`;
        }
    }
    xhttp.open("POST", "create-game", true);
    xhttp.send();
}

createGameBtn.addEventListener('click', createGame);