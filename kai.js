;(function() {
    var w = 500;
    var h = 500;
    var canvas = document.getElementById("screen");
    var drag = false;
    var targ, coordX, coordY, offsetX, offsetY;
    
    function startDrag(e) {
        // ???
        if (!e) {
            var e = window.event;
        }
        if (e.preventDefault) e.preventDefault();
        
        // IE uses srcElement
        targ = e.target ? e.target : e.srcElement;
        
        if (targ.className != "bomb") {
            console.log("BN")
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
        bomb.style.left = '0px';
    function doMove() {
        // Move right by 5
        if (!bomb)
            console.log("A");
        bomb.style.left = parseInt(bomb.style.left) + 5 + 'px';
        setTimeout(doMove, 20);

        document.onmousedown = startDrag;
        document.onmouseup   = stopDrag;
    }
    doMove();
    }
    //setInterval(function(){alert("Hello")}, 3000);

})();
