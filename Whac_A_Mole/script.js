let score = 0;
let timer;
let timeLeft = 60;

const rats = ['rat1.png', 'rat2.png', 'rat3.png', 'rat4.png', 'rat5.png'];
const circles = document.querySelectorAll('.circle');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const hammer = document.getElementById('hammer');
const startButton = document.getElementById('start-button');
const modal = document.getElementById('modal');
const finalScoreDisplay = document.getElementById('final-score');
const closeModal = document.querySelector('.close');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let currentRat;
let gameInProgress = false;

function showRat() {
    if (!gameInProgress) return;

    const circleIndex = getRandomInt(circles.length);
    const ratIndex = getRandomInt(rats.length);
    const ratImage = document.createElement('img');
    ratImage.src = rats[ratIndex];
    ratImage.classList.add('rat');
    ratImage.style.width = '100px';
    ratImage.style.height = '120px';
    
    const selectedCircle = circles[circleIndex];
    selectedCircle.appendChild(ratImage);
    ratImage.style.display = 'block';
    
    currentRat = ratImage;

    // ratImage.addEventListener('click', () => {
    //     scoreDisplay.textContent = `Score: ${score}`;
    //     ratImage.remove();
    // });

//     setTimeout(() => {
//         ratImage.remove();
//         setTimeout(showRat, 500);
//     }, 2000);
// }

setTimeout(() => {
    if (ratImage.parentElement) {
        ratImage.remove();
    }
    setTimeout(showRat, 500);
}, 2000);
}

function showBoom(x, y) {
const boomImage = document.createElement('img');
boomImage.src = 'boom.png';
boomImage.classList.add('boom');
boomImage.style.left = `${x}px`;
boomImage.style.top = `${y}px`;
document.body.appendChild(boomImage);
boomImage.style.display = 'block';
setTimeout(() => {
    boomImage.remove();
}, 250);
}

function moveHammer(x, y) {
    hammer.style.left = x - hammer.offsetWidth / 2 + 'px';
    hammer.style.top = y - hammer.offsetHeight / 2 + 'px';
}

function onHammerMove(event) {
    const x = event.pageX || event.touches[0].pageX;
    const y = event.pageY || event.touches[0].pageY;
    moveHammer(x, y);

    if (currentRat) {
        const ratRect = currentRat.getBoundingClientRect();
        const hammerRect = hammer.getBoundingClientRect();

        if (
            hammerRect.left < ratRect.right &&
            hammerRect.right > ratRect.left &&
            hammerRect.top < ratRect.bottom &&
            hammerRect.bottom > ratRect.top
        ) {
            score += 5;
            scoreDisplay.textContent = `Score: ${score}`;
            showBoom(ratRect.left, ratRect.top);
            currentRat.remove();
            currentRat = null;
        }
    }
}

hammer.addEventListener('mousedown', (event) => {
    if (!gameInProgress) return;

    hammer.style.position = 'absolute';
    moveHammer(event.pageX, event.pageY);

    function onMouseMove(event) {
        onHammerMove(event);
    }

    document.addEventListener('mousemove', onMouseMove);

    hammer.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        hammer.onmouseup = null;
    };
});

hammer.addEventListener('touchstart', (event) => {
    if (!gameInProgress) return;

    hammer.style.position = 'absolute';
    const touch = event.touches[0];
    moveHammer(touch.pageX, touch.pageY);

    function onTouchMove(event) {
        const touch = event.touches[0];
        onHammerMove(touch);
    }

    document.addEventListener('touchmove', onTouchMove);

    hammer.ontouchend = () => {
        document.removeEventListener('touchmove', onTouchMove);
        hammer.ontouchend = null;
    };
});

startButton.addEventListener('click', startGame);

function startGame() {
    resetGame();
    gameInProgress = true;
    startButton.disabled = true;
    timer = setInterval(countdown, 1000);
    showRat();
}

function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    } else {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
    }
}

function endGame() {
    gameInProgress = false;
    finalScoreDisplay.textContent = `Time's up! Your score is ${score}.`;
    modal.style.display = 'flex';
    startButton.disabled = false;
}

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    resetGame();
});

function resetGame() {
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    currentRat?.remove();
}

// Replace this older version to adjust touch drag on mobile devices.
// hammer.addEventListener('mousedown', (event) => {
//     if (!gameInProgress) return;

//     hammer.style.position = 'absolute';
//     moveAt(event.pageX, event.pageY);

//     function moveAt(pageX, pageY) {
//         hammer.style.left = pageX - hammer.offsetWidth / 2 + 'px';
//         hammer.style.top = pageY - hammer.offsetHeight / 2 + 'px';
//     }

//     function onMouseMove(event) {
//         moveAt(event.pageX, event.pageY);

//         if (currentRat) {
//             const ratRect = currentRat.getBoundingClientRect();
//             const hammerRect = hammer.getBoundingClientRect();

//             if (
//                 hammerRect.left < ratRect.right &&
//                 hammerRect.right > ratRect.left &&
//                 hammerRect.top < ratRect.bottom &&
//                 hammerRect.bottom > ratRect.top
//             ) {
//                 score += 5;
//                 scoreDisplay.textContent = `Score: ${score}`;
//                 showBoom(ratRect.left, ratRect.top);
//                 currentRat.remove();
//                 currentRat = null;
//             }
//         }
//     }

//     document.addEventListener('mousemove', onMouseMove);

//     hammer.onmouseup = () => {
//         document.removeEventListener('mousemove', onMouseMove);
//         hammer.onmouseup = null;
//     };
// });

// startButton.addEventListener('click', startGame);

// function startGame() {
//     resetGame();
//     gameInProgress = true;
//     startButton.disabled = true;
//     timer = setInterval(countdown, 1000);
//     showRat();
// }

// function countdown() {
//     if (timeLeft <= 0) {
//         clearInterval(timer);
//         endGame();
//     } else {
//         timeLeft--;
//         timerDisplay.textContent = `Time: ${timeLeft}`;
//     }
// }

// function endGame() {
//     gameInProgress = false;
//     finalScoreDisplay.textContent = `Time's up! Your score is ${score}.`;
//     modal.style.display = 'flex';
//     startButton.disabled = false;
// }

// closeModal.addEventListener('click', () => {
//     modal.style.display = 'none';
//     resetGame();
// });

// function resetGame() {
//     score = 0;
//     timeLeft = 60;
//     scoreDisplay.textContent = `Score: ${score}`;
//     timerDisplay.textContent = `Time: ${timeLeft}`;
//     currentRat?.remove();
// }
