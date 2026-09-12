const game = document.querySelector('.game');

const gameStatus = document.getElementById('game-status');
const gameStatusContainer = document.getElementById('game-status-container');
const startGameBtn = document.getElementById('start');

const attackBtn = document.getElementById('attack');
const dimensionBtns = document.querySelectorAll('.dimension');
const moveBtns = document.querySelectorAll('.move');

const jumpEl = document.getElementById('jump');
const peachEl = document.getElementById('peach');

const powerUps = ['🗡️', '🌀', '💀']
const emojiList = {
    w: '🟫',
    d: '💎',
    o: '🚪',
    P: '🧍',
    R: '🏃',
    D: '🦖', // Dino
    C: '🦕', // Cino
    r: '🎁',
    s: '🎁',
    i: '🎁',
    j: '🎁',
    m: '📃',
    a: '🎁',
    f: '',
    h: '❤️',
}
const collectibleList = {
    d: '💎',
    r: '💎',
    s: '🗡️',
    i: '🌀',
    j: '💠',
    m: '📃',
    a: '🍑',
}
const levels = [
    [
        ['w', 'd', '.', 'w', 'd', 'w', '.', '.', '.', '.', '.', 'w', 'w', 'w', 'd', 'w', 'd', 'w', '.', 'i'],
        ['w', 'w', '.', 'w', 'd', '.', '.', 'w', 'r', 'd', 'w', '.', 'd', 'w', 'w', 'd', 'w', 'w', 'd', 'w'],
        ['.', 'd', '.', 'w', 'w', 'w', '.', 'd', 'w', 'w', 'w', '.', 'd', '.', '.', '.', '.', '.', 'd', 'w'],
        ['.', 'w', '.', '.', '.', 'f', 'D', 'w', 'w', '.', 'd', '.', 'w', 'f', 'f', 'f', 'D', 'w', 'w', 'd'],
        ['.', 'w', 'd', 'd', '.', '.', 'w', '.', '.', 'd', 'w', 'd', 'w', 'w', 'w', 'r', 'w', '.', 'w', 'w'],
        ['f', 'D', 'w', 'w', 'r', 'w', 'w', '.', 'w', 'w', 'w', 'd', 'w', '.', 'd', 'w', 'w', 'f', 'D', 'd'],
        ['.', 'w', 'd', 'w', 'w', 'w', '.', 'd', 'w', '.', 'f', 'D', '.', '.', 'w', 'w', 'f', 'D', 'w', 'w'],
        ['.', 'w', 'w', '.', '.', 'd', '.', 'w', 'w', 'r', 'd', 'w', 'w', 'w', 'w', 'f', 'D', 'w', 'w', 'd'],
        ['d', 'd', 'w', '.', 'w', 'w', 'w', 'w', 'd', 'w', 'w', 'w', 'd', '.', 'f', 'D', 'w', 'w', 'd', 'j'],
        ['r', 'w', 'w', '.', '.', '.', 'd', '.', '.', 'f', 'D', 'd', 'r', 'd', 'w', 'w', '.', 'f', 'D', 'w'],
        ['w', 'w', '.', 'd', 'w', '.', 'w', 'w', 'w', 'd', 'w', 'w', 'w', 'w', 'w', '.', 'f', 'f', 'D', 'w'],
        ['w', '.', 'd', 'w', 'w', 'd', '.', 'w', '.', '.', 'w', '.', 'd', '.', 'w', 'd', '.', 'w', 'd', 'w'],
        ['.', 'd', 'w', 'd', 'w', 'w', '.', 'w', 'm', '.', '.', '.', 'w', '.', 'w', 'w', 'd', 'w', 'f', 'D'],
        ['.', 'w', 'w', 'r', '.', '.', '.', 'd', 'w', 'w', 'w', 'w', 'w', '.', 'd', 'w', 'r', 'w', 'd', 'w'],
        ['.', '.', 'd', 'w', 'w', 'w', 'w', 'w', 'w', '.', 'd', '.', 'f', 'D', '.', 'w', 'w', '.', '.', 'w'],
        ['w', 'w', 'P', 'w', 'w', '.', 'd', 's', 'w', 'd', 'r', 'd', '.', 'w', '.', '.', 'w', 'w', 'w', 'w'],
        ['a', 'w', '.', '.', 'w', '.', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', '.', 'f', 'D', '.', 'r'],
        ['w', 'w', 'f', 'D', 'w', 'd', '.', '.', 'w', 'h', 'w', '.', '.', '.', '.', '.', 'd', 'w', 'w', 'w'],
        ['w', '.', 'd', '.', 'w', 'w', 'r', 'd', '.', 'C', '.', 'd', 'w', '.', 'w', 'w', 'w', 'w', 'o', 'w'],
        ['w', 'd', 'r', 'd', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'd', 'f', 'D', 'r', 'w', '.', 'd']
    ]
]
let level = structuredClone(levels[0])

let player = null;
let playerX = level[0];
let playerY = level[0];


const diamondCountEl = document.getElementById('d-count')
const redDiamondCountEl = document.getElementById('r-d-count')
let diamondCount = 0;
let redDiamondCount = 0;
let jumpWall = false;
let swordActive = false;
let peach = false;

jumpEl.addEventListener('click', () => {
    jumpWall = !jumpWall;
    if (jumpWall) {
        jumpEl.style.filter = 'saturate(1)';
        step = 2;
    } else {
        jumpEl.style.filter = 'saturate(0)';
        step = 1;
    }
});

let step = 1;

const maxX = 500;
const maxY = 500;

let moveInterval = null;
let moveTimeout = null;

moveBtns.forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();

        movePlayer(e.target);

        moveInterval = setInterval(() => {
            movePlayer(e.target);
        }, 300);
    });

    btn.addEventListener('pointerup', stopMovement);
    btn.addEventListener('pointercancel', stopMovement);
    btn.addEventListener('pointerleave', stopMovement);
});
function stopMovement() {
    clearInterval(moveInterval);
    moveInterval = null;
}

