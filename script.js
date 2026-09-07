let player = null;
const game = document.querySelector('.game');
const gameStatus = document.getElementById('game-status');
const startGameBtn = document.getElementById('start');
const specialBtn = document.getElementById('special');
const dimensionBtns = document.querySelectorAll('.dimension');

const fireEl = document.getElementById('fire');
const swordEl = document.getElementById('sword');
const dimensionsEl = document.getElementById('dimensions');

const moveBtns = document.querySelectorAll('.move');

const emojiList = {
    wall: '🟫',
    diamond: '💎',
    door: '🚪',
    gift: '🎁',
    player: '🧍',
    dinosaur: '🦖',
    fire: '🔥',
    map: '🗺️',
    apple: '🍎',
    snail: '🐌',
    
}

let playerX = null;
let playerY = null;

const diamondCountEl = document.getElementById('diamond-count')
const giftCountEl = document.getElementById('gift-count')
let diamondCount = 0;
let giftCount = 0;
let superMove = 1;
let fireResistant = false;
let swordActive = false;

const step = 25;

const maxX = game.clientWidth - 25;
const maxY = game.clientHeight - 25;

let things = []

moveBtns.forEach(btn => btn.addEventListener('click', handleMovement));

specialBtn.addEventListener('click', () => {
    swordActive = !swordActive;
    if (swordActive) {
        specialBtn.style.transform = 'scale(0.95) translateX(0)';
        moveBtns.forEach(btn => {
            btn.style.color = 'maroon';
        });
        player.classList.add('sword-active');
    } else {
        specialBtn.style.transform = 'scale(1) translateX(0)';
        moveBtns.forEach(btn => {
            btn.style.color = '';
        });
        player.classList.remove('sword-active');
    }
});

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
    specialBtn.style.transform = 'scale(1) translateX(0)';
    moveBtns.forEach(btn => {
        btn.style.color = '';
    });
    player.classList.remove('sword-active');
    game.style.saturate = '1';
    swordActive = false;
    // console.log('Player moved to:', playerX, playerY);
}

