;(function() {
  var Game = function(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.screen = this.canvas.getContext('2d');
    this.gameSize = {
      x: this.canvas.width,
      y: this.canvas.height
    };
    this.score = 0;
    this.safezones = [new Safezone(this.gameSize, "red"), new Safezone(this.gameSize, "black")];
    var self = this;
    var tick = function() {
      self.update();
      self.draw(self.screen, self.gameSize);
      requestAnimationFrame(tick);
    };
    tick();
  };
  Game.prototype = {
    update: function() {
    },
    draw: function(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);
      this.safezones.forEach(function(zone) {
        drawRect(screen, zone);
      });
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
    this.color = color;
    this.size = {
      x: game.x / 5,
      y: 2*game.y / 3
    };
    if (color === "red") {
      this.center = {
        x: 0,
        y: game.y / 5
      }
    }
    else if (color === "black") {
      this.center = {
        x: 4*game.x / 5,
        y: game.y / 5
      }
    }
    else throw "Unexpected color in Safezone initialization";
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
