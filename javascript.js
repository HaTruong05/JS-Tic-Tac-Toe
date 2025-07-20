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
                board[i][j] = 0;
            }
        }
    }
    
    return {board, reset};
})();



const gameplay = (() => {
    const x = document.getElementById('xName');
    const o = document.getElementById('oName');
    const board = gameBoard.board;
    
    let playerX;
    let playerO;
    let emptySpace;
    let xTurn;
    let currentPlayer;

    const start = document.getElementById('startGame');

    start.addEventListener('click', startGame)

    function startGame() {
        if (gameDisplay.startButtonActive) {
            emptySpace = 9;
            gameBoard.reset();

            playerX = newPlayer('X');
            playerO = newPlayer('O');

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
            let newMove = xTurn ? 'x' : 'o'
            board[r][c] = newMove;
            emptySpace--;

            if (checkBackwardDiagonal(newMove) 
                || checkForwardDiagonal(newMove) 
                || checkCol(c, newMove) 
                || checkRow(r, newMove)) {
                console.log(`Player ${currentPlayer.getName()} wins`)
                gameDisplay.movesActve = false;
                gameDisplay.startButtonActive = true;
            } else if (emptySpace === 0) {
                console.log(`It's a tie!`)
                gameDisplay.movesActve = false;
                gameDisplay.startButtonActive = true;
            } else {
                xTurn = !xTurn;
                currentPlayer = xTurn ? playerX : playerO;
            }
        }
    }
    return {makeMove};
})();

const gameDisplay = (() => {
    let startButtonActive = true;
    let movesActve = false;

    function renderBoard() {
        const boardDisplay = document.createElement('div');
        boardDisplay.id = 'board';

        const boardContainer = document.createElement('div');
        boardContainer.classList.add('flex');
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
                        clickedSpace.textContent = gameBoard.board[r][c];
                    }
                })
                rowDisplay.appendChild(spaceDisplay);
            }
            boardDisplay.appendChild(rowDisplay);
        }
        const prevBoard = document.getElementById('board');
        if (prevBoard) {prevBoard.remove()}

        document.body.appendChild(boardContainer);
    }

    return {startButtonActive, movesActve, renderBoard}
})();


// test();

// console.log(gameBoard.board)

// gameplay.makeMove(0, 0); // x
// gameplay.makeMove(1, 0); // o
// gameplay.makeMove(0, 1); // x
// gameplay.makeMove(1, 1); // o
// gameplay.makeMove(0, 2); // x -> player1 wins
// gameDisplay.renderBoard();
// console.log(JSON.stringify(gameBoard.board));


function test() {


    gameBoard.reset(); // reset
    gameplay.makeMove(0, 0); // x
    gameplay.makeMove(1, 0); // o
    gameplay.makeMove(0, 1); // x
    gameplay.makeMove(1, 1); // o
    gameplay.makeMove(0, 2); // x -> player1 wins

    gameBoard.reset(); // reset
    gameplay.makeMove(0, 0); // x
    gameplay.makeMove(0, 1); // o
    gameplay.makeMove(1, 0); // x
    gameplay.makeMove(1, 1); // o
    gameplay.makeMove(2, 0); // x -> player1 wins

    gameBoard.reset(); // reset
    gameplay.makeMove(0, 0); // x
    gameplay.makeMove(0, 1); // o
    gameplay.makeMove(1, 1); // x
    gameplay.makeMove(1, 0); // o
    gameplay.makeMove(2, 2); // x -> player1 wins

    gameBoard.reset(); // reset
    gameplay.makeMove(0, 2); // x
    gameplay.makeMove(0, 1); // o
    gameplay.makeMove(1, 1); // x
    gameplay.makeMove(1, 0); // o
    gameplay.makeMove(2, 0); // x -> player1 wins

    gameBoard.reset(); // reset
    gameplay.makeMove(0, 0); // x
    gameplay.makeMove(0, 1); // o
    gameplay.makeMove(0, 2); // x
    gameplay.makeMove(1, 1); // o
    gameplay.makeMove(1, 0); // x
    gameplay.makeMove(2, 0); // o
    gameplay.makeMove(1, 2); // x
    gameplay.makeMove(2, 2); // o
    gameplay.makeMove(2, 1); // x -> tie

}

