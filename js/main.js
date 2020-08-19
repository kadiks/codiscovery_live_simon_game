const els = {
    // red: null,
    // green: null,
    // yellow: null,
    // blue: null
    // startBtn: null,
    btns: null,
    startScreen: null,
    gameScreen: null,
    endScreen: null
};

const colors = ['red', 'green', 'yellow', 'blue'];
let isGamePlaying = true;

const playSoundTime = 500;
const playSoundInterval = 400;

const winScore = 10;
let currentScore = 0;

const colorQueue = [];
const checkingQueue = [];

const init = () => {
    // els.startBtn = document.querySelector('.start-screen button');
    els.startScreen = document.querySelector('.start-screen');
    els.gameScreen = document.querySelector('.game-screen');
    els.endScreen = document.querySelector('.end-screen');
    els.btns = document.querySelector('.game-btns');

    els.startScreen.querySelector('button').addEventListener('click', startGame);

    els.endScreen.querySelector('button').addEventListener('click', startGame);

    els.btns.addEventListener('click', ({ target }) => {
        if (isGamePlaying === true) {
            return;
        }
        // console.log('evt.target', target);
        // console.log('evt.target classList', target.classList);
        if (target.classList.contains('game-btn') === false) {
            return;
        }

        const color = target.dataset.color;

        playSound(color);

        checkingQueue.push(color);

        checkQueue();
    });

};

const addColorToQueue = () => {
    colorQueue.push(getRandomColor());
    console.log('colorQueue', colorQueue);
};

const checkQueue = () => {
    const curPlayIndex = checkingQueue.length - 1;
    const color = checkingQueue[curPlayIndex];

    if (colorQueue[curPlayIndex] !== color) {
        endGame(false);
    }

    if (curPlayIndex === colorQueue.length - 1) {
        currentScore++;

        if (currentScore < winScore) {
            addColorToQueue();
            playQueue(1000);
            checkingQueue.splice(0, checkingQueue.length);
            els.gameScreen.querySelector('span')
                .textContent = currentScore;
        } else {
            
            endGame(true);
        }
    }
};

const enableGamerPlay = (isPlaying) => {
    isGamePlaying = isPlaying;
    const titleEl = els.gameScreen.querySelector('h4');
    // console.log('titleEl', titleEl);
    titleEl.textContent = isPlaying ? 'Listen!' : 'Play';
};

const endGame = (hasWon) => {
    els.endScreen.querySelector('h3')
        .textContent = hasWon ? 'You win!' : 'You lose! Try again.';
    els.endScreen.querySelector('span')
        .textContent = currentScore;
    els.gameScreen.querySelector('span')
        .textContent = 0;

    switchToScreen('end');
    colorQueue.splice(0, colorQueue.length);
    checkingQueue.splice(0, checkingQueue.length);
    currentScore = 0;
};

const getRandomColor = () => {
    const rColorIndex = parseInt(Math.random() * colors.length);
    // console.log('rColorIndex', rColorIndex);
    return colors[rColorIndex];
};

const playQueue = (delay = 0) => {
    enableGamerPlay(true);
    setTimeout(() => {
        // playSoundInQueueByIndex(0);
        // console.log('colorQueue', colorQueue);
        let lastDelay = 0;
        colorQueue.forEach((color, index) => {
            const delay = index * (playSoundTime + playSoundInterval);
            lastDelay = delay;
            // console.log('color', color);
            // console.log('color', color);
            // console.log('index', index);
            // console.log('delay', delay);
            playSoundInQueueByIndex(color, delay);
        });

        setTimeout(() => {
            enableGamerPlay(false);
        }, lastDelay);

    }, delay);
};


const playSound = (color = 'red') => {
    const colorMap = {
        red: 'sine',
        green: 'square',
        blue: 'triangle',
        yellow: 'sawtooth'
    };
    // console.log('#playSound');
    var context = new AudioContext();
    var o = context.createOscillator();
    o.type = colorMap[color];
    var  g = context.createGain();
    g.gain.value = 0.1;
    o.connect(g);
    g.connect(context.destination);
    o.start(0);

    g.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + 2
    );
};

const playSoundInQueueByIndex = (color, delay = 0) => {
    setTimeout(() => {
        playSound(color);
        const el = document.querySelector(`[data-color="${color}"]`);
        el.classList.add('animated');
        setTimeout(() => {
            el.classList.remove('animated');
        }, playSoundTime);
    }, delay);
    
};

const startGame = () => {
    switchToScreen('game');
    addColorToQueue();
    playQueue(1000);
};

const switchToScreen = (screenName) => {
    els.startScreen.style.display = 'none';
    els.gameScreen.style.display = 'none';
    els.endScreen.style.display = 'none';
    switch (screenName) {
        case 'start':
            els.startScreen.style.display = 'block';
            break;
        case 'game':
            els.gameScreen.style.display = 'block';
            break;
        default:
            els.endScreen.style.display = 'block';
            break;
    }
}

window.onload = init;