attackBtn.addEventListener('click', () => {
    swordActive = !swordActive;
    if (swordActive) {
        attackBtn.style.transform = 'scale(0.95) translateX(0)';
        moveBtns.forEach(btn => {
            btn.style.color = 'red';
        });
        player.classList.add('sword-active');
    } else {
        attackBtn.style.transform = 'scale(1) translateX(0)';
        moveBtns.forEach(btn => {
            btn.style.color = '#444';
        });
        player.classList.remove('sword-active');
    }
});

window.addEventListener('resize', () => {
    viewportWidth = game.parentElement.clientWidth;
    viewportHeight = game.parentElement.clientHeight;
    updateCamera();
});
let viewportWidth = game.parentElement.clientWidth;
let viewportHeight = game.parentElement.clientHeight;
function updateCamera() {

    let cameraX = playerX * 25 + 12.5 - viewportWidth / 2;
    let cameraY = playerY * 25 + 12.5 - viewportHeight / 2;

    // Don't let the camera see outside the 500x500 world
    cameraX = Math.max(0, Math.min(cameraX, maxX - viewportWidth));
    cameraY = Math.max(0, Math.min(cameraY, maxY - viewportHeight));

    game.style.transform = `translate(${-cameraX}px, ${-cameraY}px)`;
}

