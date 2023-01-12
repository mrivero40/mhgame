const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
let canvasSize;
let elemSize;

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

    const map = maps[2];
    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    console.log(map, mapRows, mapRowsCols);

    mapRowsCols.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            const emoji = emojis[col];
            const x = elemSize * colIndex;
            const y = elemSize + elemSize * rowIndex;
            context.fillText(emoji, x, y);
        });
    });

    /*for(let row=0; row<10; row++) {
        for(let col=0; col<10; col++) {
            context.fillText(emojis[mapRowsCols[row][col]], elemSize * col, elemSize + elemSize * row);
        };
    };*/
};