var SlugPug = SlugPug || {};

SlugPug.Sprite = function(img, x, y, width, height) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

SlugPug.BodyPart = function(x, y) {
    this.x = x;
    this.y = y;
};

SlugPug.Grid = {
    width: 800,
    height: 400,
    cellWidth: 50,
    cellHeight: 50,
    cells: [],
    init: function() {
        var _this = SlugPug.Grid;
        var rows = _this.height / _this.cellHeight;
        var cols = _this.width / _this.cellWidth;
        
        var grid = new Array(cols);
        for (var i = 0; i < cols; i++) {
            grid[i] = new Array(rows);
            for (var j = 0; j < rows; j++) {
                grid[i][j] = {x: i*50, y: j*50, occupied: false};
            }
        }
        _this.cells = grid;
        return _this.cells;
    },
};

SlugPug.drawSrite = function(context, sprite, x, y) {
    //context.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, x, y, sprite.width, sprite.height);
    context.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, x * sprite.width, y * sprite.height, sprite.width, sprite.height);
};

// Main Game Loop
window.main = function () {
  window.requestAnimationFrame( main );
    // Whatever your main loop needs to do.
    update();
};

main(); //Start the cycle.

function update() {
    //console.log("test");
}

window.addEventListener("DOMContentLoaded", function() {
    // Setup cavas
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");
    
    // Load images
    var bgImg = new Image(800,400);
    bgImg.src = "images/background-800x400.jpg";
    context.drawImage(bgImg,0,0);
    
    var dogSprites = new Image(200,200);
    dogSprites.src = "images/pug-sprites.png";
    dogSprites.onload = function() {
        
    };
    
    var dogBody = new SlugPug.Sprite(dogSprites,0,0,50,50);
    var dogHead = new SlugPug.Sprite(dogSprites,50,0,50,50);
    var dogTail = new SlugPug.Sprite(dogSprites,0,100,50,50);
    SlugPug.Grid.init();
    
    SlugPug.drawSrite(context, dogHead, 0, 0);
    SlugPug.drawSrite(context, dogTail, 1, 0);
    SlugPug.drawSrite(context, dogBody, SlugPug.Grid.cells.length-1, SlugPug.Grid.cells[0].length-1);
    
    
});

window.onkeyup = function(evt) {
    console.log(evt);
    switch(evt.key) {
        case "ArrowLeft":
            alert("Left");
            break;
        case "ArrowRight":
            alert("Right");
            break;
        case "ArrowUp":
            alert("Up");
            break;
        case "ArrowDown":
            alert("Down");
            break;
    }
};
