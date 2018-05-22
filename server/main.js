const http = require('http');
const express = require('express');
const app = express();
app.use(express.static('client'));

const server = new http.Server(app);
const io = require('socket.io')(server);
const gameService = require('./game-service.module.js');
const MAX_USERS_NUMBER = 2;
let users = [];

function createPlayer(socket) {
    socket.emit('turn', 'O');
    // First user is always is the 'O' (circle) sign.
    if (users.length === 0) {
        return users.push(gameService.addNewUser(socket, 'O'));
    }

    return users.push(gameService.addNewUser(socket, 'X'));
}

function createNewUser(socket) {
    if (users.length < MAX_USERS_NUMBER ) {
        return createPlayer(socket);
    }

    return socket.disconnect();
}

io.on('connection', (socket) => {
    console.log(`A user connected with id ${socket.id}`);
    createNewUser(socket);
    io.emit('allUsers', users);

    socket.on('saveSelectedTile', (data) => {
        gameService.saveSelectedTileInBoard(data, io);
    });
		
    socket.on('turn', (turn) => {
        io.emit('turn', gameService.changeUserTurn(turn));
    });
	
    socket.on('resetGame', (data) => {
		gameService.resetGame(data, io);
        socket.emit('turn', 'O');
	});

    socket.on('disconnect', () => {
        console.log(`A user disconnected with id ${socket.id}`);
        gameService.deleteUser(socket, users);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`(listening on ${PORT}) http://localhost:${PORT}/`);
});