const circleClass = 'circle'
const xClass = 'x';
let iscircle;
let gameGrid = document.getElementById('gameGrid');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const start = document.getElementById('start');
let playerOne;
let playerTwo;
let isComputer;
const box = document.querySelectorAll(".box");
let isgameOver;
let reset = document.querySelectorAll(".reset");
let available = [];

reset.forEach(e => {
    e.addEventListener('click', gameReset);
});

function gameReset() {
    box.forEach(e => {
        e.textContent = '';
        e.classList.remove(xClass);
        e.classList.remove(circleClass);
    });

    let line = document.querySelector('.line');
    // line.style.transform = `translate(${e[3]}px,${e[4]}px) rotate(${e[5]}deg)`;
    line.style.height = '0px';
    gameLoad();
}

gameLoad();

function gameLoad() {
    winnerDialog = document.getElementById('winnerDialog');
    winnerDialog.classList.remove('active');
    popup.classList.add('active');
    overlay.classList.add('active');
    start.addEventListener('click', startButtonClicked);
}

function startButtonClicked() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
    getPlayersName();
    startGame();
}

function getPlayersName() {
    // console.log(document.getElementById('namePOne').textContent);
    playerOne = document.getElementById('namePOne').value == '' ? 'Guest1' : document.getElementById('namePOne').value;
    isComputer = document.getElementById('computer').checked ? true : false;
    playerTwo = isComputer ? "Computer" : document.getElementById('namePTwo').value == '' ? 'Guest2' : document.getElementById('namePTwo').value;
}


function startGame() {
    isgameOver = false;
    gameGrid.classList.remove('circle');
    // gameGrid.classList.('circle');
    gameGrid.classList.add('x');

    iscircle = false;
    box.forEach(el => {
        el.addEventListener('click', handleClick, { once: true });
    });
}

function handleClick(e) {
    if (isgameOver) {
        return;
    }
    console.log(e.target);
    //check which symbol to add x or o
    let currentClass = iscircle ? circleClass : xClass;

    //show the x or o
    addSymbol(e, currentClass);


    //check winner
    let winner = checkWinner();
    if (winner != '') {
        declareWinner(winner);
    }

    //check draw
    if (checkDraw()) {
        declareWinner("draw");
        return;
    }

    //switch gamegrid classlist
    switchGameGridClass();
    //swap current symbol
    swapSymbol();

    //if isComputer is true play next move Or circle move automatically
    if (iscircle && isComputer) {
        //play next move automatically
        playAutoMove()
    }
}

//play automatic moves without ai
// function playAutoMove() {
//     //check available tiles
//     findAvailable();

//     //mark available tiles
//     let move = random(available);
//     let boxNumber = move.i * 3 + move.j;
//     console.log(boxNumber);
//     console.table(available);
//     box[boxNumber].click();
// }

//play automatic moves with ai
function playAutoMove() {
    //check available tiles
    bestScore = -Infinity;
    let bestMove = { i: 0, j: 0 };
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (box[i * 3 + j].textContent == '') {
                // avail.push({ i, j });
                box[i * 3 + j].textContent = '⭕';
                let tempScore = minmax(0, 'min');
                console.log(`tempScore=${tempScore}  best=${bestScore}`);
                box[i * 3 + j].textContent = '';
                if (tempScore > bestScore) {
                    bestScore = tempScore;
                    bestMove.i = i;
                    bestMove.j = j;
                }
                bestScore = Math.max(tempScore, bestScore);
            }
        }
    }


    // findAvailable();

    // //mark available tiles
    // let move = random(available);
    let boxNumber = bestMove.i * 3 + bestMove.j;

    console.log(`boxNumber=${boxNumber}`);
    // console.table(available);
    box[boxNumber].click();
}


let scoreTable = {
    playerOne: -1,
    playerTwo: 1,
}

function minmax(score, algo) {
    let winner = checkWinner();
    if (winner == playerOne) {
        return -1;
    } else if (winner == playerTwo) {
        return 1;
    } else if (checkDraw()) {
        return 0;
    }
    let bestScore;
    if (algo == 'min') {
        bestScore = Infinity;
        // let avail = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (box[i * 3 + j].textContent == '') {
                    // avail.push({ i, j });
                    box[i * 3 + j].textContent = '❌';
                    let tempScore = minmax(score, 'max');
                    box[i * 3 + j].textContent = '';
                    bestScore = Math.min(tempScore, bestScore);
                }
            }
        }

    } else {
        bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (box[i * 3 + j].textContent == '') {
                    // avail.push({ i, j });
                    box[i * 3 + j].textContent = '⭕';
                    let tempScore = minmax(score, 'min');
                    // console.log(`i=${i} j=${j}`);
                    box[i * 3 + j].textContent = '';
                    bestScore = Math.max(tempScore, bestScore);
                }
            }
        }
    }
    return bestScore;
}


function declareWinner(winner) {
    console.log(winner);
    isgameOver = true;
    //show a line showing the 3 marks because of which it won
    //show winner window and reset button
    overlay.classList.add('active');
    winnerDialog = document.getElementById('winnerDialog');
    winnerDialog.classList.add('active');
    let winnerDiv = document.getElementById('winner');
    winnerDiv.textContent = winner;
    // overlay.textContent = winner;
}

function checkDraw() {
    let draw = true;
    box.forEach(el => {
        if (el.textContent == '') {
            draw = false;
            return;
        }
    });
    if (draw) {
        // declareWinner('Draw');
        return true;
    }
    return false;

}

function checkWinner() {
    let winner = '';
    let wins = [[0, 1, 2, 47, 72, 0], [3, 4, 5, 47, 252, 0], [6, 7, 8, 47, 426, 0], [0, 3, 6, -125, 258, 90], [1, 4, 7, 52, 258, 90], [2, 5, 8, 225, 258, 90], [0, 4, 8, 57, 258, 45], [2, 4, 6, 57, 241, -45]];
    wins.forEach(e => {
        // console.log(box[e[0]].textContent);
        if ((box[e[0]].textContent === box[e[1]].textContent) &&
            (box[e[1]].textContent === box[e[2]].textContent) &&
            (box[e[0]].textContent !== '')) {
            // let line = document.querySelector('.line');
            // line.style.transform = `translate(${e[3]}px,${e[4]}px) rotate(${e[5]}deg)`;
            // line.style.height = '3px';
            if (box[e[0]].textContent == '❌') {
                winner = playerOne;
                // declareWinner(playerOne);
            } else {
                winner = playerTwo;
                // declareWinner(playerTwo)
            }
            return;
        }
    });
    return winner;
}

function switchGameGridClass() {
    gameGrid.classList.remove('circle');
    gameGrid.classList.remove('x');
    if (iscircle) {
        gameGrid.classList.add('x');
    } else {
        gameGrid.classList.add('circle');

    }
}

function addSymbol(e, currentClass) {
    e.target.classList.add(currentClass);
    let symbol = currentClass == xClass ? '❌' : '⭕';
    e.target.textContent = symbol;
}

function swapSymbol() {
    iscircle = !iscircle;
}

function findAvailable() {
    available = [];
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (box[i * 3 + j].textContent == '') {
                available.push({ i, j });
            }
        }
    }
}

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
