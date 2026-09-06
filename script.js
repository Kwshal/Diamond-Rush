let player = null;
const game = document.querySelector('.game');
const moveBtns = document.querySelectorAll('.move');

const emojiList = {
    wall: '🟫',
    diamond: '💎',
    door: '🚪',
    gift: '🎁',
    player: '🧍',
    dinosaur: '🦖',
    fire: '🔥',
    

}

let playerX = null;
let playerY = null;

const diamondCountEl = document.getElementById('diamond-count')
const giftCountEl = document.getElementById('gift-count')
let diamondCount = 0;
let giftCount = 0;

const step = 25;

const maxX = game.clientWidth - 25;
const maxY = game.clientHeight - 25;

let things = []

moveBtns.forEach(btn => btn.addEventListener('click', handleMovement));

function handleMovement() {
    const direction = this.id;
    let newX = playerX;
    let newY = playerY;

    if (direction === 'up') {
        newY -= step;
    } else if (direction === 'down') {
        newY += step;
    } else if (direction === 'left') {
        newX -= step;
    } else if (direction === 'right') {
        newX += step;
    } else if (direction === 'top-left') {
        newX -= step;
        newY -= step;
    } else if (direction === 'top-right') {
        newX += step;
        newY -= step;
    } else if (direction === 'bottom-left') {
        newX -= step;
        newY += step;
    } else if (direction === 'bottom-right') {
        newX += step;
        newY += step;
    }

    // Keep player inside game
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    let thingAtNewPos = things.find(thing => thing.x === newX && thing.y === newY);
    let thingIndex = things.findIndex(thing => thing.x === newX && thing.y === newY);

    if (thingAtNewPos && thingAtNewPos.name === 'wall') return;

    playerX = newX;
    playerY = newY;
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';

    handleThing(thingAtNewPos, thingIndex);
    console.log('Player moved to:', playerX, playerY);
}

function handleThing(thing, thingIndex) {
    if (thing && thing.name === 'diamond') {
        const thingElement = document.querySelector(`.diamond[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
        thingElement.style.opacity = '0';
        diamondCountEl.textContent = `💎 ${++diamondCount}/50`;
        things.splice(thingIndex, 1);
    } else if (thing && thing.name === 'door') {
        // Open door when all diamonds are collected
        if (diamondCount >= 50 && giftCount >= 5) {
            const thingElement = document.querySelector(`.door[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
            thingElement.style.opacity = '0';
            things.splice(thingIndex, 1);
            document.getElementById('game-status').textContent = 'Congratulations! You won!';
        }
    } else if (thing && thing.name === 'gift') {
        const thingElement = document.querySelector(`.gift[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
        thingElement.style.filter = 'opacity(0.3) hue-rotate(120deg)';
        setTimeout(() => {
            thingElement.textContent = '💎'
        }, 300);
        giftCountEl.textContent = `🎁 ${++giftCount}/5`;
        things.splice(thingIndex, 1);
    }
    if (thing && thing.name === 'fire') {
        // Handle fire collision
        console.log('Fire collision detected');
        player.style.opacity = '0';
        document.querySelector('.move-btns').style.pointerEvents = 'none';
        document.getElementById('game-status').textContent = 'Game Over! You hit a fire!';
    }
}

function generateEmoji(name, count) {
    for (let i = 0; i < count; i++) {
        const thing = document.createElement('div');
        thing.classList.add(name, 'emoji');
        thing.textContent = emojiList[name];

        let x = Math.floor(Math.random() * ((game.clientWidth) / 25)) * 25;
        let y = Math.floor(Math.random() * ((game.clientHeight) / 25)) * 25;

        const thingExists = things.find(thing => thing.x === x && thing.y === y);
        if (!thingExists) {
            thing.style.left = x + 'px';
            thing.style.top = y + 'px';
            game.appendChild(thing);
        } else {
            i--;
            continue;
        }
        things.push({ x, y, name });
        if (name === 'player') {
            player = thing;
            playerX = player.offsetLeft;
            playerY = player.offsetTop;
        } 
        if (name === 'dinosaur') {
            // Add dinosaur movement logic here
            const fire = document.createElement('div');
            fire.classList.add('fire', 'emoji');
            // fire.textContent = '🔥';
            fire.style.left = x - 25 + 'px';
            fire.style.top = y + 'px';
            game.appendChild(fire);
            const fireX = x - 25
            things.push({ x:fireX, y, name: 'fire' })
            console.log('Fire added at:', fireX, y);
        }
    }
}

function startGame() {
    game.textContent = '';
    things = [];
    diamondCount = 0
    giftCount = 0
    document.querySelector('.move-btns').style.pointerEvents = 'all'
    generateEmoji('wall', 100);
    generateEmoji('diamond', 50);
    generateEmoji('door', 1);
    generateEmoji('gift', 5);
    generateEmoji('player', 1);
    generateEmoji('dinosaur', 5);

    let startBtn = document.getElementById('start');
    if (startBtn.textContent === 'Start') {
        startBtn.textContent = 'Restart';
    } else {
        startBtn.textContent = 'Start';
    }
}
startGame();





