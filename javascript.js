function newPlayer(name) {
    return {name}
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
    let emptySpace = 9;
    const board = gameBoard.board;

    const player1 = newPlayer('a');
    const player2 = newPlayer('b');
    
    let player1Turn = true;
    let currentPlayer = player1;

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
            let newMove = player1Turn ? 'x' : 'o'
            board[r][c] = newMove;
            emptySpace--;

            if (checkBackwardDiagonal(newMove) 
                || checkForwardDiagonal(newMove) 
                || checkCol(c, newMove) 
                || checkRow(r, newMove)) {
                    console.log(`Player ${currentPlayer.name} wins`)
                emptySpace = 9;
            } else if (emptySpace === 0) {
                console.log(`It's a tie!`)
                emptySpace = 9;
            } else {
                player1Turn = !player1Turn;
                currentPlayer = player1Turn ? player1 : player2;
            }
        }
    }
    return {makeMove};
})();




test();


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

