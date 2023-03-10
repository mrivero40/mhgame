const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const btnUp = document.getElementById('up');
const btnDown = document.getElementById('down');
const btnLeft = document.getElementById('left');
const btnRight = document.getElementById('right');
const spanLives = document.getElementById('lives');
const spanTimes = document.getElementById('time');
const spanRecord = document.getElementById('record');
const pResult = document.getElementById('result');
const reloadGame = document.getElementById('reloadGame');
const removeRecord = document.getElementById('removeRecord');

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

const playerPositionOld = {
    x: undefined,
    y: undefined,
    canvasOld: undefined,
    elemOld: undefined,
};

const finishPosition = {
    x: undefined,
    y: undefined,
};

let enemyPosition = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    if(!playerPositionOld.canvasOld) {
        playerPositionOld.elemOld = elemSize;
        playerPositionOld.x = playerPosition.x;
        playerPositionOld.y = playerPosition.y;
    };
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * .7;
    } else {
        canvasSize = window.innerHeight * .7;
    };
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    canvasSize = Number(canvasSize.toFixed(0));

    elemSize = Number((canvasSize / 10).toFixed(5) -1);

    const ghostPosition = (playerPositionOld.elemOld / elemSize);

    playerPosition.x = playerPositionOld.x / ghostPosition;
    playerPosition.y = playerPositionOld.y / ghostPosition;
    
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

    context.fillRect(0, 0, canvasSize, canvasSize);

    showLives();
    showRecord();
    
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

    context.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

    if(enemyCollition) {
        context.clearRect(0, 0, canvasSize, canvasSize);
        context.fillText(emojis['BOMB_COLLISION'], playerPosition.x, playerPosition.y);
        context.fillText('???', playerPosition.x + 2, playerPosition.y - elemSize);
        setTimeout( () => levelFail(), 800);
    };
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
        context.clearRect(0, 0, canvasSize, canvasSize);
        context.textAlign = 'center';
        context.fillText('Game Over', canvasSize / 2, canvasSize / 2);
        return;                
    };
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    enemyPosition = [];
    flag = true;
    startGame();
};

function finishGame() {
    clearInterval(timeInterval);
    if(!record) {
        record = timePlayer;
        localStorage.setItem('record', record);
        showResult('Primera vez? Sigue superando tu record, BIENVENIDO!!');
    };
    if(timePlayer < record) {
        record = timePlayer;
        localStorage.setItem('record', record);
        showResult('conseguiste un nuevo record de ' + timePlayer + ' seg. FELICITACIONES!!');
    };
    if (timePlayer > record) {
        showResult('NO superaste el record, vuelve a intentarlo');
    };
    showRecord();
    context.clearRect(0, 0, canvasSize, canvasSize);
    context.textAlign = 'center';
    context.fillText('Juego Terminado', canvasSize / 2, canvasSize / 2);
    context.fillText(emojis['WIN'], canvasSize / 2, (canvasSize / 2) + elemSize);
};

function showLives() {
    //const heartsArray = Array(lives).fill(emojis['HEART']);
    spanLives.innerText = emojis['HEART'].repeat(lives);
};

function showTime() {
    timePlayer = (Date.now() - timeStart) / 1000;
    spanTimes.innerText = timePlayer;
};

function showRecord() {
    if(!record) {
        spanRecord.innerText = ' sin record ';
    } else {
        spanRecord.innerText = ` ${localStorage.getItem('record')} `;
    };
};

function showResult(result) {
    pResult.innerText = result;
};

function resetRecord() {
    localStorage.removeItem('record');
    spanRecord.innerText = ' record borrado ';    
};


btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
window.addEventListener('keydown', moveKeys);
reloadGame.addEventListener('click', () => location.reload());
removeRecord.addEventListener('click', resetRecord);

function moveUp() {
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