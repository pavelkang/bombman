;(function() {
    var REFRESH_RATE = 10;
    var INIT_TOP = 200;
    var INIT_LEFT = 200;
    var DEC_RATE = 200;
    var STEP = 3;
    var w = 500;
    var h = 500;
    var canvas = document.getElementById("screen");
    var drag = false;
    var targ, coordX, coordY, offsetX, offsetY;
    var DIR = 0;
    
    function startDrag(e) {
        // ???
        if (!e) {
            var e = window.event;
        }
        if (e.preventDefault) e.preventDefault();
        
        // IE uses srcElement
        targ = e.target ? e.target : e.srcElement;
        
        if (targ.className != "bomb") {
            return ;}
        offsetX = e.clientX;
        offsetY = e.clientY;
        if (!targ.style.left) {targ.style.left = '0px'};
        if (!targ.style.top) {targ.style.top = '0px'};

        coordX = parseInt(targ.style.left);
        coordY = parseInt(targ.style.top);
        drag = true;
        document.onmousemove = dragDiv;
        return false;
    }
    function dragDiv(e) {
        if (!drag) {return ;}
        if (!e) {var e = window.event;}
        targ.style.left = coordX+e.clientX-offsetX+'px';
        targ.style.top  = coordY+e.clientY-offsetY+'px';
        return false;
    }
    function stopDrag() {
        drag = false;
    }

    window.onload = function() {
            // move
        var bomb = document.getElementById("b");
        bomb.style.top = INIT_TOP;
        bomb.style.left = INIT_LEFT;
    }

    /* 0: up, 1: right, 2: down, 3:left*/
    function makeDecision() {
        return Math.floor(Math.random() * 4);
    }

    /* make a move */
    function makeMove(dir) {
        switch (dir) {
            case 0: // up
                bomb.style.top = (parseInt(bomb.style.top) - STEP) + 'px';
                break;
            case 1: // right
                bomb.style.left = parseInt(bomb.style.left) + STEP + 'px';
                break;
            case 2: // down
                bomb.style.top = parseInt(bomb.style.top) + STEP + 'px';
                break;
            case 3: // left
                bomb.style.left = (parseInt(bomb.style.left) - STEP) + 'px';
                break;
        }
        document.onmousedown = startDrag;
        document.onmouseup   = stopDrag;
    }

    setInterval(function(){makeMove(DIR);}, REFRESH_RATE);
    setInterval(function(){DIR = makeDecision();}, DEC_RATE);
    }
    //setInterval(function(){alert("Hello")}, 3000);

})();
