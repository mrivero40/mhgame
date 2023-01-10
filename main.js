const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

window.addEventListener('load', startGame);

function startGame() {
    let canvasSize;
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * .75;
    } else {
        canvasSize = window.innerHeight * .75;
    };
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    const elemSize = (canvasSize / 10) -1;
    context.font = elemSize + 'px Ubuntu';
    context.textAlign = 'start';

    for(let i=0; i<10; i++) {
        context.fillText(emojis['X'], elemSize * i, elemSize);
    };
};