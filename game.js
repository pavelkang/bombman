;(function() {
    var DRAG_OK = false;
    var canvas;
    var game;
    var draggingBomb;
    var BOMB_SIZE = 50, // size of the bomb
    BOMB_LIFE = 400, // time before the bomb explodes
    DECISION_INT = 50, // frames between two decision making
    RED = "red",
    BLACK = "black",
    IN_GAME = 1,
    BOMB_INIT_INT = 120,
    BOMB_CREATE_INT = BOMB_INIT_INT,
    INT_CHANGE_INT = 100,
    BOMB_MAX_INT = 30,
    ELAPSED_TIME = 0,
    STEP = 3; // pixels the bomb moves per frame
    var Game = function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        canvas = this.canvas;
        this.scoreboard = document.getElementById("score");
        this.screen = this.canvas.getContext('2d');
        this.gameSize = {
            x: this.canvas.width,
            y: this.canvas.height
        };
        this.birthPoints = {
            top : {x : this.canvas.width/2, y : 0},
            down: {x : this.canvas.width/2, y : this.canvas.height}
        };
        this.score = 0;
        this.bombs = [];
        this.safezones = [new Safezone(this.gameSize, RED),
                          new Safezone(this.gameSize, BLACK)];
        var self = this;
        var tick = function() {
            if (IN_GAME == 0) { // game start
            } else if (IN_GAME == 1) {
                self.update();
                self.draw(self.screen, self.gameSize);
                requestAnimationFrame(tick);
            } else if (IN_GAME == 2){
                console.log("Game Over!");
                /* Calculate the final score */
                self.safezones.forEach(function(zone) {
                    self.score += zone.bombs.length;
                });
                console.log("The final score is " + self.score);
            }
        };
        tick();
    };
    Game.prototype = {
        update: function() {
            ELAPSED_TIME += 1;
            var stage = Math.floor(ELAPSED_TIME / INT_CHANGE_INT);
            if (BOMB_CREATE_INT > BOMB_MAX_INT &&
                BOMB_INIT_INT-stage*10 != BOMB_CREATE_INT) {
                BOMB_CREATE_INT = BOMB_INIT_INT - stage*10;
                console.log("Create interval is now changed to "
                            + BOMB_CREATE_INT);
            }
            if (ELAPSED_TIME % BOMB_CREATE_INT === 0) {
                createBomb(this);
            }
            this.bombs.forEach(function(bomb) {
                bomb.update();
            })
            this.scoreboard.innerHTML = this.score; // update score
        },
        draw: function(screen, gameSize) {
            screen.clearRect(0, 0, gameSize.x, gameSize.y);
            this.safezones.forEach(function(zone) {
                drawRect(screen, zone, zone.color);
            });
            this.bombs.forEach(function(bomb) {
                drawBomb(screen, bomb);
            })
        },
        addBody: function(body) {
        }
    };

    var Bomb = function(game, center, pos, color) {
        this.color = color;
        this.game = game;
        this.life = BOMB_LIFE;
        this.decInt = DECISION_INT;
        this.safe = null;
        this.size = {
            x : BOMB_SIZE, y : BOMB_SIZE
        };
        if (!pos) {
            this.center = {
                x : game.birthPoints.top.x,
                y : game.birthPoints.top.y + this.size.y / 2
            };
            this.dirx = 0;
            this.diry = -1;
        } else {
            this.center = {
                x : game.birthPoints.down.x,
                y : game.birthPoints.down.y - this.size.y / 2
            };
            this.dirx = 0;
            this.diry = 1;
        }
    };
    Bomb.prototype = {
        update: function() {
            // check if the bomb is safe
            if (!this.safe) {
                for (var i = 0; i < game.safezones.length; i++) {
                    var zone = game.safezones[i];
                    // check if bomb is within a safezone
                    if (((this.center.x - this.size.x / 2) >
                         (zone.center.x - zone.size.x / 2)) &&
                        ((this.center.x + this.size.x / 2) <
                         (zone.center.x + zone.size.x / 2)) &&
                        ((this.center.y - this.size.y / 2) >
                         (zone.center.y - zone.size.y / 2)) &&
                        ((this.center.y + this.size.y / 2) <
                         (zone.center.y + zone.size.y / 2))) {
                        this.safe = zone.color;
                        break;
                    }
                }
            }
            // possibly change directions
            if (this.decInt <= 0) {
                var newDirs = makeDecision();
                this.dirx = newDirs[0];
                this.diry = newDirs[1];
                this.decInt = DECISION_INT;
            } else {
                this.decInt--;
            }

            if (this.safe) {
                // possibly buggy collision code for if in safezone

                for (var i = 0; i < game.safezones.length; i++) {
                    var zone = game.safezones[i];
                    if (this.safe != zone.color) {
                        continue;
                    }
                    var topdiff = (zone.center.y - zone.size.y / 2) -
                        (this.center.y - this.size.y / 2);
                    if (0 <= topdiff && topdiff <= STEP && this.diry < 0) {
                        this.diry *= -1;
                    }
                    var bottomdiff = (this.center.y + this.size.y / 2) -
                        (zone.center.y + zone.size.y / 2);
                    if (0 <= bottomdiff && bottomdiff <= STEP && this.diry > 0) {
                        this.diry *= -1;
                    }
                    var leftdiff = (zone.center.x - zone.size.x / 2) -
                        (this.center.x - this.size.x / 2);
                    if (0 <= leftdiff && leftdiff <= STEP && this.dirx < 0) {
                        this.dirx *= -1;
                    }
                    var rightdiff = (this.center.x + this.size.x / 2) -
                        (zone.center.x + zone.size.x / 2);
                    if (0 <= rightdiff && rightdiff <= STEP && this.dirx > 0) {
                        this.dirx *= -1;
                    }
                }
            }
            else {
                if (this.life > 0) {
                    this.life -= 1;
                } else {
                    console.log("die TODO");
                    IN_GAME = 2;
                    return;
                }

                if (this === draggingBomb) return;

                // check for collision with canvas bounds
                if ((this.center.x - this.size.x / 2) < 0 && this.dirx < 0) {
                    this.dirx *= -1;
                }
                if ((this.center.x + this.size.x / 2) > canvas.width
                    && this.dirx > 0) {
                    this.dirx *= -1;
                }
                if ((this.center.y - this.size.y / 2) < 0 && this.diry < 0) {
                    this.diry *= -1;
                }
                if ((this.center.y + this.size.y / 2) > canvas.height
                    && this.diry > 0) {
                    this.diry *= -1;
                }

                // check for collision with safezones
                for (var i = 0; i < game.safezones.length; i++) {
                    if (colliding(this, game.safezones[i])) {
                        var zone = game.safezones[i];
                        if ((zone.center.x + zone.size.x / 2) -
                            (this.center.x - this.size.x / 2) <= STEP
                            && this.dirx < 0) {
                            this.dirx *= -1;
                        }
                        if ((this.center.x + this.size.x / 2) -
                            (zone.center.x - zone.size.x / 2) <= STEP
                            && this.dirx > 0) {
                            this.dirx *= -1;
                        }
                        if ((zone.center.y + zone.size.y / 2) -
                            (this.center.y - this.size.y / 2) <= STEP
                            && this.diry < 0) {
                            this.diry *= -1;
                        }
                        if ((this.center.y + this.size.y / 2) -
                            (zone.center.y - zone.size.y / 2) <= STEP
                            && this.diry > 0) {
                            this.diry *= -1;
                        }
                    }
                }
            }

            // Move
            this.center.x += this.dirx*STEP;
            this.center.y += this.diry*STEP;
        }
    };

    var createBomb = function(game) {
        var color = Math.random()>0.5?RED:BLACK
        var dir = Math.random()>0.5?0:1
        var newBomb = new Bomb(game, null, dir, color);
        game.bombs.push(newBomb);
    };

    var drawRect = function(screen, body, color) {
        // save old color so we can reset afterwards
        var oldStyle = screen.fillStyle;
        screen.fillStyle = color;
        screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
        screen.fillStyle = oldStyle;
    };

    var drawBomb = function(screen, body) {
        var oldStyle = screen.fillStyle;
        if (body.color === RED) {
            screen.fillStyle = "pink";
        } else {
            screen.fillStyle = "blue";
        }
        screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, body.size.x, body.size.y);
        screen.fillStyle = oldStyle;
    };

    var colliding = function(b1, b2) {
        return !(b1 === b2 || b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 || b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 || b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 || b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };

    var Safezone = function(game, color) {
        this.game = game;
        this.color = color;
        this.bombs = [];
        this.size = {
            x: game.x / 4,
            y: 2*game.y / 5
        };
        if (color === RED) {
            this.center = {
                x: 0 + (this.size.x / 2),
                y: (game.y / 2)
            }
        }
        else if (color === BLACK) {
            this.center = {
                x: (game.x - this.size.x) + (this.size.x / 2),
                y: (game.y / 2)
            }
        }
        else throw "Unexpected color in Safezone initialization";
    };
    window.onload = function() {
        game = new Game('screen');
        canvas.onmousedown = myDown;
        canvas.onmouseup = myUp;
    };

    var makeDecision = function() {
        var newAngle = 2*Math.PI*Math.random();
        return [Math.cos(newAngle), Math.sin(newAngle)];
    }

    // drag drop
    var myMove = function(e) {
        if (DRAG_OK) {
            draggingBomb.center.x = e.pageX - canvas.offsetLeft;
            draggingBomb.center.y = e.pageY - canvas.offsetTop;
        }
    };

    var myDown = function(e) {
        game.bombs.forEach( function(bomb) {
            x = bomb.center.x;
            y = bomb.center.y;
            if (e.pageX < x + 15 + canvas.offsetLeft && e.pageX > x - 15 +
                canvas.offsetLeft && e.pageY < y + 15 + canvas.offsetTop &&
                e.pageY > y -15 + canvas.offsetTop) {
                draggingBomb = bomb;
                DRAG_OK = true;
                canvas.onmousemove = myMove;
            }
        })
    }

    var myUp = function(){
        DRAG_OK = false;
        canvas.onmousemove = null;
        draggingBomb = null;
    }

})();
