const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const spanLives = document.getElementById('lives');
const spanTimes = document.getElementById('time');
const spanRecord = document.getElementById('record');

let canvasSize;
let elemSize;
let flag = true;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
let record = localStorage.getItem('record');

const playerPosition = {
    x: undefined,
    y: undefined,
};

const finishPosition = {
    x: undefined,
    y: undefined,
};

let enemyPosition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {    
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * .75;
    } else {
        canvasSize = window.innerHeight * .75;
    };
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elemSize = (canvasSize / 10) -1;
    startGame();
};

function startGame() {
    context.font = elemSize + 'px Ubuntu';
    context.textAlign = 'start';

    let map = maps[level];

    if(!map) {
        finishGame();
        return;
    };

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
    };

    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));

    context.fillRect(0,0,canvasSize,canvasSize);

    showLives()
    spanRecord.innerText = localStorage.getItem('record');
    
    mapRowsCols.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const emoji = emojis[col];
            const x = elemSize * colIndex;
            const y = elemSize * (rowIndex + 1);
            context.fillText(emoji, x, y);

            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = x;
                    playerPosition.y = y;
                };
            } else if(col == 'I') {
                finishPosition.x = x;
                finishPosition.y = y;
            } else if(col == 'X' && flag){
                enemyPosition.push({
                    x: x,
                    y: y,
                });
            };
        });
    });
    flag = false;
    renderPlayer();   
};

function renderPlayer() {
    const matchX = playerPosition.x.toFixed(5) == finishPosition.x.toFixed(5);
    const matchY = playerPosition.y.toFixed(5) == finishPosition.y.toFixed(5);
    const match = matchX && matchY;
    if(match) {
        console.log('saliste al munndo, felicitaciones!!');
        levelWins();
    };
    const enemyCollition = enemyPosition.find(enemy =>{
        const enemyCollitionX = playerPosition.x.toFixed(5) == enemy.x.toFixed(5);
        const enemyCollitionY = playerPosition.y.toFixed(5) == enemy.y.toFixed(5);
        const enemyCollitionMatch = enemyCollitionX && enemyCollitionY;
        return enemyCollitionMatch
    });
    if(enemyCollition) {        
        levelFail();
    }
    context.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
};

function levelWins() {
    level++;
    flag = true;
    enemyPosition = [];
    startGame();
};

function levelFail() {
    console.log('bummmm!! a mover el bum bum');
    lives--;
    console.log(lives);
    if(lives <= 0) {
        lives = 3;
        level = 0;
        clearInterval(timeInterval);
        timeStart = undefined;
    };
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    enemyPosition = [];
    flag = true;
    startGame();
};

function finishGame() {
    console.log('terminaste el juego, tremendo ganador sos!!');
    clearInterval(timeInterval);
    if(!record) {
        record = timePlayer;
        localStorage.setItem('record', record);
    };
    if(timePlayer < record) {
        record = timePlayer;
        localStorage.setItem('record', record);
    };
    spanRecord.innerText = localStorage.getItem('record');
};

function showLives() {
    //const heartsArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerText = emojis['HEART'].repeat(lives);
};

function showTime() {
    timePlayer = (Date.now() - timeStart) / 1000;
    spanTimes.innerText = timePlayer;
};

btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
window.addEventListener('keydown', moveKeys);

function moveUp(){
    if(playerPosition.y < Math.ceil(elemSize)) {
        console.log('fuera de limite');        
    } else {
        playerPosition.y -= elemSize;
        startGame();
    };
};
function moveDown(){
    if(playerPosition.y < (canvasSize - elemSize)) {
        playerPosition.y += elemSize;
        startGame();
    }
};
function moveLeft(){
    if(playerPosition.x >= elemSize - 1) {
        playerPosition.x -= elemSize;
        startGame();
   };
};
function moveRight(){
    if(playerPosition.x <= (canvasSize - (elemSize + elemSize))) {
        playerPosition.x += elemSize;
        startGame();
    };
};
function moveKeys(event) {
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowDown') moveDown();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight();
};