function handleThing(thing, thingIndex) {
    if (thing && thing.name === 'diamond') {
        const thingElement = document.querySelector(`.diamond[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
        thingElement.style.translate = '0 -5px';
        thingElement.style.opacity = '0';
        diamondCountEl.textContent = `💎 ${++diamondCount}/40`;
        things.splice(thingIndex, 1);
    } else if (thing && thing.name === 'door') {
        // Open door when all diamonds are collected
        if (diamondCount >= 40 && giftCount >= 5) {
            const thingElement = document.querySelector(`.door[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
            thingElement.style.opacity = '0.5';
            things.splice(thingIndex, 1);
            gameStatus.textContent = 'Congratulations! You won!';
            gameStatus.style.display = 'block';
            game.classList.add('won-blur');
        }
    } else if (thing && thing.name === 'gift') {
        const thingElement = document.querySelector(`.gift[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
        thingElement.style.filter = 'opacity(0.3) hue-rotate(120deg)';
        thingElement.textContent = '';
        const collectedElement = document.createElement('div');

        if (thingElement.classList.contains('sword')) {
            collectedElement.classList.add('collected', 'sword-collected');
            specialBtn.textContent = '🗡️';
            specialBtn.style.pointerEvents = 'all';
            swordEl.style.opacity = '1';
        } 
        else if (thingElement.classList.contains('dimensions')) {
            collectedElement.classList.add('collected', 'dimension-collected');
            dimensionBtns.forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';
            });
            dimensionsEl.style.opacity = '1';
            console.log('Dimension button enabled');
        }
        else if (thingElement.classList.contains('fire')) {
            collectedElement.classList.add('collected', 'fire-collected');
            fireEl.style.opacity = '1';
            fireResistant = true;
            player.style.boxShadow = '0 0 10px #ffffff';

        }
        else {
            collectedElement.classList.add('collected', 'gift-collected');
        }

        thingElement.appendChild(collectedElement);
        setTimeout(() => {
            thingElement.removeChild(collectedElement);
            thingElement.style.display = 'none';
        }, 1000);

        giftCountEl.textContent = `🎁 ${++giftCount}/5`;
        things.splice(thingIndex, 1);

    } else if (thing && thing.name === 'fire' && !fireResistant) {
        // Handle fire collision
        // console.log('Fire collision detected');
        player.style.opacity = '0';
        game.style.saturate = '0'
        document.querySelector('.move-btns').style.pointerEvents = 'none';
        gameStatus.textContent = 'Dino 🦖 burned you! 🔥';
        setTimeout(() => {
            player.textContent = '💀';
        }, 300);
        setTimeout(() => {
            gameStatus.style.display = 'block';
            game.classList.add('won-blur');
        }, 1400);
    } else if (thing && thing.name === 'map') {
        const thingElement = document.querySelector(`.map[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
        thingElement.style.opacity = '0';
        generateEmoji('gift', 7);
        things.splice(thingIndex, 1);
        gameStatus.textContent = 'You found a map! 🗺️';
        gameStatus.style.display = 'block';
        game.classList.add('won-blur');
        setTimeout(() => {
            gameStatus.style.display = 'none';
            game.classList.remove('won-blur');
            thingElement.style.display = 'none';
        }, 1400);
    } else if (thing && thing.name === 'dinosaur') {
        if (swordActive) {
            const dino = document.querySelector(`.dinosaur[style*="left: ${thing.x}px; top: ${thing.y}px"]`);
            const fire = document.querySelector(`.fire[style*="left: ${thing.x - 25}px; top: ${thing.y}px"]`);
            dino.style.animation = 'none';
            dino.style.opacity = '0.5';
            dino.style.scale = '1.5';
            setTime = setTimeout(() => {
                dino.style.scale = '1';
                dino.textContent = '💀';
            }, 300);
            fire.style.opacity = '0';
            things.splice(thingIndex, 2); // Remove both dinosaur and fire
            // console.log('Dinosaur defeated at:', newX, newY);
            return;
        }
        player.style.opacity = '0';
        game.style.saturate = '0'
        document.querySelector('.move-btns').style.pointerEvents = 'none';
        gameStatus.textContent = 'You were eaten by Dino! 🦖';
        setTimeout(() => {
            player.textContent = '💀';
        }, 300);
        setTimeout(() => {
            gameStatus.style.display = 'block';
            game.classList.add('won-blur');
        }, 1400);

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
            things.push({ x: fireX, y, name: 'fire' })
            // console.log('Fire added at:', fireX, y);
        }
        if (name === 'gift' && i === 0) {
            thing.classList.add('sword');
        } else if (name === 'gift' && i === 1) {
            thing.classList.add('dimensions');
        } else if (name === 'gift' && i === 2) {
            thing.classList.add('fire');
        }
    }
}

function startGame() {
    game.textContent = '';
    specialBtn.textContent = '';
    specialBtn.style.pointerEvents = 'none';
    dimensionBtns.forEach(btn => btn.style.pointerEvents = 'none');
    things = [];
    diamondCount = 0
    giftCount = 0
    startGameBtn.textContent = 'Restart';
    gameStatus.style.display = 'none';
    game.classList.remove('won-blur');
    document.querySelector('.move-btns').style.pointerEvents = 'all'
    dimensionBtns.forEach(btn => btn.style.opacity = '0');
    diamondCountEl.style.pointerEvents = 'none';
    diamondCountEl.textContent = `💎 ${diamondCount}/40`;
    giftCountEl.textContent = `🎁 ${giftCount}/5`;

    generateEmoji('wall', 100);
    generateEmoji('diamond', 50);
    generateEmoji('door', 1);
    generateEmoji('map', 1);
    generateEmoji('player', 1);
    // generateEmoji('apple', 1);
    // generateEmoji('snail', 4);
    generateEmoji('dinosaur', 7);

    player.textContent = '🧍';

    startGameBtn.textContent = 'Restart';
}
startGame();





