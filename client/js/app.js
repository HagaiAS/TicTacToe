// Require modules
let angular = require('angular');
require('../css/responsive.css');
require('../css/style.css');
require('./controllers/TicTacToeCtrl.js');

let app = angular.module('app', ['TicTacToeCtrl']);

app.directive('ticTacToe', function() {
    return {
        template: require('../views/tictactoe.html'),
        controller: 'TicTacToeCtrl'
    };
});