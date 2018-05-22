const socket = require('socket.io-client')();
const gridSize = 4;

angular.module('TicTacToeCtrl', []).controller('TicTacToeCtrl', ['$scope', function($scope) {

    socket.on('markSqure', (data) => {
        $scope.markSqure(data);
    });

    socket.on('resetGame', (data) => {
        $scope.init();
    });

    socket.on('allUsers', (users) => {
        users.forEach((user) => {
            if (user.id === socket.id) {
                $scope.userSign = user.sign;
                return $scope.userSign;
            }
        });
    });

    socket.on('turn', (turn) => {
        $scope.$applyAsync(function(){
            if(!$scope.isGameOver) {
                $scope.userTurn = turn;
                $scope.turnInfo = `${$scope.userTurn} Turn`;
            }
        });
    });

    socket.on('gameOver', (data) => {
        $scope.$applyAsync(function(){
            $scope.isGameOver = true;
            if(data.isWon) {
                $scope.userTurn = data.user;
                $scope.turnInfo = `${data.user} has won!`;
            }
            if(data.isDraw) {
                $scope.userTurn = "";
                $scope.turnInfo = `It's a draw !`;
            }
        });
    });

    $scope.resetGame = function() {
        socket.emit('resetGame', {user: $scope.userSign});
    };

    $scope.init = function() {
        $scope.$applyAsync(function(){
            $scope.empty();
            $scope.dummyArray = new Array(gridSize);
        });
    };

    $scope.empty = function() {
        $scope.data = {};
        $scope.isGameOver = false;
    };

    $scope.markSqure = function(data) {
        $scope.$applyAsync(function(){
            $scope.data[data.row + '' + data.column] = data.user;
        });
    };

    $scope.mark = function(row_index, column_index) {
        // check if there is value
        if ($scope.data[row_index + '' + column_index]) {
            return;
        }

        if($scope.userSign === $scope.userTurn) {
            socket.emit('turn', $scope.userTurn);
            socket.emit('saveSelectedTile', {row: row_index, column: column_index, user: $scope.userTurn});
        } else {
            $scope.turnInfo += '!';
        }
    };

    $scope.$applyAsync(function(){
        $scope.init();
    });
}]);