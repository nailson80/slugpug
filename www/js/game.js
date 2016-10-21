/** Slug Pug Namespace **/

var SlugPug = SlugPug || {
    Initialized: false,
    Context: null,
    Sprites: {
        Body: null,
        Head: null,
        Tail: null,
    },
    Background: null,
    BodyParts: [
        [0,0], // Head
        [1,0], // Body
        [2,0]  // Tail
    ],
    Grid: {
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
        }
    },
    init: function() {
        init();
    },
    drawSprite: function(sprite, x, y) {
        // Make sure the the Context has been assigned
        if (SlugPug.Context == null) return;
        
        //context.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, x, y, sprite.width, sprite.height);
        SlugPug.Context.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, x * sprite.width, y * sprite.height, sprite.width, sprite.height);
    }
};

/** Helper Functions **/

function init() {
    // Setup cavas
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");
    SlugPug.Context = context;
    
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
    
    SlugPug.Sprites.Body = dogBody;
    SlugPug.Sprites.Head = dogHead;
    SlugPug.Sprites.Tail = dogTail;
    SlugPug.Background = bgImg;
    
    SlugPug.Initialized = true;
}

function drawFrame() {
    if (!SlugPug.Initialized) return;
    
    SlugPug.Context.clearRect(0,0,SlugPug.Grid.width,SlugPug.Grid.height);
    SlugPug.Context.drawImage(SlugPug.Background,0,0);
    
    // Draw Head and Tail first
    var lastPos = SlugPug.BodyParts.length - 1;
    SlugPug.drawSprite(SlugPug.Sprites.Head, SlugPug.BodyParts[0][0], SlugPug.BodyParts[0][1]);
    SlugPug.drawSprite(SlugPug.Sprites.Tail, SlugPug.BodyParts[lastPos][0], SlugPug.BodyParts[lastPos][1]);
    
    // Draw Body Parts
    for (var i = 1; i < lastPos; i++) {
        SlugPug.drawSprite(SlugPug.Sprites.Body, SlugPug.BodyParts[i][0], SlugPug.BodyParts[i][1]);
    }
}

function moveLeft() {
    var gridWidth = 15;
    var gridHeight = 7;
    
    SlugPug.BodyParts[0][0]--;
    if (SlugPug.BodyParts[0][0] < 0) {
        SlugPug.BodyParts[0][0] = gridWidth;
    }
}

function moveRight() {
    var gridWidth = 15;
    var gridHeight = 7;
    
    SlugPug.BodyParts[0][0]++;
    if (SlugPug.BodyParts[0][0] > gridWidth) {
        SlugPug.BodyParts[0][0] = 0;
    }
}

function moveUp() {
    var gridWidth = 15;
    var gridHeight = 7;
    
    SlugPug.BodyParts[0][1]--;
    if (SlugPug.BodyParts[0][1] < 0) {
        SlugPug.BodyParts[0][1] = gridHeight;
    }
}

function moveDown() {
    var gridWidth = 15;
    var gridHeight = 7;
    
    SlugPug.BodyParts[0][1]++;
    if (SlugPug.BodyParts[0][1] > gridHeight) {
        SlugPug.BodyParts[0][1] = 0;
    }
}

/** Slug Pug Classes **/

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

SlugPug.Vector2 = function(x,y) {
    this.x = x;
    this.y = y;
    this.calc = function() {
        return this.x + this.y;
    }
}

/** Game Loop and Initialization **/

window.main = function () {
  window.requestAnimationFrame( main );
    // Whatever your main loop needs to do.
    update();
    drawFrame();
};

main(); //Start the cycle.

function update() {
    //console.log("test");
}

window.addEventListener("DOMContentLoaded", function() {
    SlugPug.init();
});

window.onkeyup = function(evt) {
    console.log(evt);
    switch(evt.key) {
        case "ArrowLeft":
            moveLeft();
            break;
        case "ArrowRight":
            moveRight();
            break;
        case "ArrowUp":
            moveUp();
            break;
        case "ArrowDown":
            moveDown();
            break;
    }
};
