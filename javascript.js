function newPlayer(playerName) {
    let name = playerName

    function updateName(newName) {
        name = newName
    }

    function getName() {
        return name
    }

    return {updateName, getName}
}

const gameBoard = (() => {
    const board = [];
    for (let i = 0; i < 3; i++) {
        let row = ['', '', ''];
        board.push(row);
    }

    function reset() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = '';
            }
        }
    }
    
    return {board, reset};
})();



const gameplay = (() => {
    const x = document.getElementById('xName');
    const o = document.getElementById('oName');
    const board = gameBoard.board;
    const gameMessages = document.getElementById('gameMessages');
    
    let playerX;
    let playerO;
    let emptySpace;
    let xTurn;
    let currentPlayer;

    const start = document.getElementById('startGame');

    start.addEventListener('click', startGame)

    function startGame() {
        if (gameDisplay.startButtonActive) {
            gameMessages.textContent = '';
            emptySpace = 9;
            gameBoard.reset();

            playerX = newPlayer(1);
            playerO = newPlayer(2);

            xName = x.value.trim();
            oName = o.value.trim();
            if (xName) {
                playerX.updateName(xName);
                x.value = '';
            }
            if (oName) {
                playerO.updateName(oName);
                o.value = '';
            }

            xTurn = true;
            currentPlayer = playerX;
            gameMessages.textContent = `Player ${currentPlayer.getName()}'s turn`;

            gameDisplay.renderBoard();
            gameDisplay.startButtonActive = false;
            gameDisplay.movesActve = true;
        }
    }

    function checkRow(r, newMove) {
        return board[r].every(move => move === newMove);
    }

    function checkCol(c, newMove) {
        return board.every(row => row[c] === newMove);
    }

    function checkForwardDiagonal(newMove){
        let j = 2;
        for (let i = 0; i < 3; i++) {
            if (board[i][j] !== newMove) {
                return false;
            } 
            j--;
        }
        return true;
    }

    function checkBackwardDiagonal(newMove) {
        for (let i = 0; i < 3; i++) {
            if (board[i][i] !== newMove)
                return false;
        }
        return true;
    }

    function makeMove(r, c){
        if (!board[r][c]) {
            let newMove = xTurn ? "X" : "O"
            board[r][c] = newMove;
            emptySpace--;

            if (checkBackwardDiagonal(newMove) 
                || checkForwardDiagonal(newMove) 
                || checkCol(c, newMove) 
                || checkRow(r, newMove)) {
                gameDisplay.movesActve = false;
                gameDisplay.startButtonActive = true;
                gameMessages.textContent = `Player ${currentPlayer.getName()} wins!`;
            } else if (emptySpace === 0) {
                gameDisplay.movesActve = false;
                gameDisplay.startButtonActive = true;
                gameMessages.textContent = `It's a tie!`
            } else {
                xTurn = !xTurn;
                currentPlayer = xTurn ? playerX : playerO;
                gameMessages.textContent = `Player ${currentPlayer.getName()}'s turn`
            }
        }
    }
    return {makeMove};
})();

const gameDisplay = (() => {
    const xSVG = `<svg viewBox="0 0 100 100" stroke="#F1F1F1" stroke-width="10" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="20" x2="80" y2="80"/>
    <line x1="80" y1="20" x2="20" y2="80"/>
    </svg>`;

    const oSVG = `<svg viewBox="0 0 100 100" stroke="#F1F1F1" stroke-width="10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="35"/>
    </svg>`;

    let startButtonActive = true;
    let movesActive = false;

    function renderBoard() {
        const boardDisplay = document.createElement('div');
        boardDisplay.id = 'board';

        const boardContainer = document.createElement('div');
        boardContainer.classList.add('flex');
        boardContainer.id = 'boardContainer';
        boardContainer.appendChild(boardDisplay);

        for (let r = 0; r < 3; r++) {
            const rowDisplay = document.createElement('div');
            rowDisplay.classList.add('flex')
            for (let c = 0; c < 3; c++) {
                const spaceDisplay = document.createElement('button');
                spaceDisplay.classList.add('flex')
                
                spaceDisplay.setAttribute('data-row', r);
                spaceDisplay.setAttribute('data-col', c);

                spaceDisplay.addEventListener('click', (e) =>{
                    if (gameDisplay.movesActve) {
                        const clickedSpace = e.target;
                        r = clickedSpace.dataset.row;
                        c = clickedSpace.dataset.col;
                        gameplay.makeMove(r, c);
                        clickedSpace.innerHTML = gameBoard.board[r][c] == 'X' ? xSVG : oSVG;
                    }
                })
                rowDisplay.appendChild(spaceDisplay);
            }
            boardDisplay.appendChild(rowDisplay);
        }
        const prevBoard = document.getElementById('boardContainer');
        if (prevBoard) {prevBoard.remove()}

        document.body.appendChild(boardContainer);
    }

    return {startButtonActive, movesActve: movesActive, renderBoard}
})();