function generateLevel(level) {
    for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[i].length; j++) {
            if (level[i][j] === '.') continue;

            const thing = document.createElement('div');
            thing.classList.add('emoji', level[i][j]);
            thing.textContent = emojiList[level[i][j]];
            thing.style.left = j * 25 + 'px';
            thing.style.top = i * 25 + 'px';
            game.append(thing);

            addBehaviour(thing, level[i][j]);
        }
    }
    setPlayerCoords();
}
function addBehaviour(thing, name) {
    if (thing.classList.contains('P')) {
        player = thing;
    } else if (name === 'j') {
        thing.classList.add('jump');
    } else if (name === 'i') {
        thing.classList.add('dimensions');
    } else if (name === 'g') {
        thing.classList.add('sword');
    }
}
function setPlayerCoords() {
    level.forEach((row, i) => {
        row.forEach((emoji, j) => {
            if (emoji === 'P') {
                playerX = j;
                playerY = i;
            }
        });
    });
}

function movePlayer(btn) {
    const direction = btn.id;
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
    if (newX < 0 || newX > 19 || newY < 0 || newY > 19) return;

    let thingAtNewPos = level[newY][newX];

    playerX = newX;
    playerY = newY;
    player.style.left = playerX * 25 + 'px';
    player.style.top = playerY * 25 + 'px';
    player.textContent = '🏃';
    moveTimeout = setTimeout(() => {
        player.textContent = '🧍';
    }, 300);
    updateCamera();
    handleThing(thingAtNewPos, newX, newY); // 'g', 5, 5

    moveBtns.forEach(btn => {
        btn.style.color = '#444';
    });
    player.classList.remove('sword-active');
    swordActive = false;
}

