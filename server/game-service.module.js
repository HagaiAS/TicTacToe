const _ = require('underscore')._;
const gridSize = 4;
let gameTurns = 0;
let isGameOver = false;
let gameData = {};

function addNewUser(socket, sign) {
    return { id: socket.id, sign: sign };
}

function resetGame(data, io) {
    isGameOver = false;
    gameTurns = 0;
    gameData = {};
    console.log(`user ${data.user} click reset button`);
    io.emit('resetGame', data);
}

function changeUserTurn(turn) {
    let flipTurn = (turn === 'O' ? 'X' : 'O');
    return flipTurn;
}

function deleteUser(socket, users) {
    let index = 0;

    _.each(users, (user) => {
        if (user.id == socket.id) {
            index = users.indexOf(user);
        }
    });
    users.splice(index, 1);
}

function checkIfCurrentUserWon(mark, io) {
    const didWinCheck = didWin(mark);

    if (didWinCheck) {
        io.emit('gameOver', {user: mark, isWon: true});
        isGameOver = true;
        return;
    }

    // all board is filled, and no one won, in this case it's a draw.
    if (gameTurns == Math.pow(gridSize, 2)) {
        io.emit('gameOver', {user: mark, isDraw: true});
        isGameOver = true;
        return;
    }
}

function didWin(mark) {
    let vertical_count = 0,
        horizontal_count = 0,
        right_to_left_count = 0,
        left_to_right_count = 0;

    for (let i = 0; i < gridSize; i++) {
        vertical_count = 0;
        horizontal_count = 0;

        for (let j = 0; j < gridSize; j++) {

            if (gameData[i + '' + j] == mark) {
                horizontal_count++;
            }

            if (gameData[j + '' + i] == mark) {
                vertical_count++;
            }
        }

        if (gameData[i + '' + i] == mark) {
            left_to_right_count++;
        }

        if (gameData[(gridSize - 1 - i) + '' + i] == mark) {
            right_to_left_count++;
        }

        if (horizontal_count == gridSize || vertical_count == gridSize) {
            return true;
        }
    }
    
    if (left_to_right_count == gridSize || right_to_left_count == gridSize) {
        return true;
    }
    
    return false;
}

function saveSelectedTileInBoard(data, io) {
    // Prevent moves when game is over
    if (isGameOver) {
        return;
    }
    gameTurns += 1;
    gameData[data.row + '' + data.column] = data.user;
    checkIfCurrentUserWon(data.user, io);
    io.emit('markSqure', data);
}

module.exports = {
    addNewUser,
    resetGame,
    saveSelectedTileInBoard,
    changeUserTurn,
    deleteUser
};