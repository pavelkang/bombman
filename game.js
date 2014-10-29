;(function() {
    var Game = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        var screen = canvas.getContext('2d');
        var gameSize = {
            x: canvas.width,
            y: canvas.height
        };
        var score = 0;
        var self = this;
        var tick = function() {
            self.update();
            self.draw(screen, gameSize);
            requestAnimationFrame(tick);
        };
        tick();
    };
    Game.prototype = {
        update: function() {
        },
        draw: function(screen, gameSize) {
        },
        addBody: function(body) {
        }
    };
    var Bomb = function(game, center) {
        // cache the game object for later use
        this.game = game;
    };
    Bomb.prototype = {
        update: function() {
        }
    };
    var Safezone = function(game, color) {
        this.game = game;
    };
    var createBombs = function(game) {
    };
    var drawRect = function(screen, body) {
        screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
    };
    var colliding = function(b1, b2) {
        return !(b1 === b2 || b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 || b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 || b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 || b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };
    window.onload = function() {
        new Game('screen');
    };
})();