function handleThing(thing, x, y) {
    if (thing === '.') return;
    const tile = document.querySelector(`.${thing}[style*="left: ${x * 25}px; top: ${y * 25}px"]`);

    if (thing === 'o' && diamondCount >= 50 && redDiamondCount >= 10) {
        gameStatus.textContent = 'You win.';
        gameStatusContainer.style.display = 'flex';
        game.classList.add('blur');
        // TODO: WA me.
    } else if (thing === 'd' || thing === 'r' || thing === 'i' || thing === 'j' || thing === 's' || thing === 'm' || thing === 'a') {
        tile.textContent = '';
        const collectibleThing = document.createElement('div');
        tile.append(collectibleThing);
        collectibleThing.textContent = collectibleList[thing];
        collectibleThing.classList.add('collect');

        if (thing === 'd') diamondCountEl.textContent = `💎 ${++diamondCount}/50`;
        else if (thing === 's') {
            attackBtn.textContent = '🗡️';
            attackBtn.style.pointerEvents = 'all';
            attackBtn.style.opacity = '1';
            gameStatus.textContent = 'Kill the Dinos! 🗡️';
            setTimeout(() => {
                gameStatusContainer.style.display = 'flex';
                // game.classList.add('blur');
            }, 500);
            setTimeout(() => {
                gameStatusContainer.style.display = 'none';
                gameStatus.textContent = '';
            }, 2500);
        } else if (thing === 'i') {
            dimensionBtns.forEach(btn => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';
            });
            gameStatus.textContent = 'You can move in diagonals! 🌀';
            setTimeout(() => {
                gameStatusContainer.style.display = 'flex';
            }, 500);
            setTimeout(() => {
                gameStatusContainer.style.display = 'none';
            }, 2500);
        } else if (thing === 'j') {
            jumpEl.style.display = 'flex';
            gameStatus.textContent = 'Jump over the walls! 💠';
            setTimeout(() => {
                gameStatusContainer.style.display = 'flex';
            }, 500);
            setTimeout(() => {
                gameStatusContainer.style.display = 'none';
            }, 2500);
        } else if (thing === 'r') {
            redDiamondCountEl.textContent = `💎 ${++redDiamondCount}/10`;
            tile.style.filter = 'hue-rotate(180deg)';
        } else if (thing === 'm') {
            setTimeout(() => {
                gameStatus.textContent = 'Be a good person. ❤️';
                gameStatusContainer.style.display = 'flex';
                game.classList.add('won-blur');
            }, 800);
            setTimeout(() => {
                gameStatusContainer.style.display = 'none';
                game.classList.remove('blur');
                tile.style.display = 'none';
            }, 2700);
        } else if (thing === 'a') {
            peach = true;
            peachEl.textContent = '🍑';
            peachEl.style.display = 'flex';
        }

        setTimeout(() => {
            collectibleThing.remove();
        }, 1000);
        level[y][x] = '.';

    } else if (thing === 'f' || thing === 'D') {
        if (thing === 'D' && swordActive) {
            tile.textContent = '';
            const dino = document.createElement('div');
            tile.append(dino);
            dino.textContent = '💀';
            dino.classList.add('dead');
            setTimeout(() => {
                dino.remove();
            }, 1000);

            // TODO: dryer fire handling.
            level[y][x] = '.';
            const fire = document.querySelector(`.f[style*="left: ${(x - 1) * 25}px; top: ${y * 25}px"]`);
            fire.style.opacity = '0';
            level[y][x - 1] = '.';

            if (level[y][x - 2] === 'f') {
                const fire = document.querySelector(`.f[style*="left: ${(x - 2) * 25}px; top: ${y * 25}px"]`);
                fire.style.opacity = '0';
                level[y][x - 2] = '.';
            }
            if (level[y][x - 3] === 'f') {
                const fire = document.querySelector(`.f[style*="left: ${(x - 3) * 25}px; top: ${y * 25}px"]`);
                fire.style.opacity = '0';
                level[y][x - 3] = '.';
            }
            return;
        }
        const msg = thing === 'f' ? 'Dino 🦖 burned you! 🔥' : 'You were eaten by Dino! 🦖';
        document.querySelector('.move-btns').style.pointerEvents = 'none';
        gameStatus.textContent = msg;

        const p = document.createElement('div');
        p.textContent = '💀';
        p.classList.add('dead');

        clearTimeout(moveTimeout);
        setTimeout(() => {
            player.textContent = '';
            player.append(p);
        }, 200);
        setTimeout(() => {
            p.remove();
        }, 100);
        setTimeout(() => {
            gameStatusContainer.style.display = 'flex';
            game.classList.add('blur');
        }, 1400);
    } else if (thing === 'C') {
        const heartEl = document.querySelector('.h');

        if (swordActive) {
            tile.textContent = '';
            const cino = document.createElement('div');
            tile.append(cino);
            cino.textContent = '💀';
            cino.classList.add('dead');
            setTimeout(() => {
                cino.remove();
            }, 1000);
            level[y][x] = '.';
            heartEl.textContent = '💔';
            return;
        }

        if (peach) {
            heartEl.textContent = '😋';
            return;
        }

        gameStatus.textContent = 'Cino 🦕: I like peaches! 🍑';
        setTimeout(() => {
            gameStatusContainer.style.display = 'flex';
        }, 300);
        setTimeout(() => {
            gameStatusContainer.style.display = 'none';
        }, 2500);
        peach = true;
    }
}

startGameBtn.addEventListener('click', startGame);

function startGame() {
    diamondCount = 0
    redDiamondCount = 0
    swordActive = false;
    peach = false;
    jumpWall = false;

    game.textContent = '';

    gameStatusContainer.style.display = 'none';
    game.classList.remove('blur');
    startGameBtn.textContent = 'Retry ↻';
    document.querySelector('.move-btns').style.pointerEvents = 'all';
    dimensionBtns.forEach(btn => btn.style.opacity = '0');

    diamondCountEl.textContent = `💎${diamondCount}/50`;
    redDiamondCountEl.textContent = `💎${redDiamondCount}/10`;

    attackBtn.textContent = '';
    attackBtn.style.pointerEvents = 'none';
    attackBtn.style.opacity = '0';
    dimensionBtns.forEach(btn => btn.style.pointerEvents = 'none');

    jumpEl.style.display = 'none';
    level = structuredClone(levels[0])
    generateLevel(level)
    updateCamera();
}
startGame();

