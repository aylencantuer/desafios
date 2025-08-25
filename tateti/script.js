// --- Elementos del DOM ---
const gameBoard = document.getElementById('game-board'); // obtenemos el tablero (para reuso)
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart-button');

// --- Variables del Juego ---
let boardState = Array(9).fill(""); // Forma limpia de crear el array
let cellElements = []; //donde se guardaran los elementos de la celdas
let currentPlayer = "X";
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// --- Funciones de Inicialización ---

//crea el tablero dinámicamente
function createBoard() {
    // Vacía el tablero por si se llama durante un reinicio
    gameBoard.innerHTML = ''; 
    cellElements = [];

    //crea las celdas
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.cellIndex = i; // asigna un atributo data-cell-index con el número de celda
        //Se utiliza dataset para guardar información personalizada en los elementos HTML.
        cell.addEventListener('click', handleCellClick);
        
        gameBoard.appendChild(cell);
        cellElements.push(cell);
    }
}

// --- Lógica del Juego

function handleCellClick(event) {
    const clickedCell = event.target;
    const cellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (boardState[cellIndex] !== "" || !isGameActive || currentPlayer === "O") {
        return;
    }
    
    handlePlayerTurn(clickedCell, cellIndex);
}

function handlePlayerTurn(clickedCell, cellIndex) {
    boardState[cellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    if (checkWinner()) return;
    
    currentPlayer = "O";
    statusText.textContent = `Turno del Bot... 🤖`;
    setTimeout(botTurn, 1000);
}

function botTurn() {
    if (!isGameActive) return;

    const moveIndex = findBestMove();

    boardState[moveIndex] = currentPlayer;
    const botCell = cellElements[moveIndex]; 
    botCell.textContent = currentPlayer;
    botCell.classList.add(currentPlayer.toLowerCase());

    if (checkWinner()) return;

    currentPlayer = "X";
    statusText.textContent = `¡Tu turno! (X)`;
}

function checkWinner() {
    let roundWon = false;
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `¡Ganó ${currentPlayer}! 🎉`;
        isGameActive = false;
        return true;
    }

    if (!boardState.includes("")) {
        statusText.textContent = `¡Es un empate! 😐`;
        isGameActive = false;
        return true;
    }
    
    return false;
}

// Estrategia del Bot
function findBestMove() {
    // Priority 1: Win
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        const line = [boardState[a], boardState[b], boardState[c]];
        if (line.filter(cell => cell === "O").length === 2 && line.includes("")) {
            return condition[line.indexOf("")];
        }
    }
    // Priority 2: Block
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        const line = [boardState[a], boardState[b], boardState[c]];
        if (line.filter(cell => cell === "X").length === 2 && line.includes("")) {
            return condition[line.indexOf("")];
        }
    }
    // Priority 3: Center
    if (boardState[4] === "") return 4;
    // Priority 4: Corners
    const corners = [0, 2, 6, 8].filter(i => boardState[i] === "");
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    // Priority 5: Sides
    const sides = [1, 3, 5, 7].filter(i => boardState[i] === "");
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
    return boardState.indexOf("");
}

function restartGame() {
    boardState = Array(9).fill("");
    isGameActive = true;
    currentPlayer = "X";
    statusText.textContent = "¡Comienza el juego!";
    cellElements.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
}

// --- Event Listeners e Inicialización ---
restartButton.addEventListener('click', restartGame);

// Inicia el juego por primera vez
createBoard();