const dictionary = ['maman','usine','avion','bisou','quels'];
const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')),
        currentRow: 0,
        currentCol: 0,
};

function updateGrid() {
    for(let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawbox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function drawGrid(container){
    const grid = document.createElement('div');
    grid.className = 'grid';

    for(let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            drawbox(grid,i,j);
        }
    }

    container.appendChild(grid);
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter'){
            if (state.currentCol === 5){
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord(word);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert("Ce mot n'existe pas");
                }
            }
        }
        if (key === 'Backspace'){
            removeLetter();
        }
        if (isLetter(key)){
            addLetter(key);
        }

        updateGrid();
    };
}

function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function getNumOfOccurencesInWord(word, letter) {
    let result = 0;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            result++;
        }
    }
    return result;
}

function getPositionOfOccurence(word, letter, position) {
    let result = 0;
    for (let i = 0; i <= position; i++) {
        if (word[i] === letter) {
            result++;
        }
    }
    return result;
}

function revealWord(guess) {
    const row = state.currentRow;

    for (let i = 0; i < 5; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        const NumOfOccurencesSecret = getNumOfOccurencesInWord (
            state.secret,
            letter
        );
        const NumOfOccurencesGuess = getNumOfOccurencesInWord(guess, letter);
        const letterPosition = getPositionOfOccurence(guess, letter, i);

        setTimeout(() => {
            if (
                NumOfOccurencesGuess > NumOfOccurencesSecret && 
                letterPosition > NumOfOccurencesSecret
                ) {
                    box.classList.add('empty');
            } else {
                if (letter === state.secret[i]) {
                    box.classList.add('right');
                } else if (state.secret.includes(letter)) {
                    box.classList.add('wrong');
                } else {
                    box.classList.add('empty');
                }
            }
        }, ((i + 1)* animation_duration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }
        
        const isWinner = state.secret === guess;
        const isGameOver = state.currentRow === 5;

        setTimeout (() => {
            if (isWinner) {
                alert('Bravo !');
            } else if (isGameOver) {
                alert(`Game Over. Le bon mot était : ${state.secret}`);
            }
        }, 3 * animation_duration);
    }

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if (state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function startup() {
    const game = document.getElementById('game');
    drawGrid(game);

    registerKeyboardEvents();
}

startup();