const player = document.querySelector('.player');
const game = document.querySelector('.game');
const moveBtns = document.querySelectorAll('.move-btn');

let playerX = player.offsetLeft;
let playerY = player.offsetTop;

const step = 25;

const maxX = game.clientWidth - player.offsetWidth;
const maxY = game.clientHeight - player.offsetHeight;

const blockedCoordsList = []
const collectibleCoordsList = []

moveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const direction = btn.id;

        if (direction === 'up') {
            playerY -= step;
        } else if (direction === 'down') {
            playerY += step;
        } else if (direction === 'left') {
            playerX -= step;
        } else if (direction === 'right') {
            playerX += step;
        }

        // Keep player inside game
        playerX = Math.max(0, Math.min(playerX, maxX));
        playerY = Math.max(0, Math.min(playerY, maxY));

        if (canMove(playerX, playerY)) {
            player.style.left = `${playerX}px`;
            player.style.top = `${playerY}px`;
        } else {
            if (direction === 'up') {
                playerY += step;
            } else if (direction === 'down') {
                playerY -= step;
            } else if (direction === 'left') {
                playerX += step;
            } else if (direction === 'right') {
                playerX -= step;
            }

        }
    });
});

function canMove(x, y) {
    // Check if player is on top of an emoji
    for (let i = 0; i < blockedCoordsList.length; i++) {
        const blockedCoord = blockedCoordsList[i];
        if (x === blockedCoord.x && y === blockedCoord.y) {
            return false;
        }
    }
    return true;
}
// pick up diamonds
function pickUp() {
    
}

function canPlace(x, y) {
    // Check if player is on top of an emoji
    for (let i = 0; i < blockedCoordsList.length; i++) {
        const blockedCoord = blockedCoordsList[i];
        if (x === blockedCoord.x && y === blockedCoord.y) {
            return false;
        }
    }
    return true;
}

function generateEmoji(emoji, name, count, blocked = false) {
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.classList.add(name, 'emoji');
        element.textContent = emoji;

        let x = Math.floor(Math.random() * ((game.clientWidth) / 25)) * 25;
        let y = Math.floor(Math.random() * ((game.clientHeight) / 25)) * 25;

        if (canPlace(x, y)) {
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            game.appendChild(element);
        } else {
            i--;
            continue;
        }

        // Add to blocked coordinates list
        if (blocked) {
            blockedCoordsList.push({
                x: parseInt(element.style.left),
                y: parseInt(element.style.top)
            });
        } else {
            collectibleCoordsList.push({
                x: parseInt(element.style.left),
                y: parseInt(element.style.top)
            });
        }
    }
}

// call generateEmoji function
generateEmoji('🟫', 'wall', 100, true);
generateEmoji('💎', 'diamond', 50);
generateEmoji('🟦', 'water', 50);
generateEmoji('🚪', 'door', 1);
generateEmoji('🎁', 'mystery', 5);