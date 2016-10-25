/** Slug Pug Namespace **/

var SlugPug = SlugPug || {
    Initialized: false,
    Context: null,
    Sprites: {
        Body: null,
        Head: null,
        Tail: null,
        Treats: []
    },
    Background: null,
    BodyParts: [
        [0,0], // Head
        [1,0], // Body
        [2,0],
        [3,0]  // Tail
    ],
    Poop: {
        x: 4,
        y: 0
    },
    Treat: {
        x: 0,
        y: 0
    },
    Direction: {
        Left: 0,
        Right: 1,
        Up: 2,
        Down: 3
    },
    TimeOut: 300,
    LastTimeStamp: 0,
    Tick: {
        Initial: 0.5,
        Decrement: 0.05,
        TickTime: 0,
        CurrentTick: 0.5
    },
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
    
    var treatSprites = new Image(100,100);
    treatSprites.src = "images/treat-sprites.png";
    
    // Create sprites for the dog
    var dogBody = new SlugPug.Sprite(dogSprites,0,0,50,50);
    var dogHead = new SlugPug.Sprite(dogSprites,50,0,50,50);
    var dogTail = new SlugPug.Sprite(dogSprites,0,100,50,50);
    
    // Create sprites for the treats
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,0,0,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,50,0,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,0,0,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,0,0,50,50));
    
    SlugPug.Grid.init();
    
    SlugPug.Sprites.Body = dogBody;
    SlugPug.Sprites.Head = dogHead;
    SlugPug.Sprites.Tail = dogTail;
    SlugPug.Background = bgImg;
    
    SlugPug.CurrentDirection = SlugPug.Direction.Left;
    SlugPug.PreviousDirection = SlugPug.Direction.Left;
    
    SlugPug.Initialized = true;
    SlugPug.LastTimeStamp = getTimeStamp();
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
    SlugPug.PreviousDirection = SlugPug.CurrentDirection;
    SlugPug.CurrentDirection = SlugPug.Direction.Left;
}

function moveRight() {
    SlugPug.PreviousDirection = SlugPug.CurrentDirection;
    SlugPug.CurrentDirection = SlugPug.Direction.Right;
}

function moveUp() {
    SlugPug.PreviousDirection = SlugPug.CurrentDirection;
    SlugPug.CurrentDirection = SlugPug.Direction.Up;
}

function moveDown() {
    SlugPug.PreviousDirection = SlugPug.CurrentDirection;
    SlugPug.CurrentDirection = SlugPug.Direction.Down;
}

function advanceDog(deltaTime) {
    if (!SlugPug.Initialized) return;
    
    SlugPug.Tick.TickTime += deltaTime;

    while (SlugPug.Tick.TickTime > SlugPug.Tick.CurrentTick) {
        SlugPug.Tick.TickTime -= SlugPug.Tick.CurrentTick;
        
        var gridWidth = 15;
        var gridHeight = 7;
        var head = SlugPug.BodyParts[0];
        var len = SlugPug.BodyParts.length - 1;
        var direction = SlugPug.CurrentDirection;

        for (var i = len; i > 0; i--) {
            var before = SlugPug.BodyParts[i-1];
            var part = SlugPug.BodyParts[i];

            part[0] = before[0];
            part[1] = before[1];
        }

        if (direction == SlugPug.Direction.Left)
            head[0]--;
        if (direction == SlugPug.Direction.Up)
            head[1]--;
        if (direction == SlugPug.Direction.Right)
            head[0]++;
        if (direction == SlugPug.Direction.Down)
            head[1]++;

        if (head[0] < 0)
            head[0] = gridWidth;
        if (head[0] > gridWidth)
            head[0] = 0;
        if (head[1] < 0)
            head[1] = gridHeight;
        if (head[1] > gridHeight)
            head[1] = 0;
    }
}

function placeDogPoop() {
    var gridWidth = 15;
    var gridHeight = 7;
    
    var poopX = getRandomNumber(0, gridWidth);
    var poopY = getRandomNumber(0, gridHeight);
    
    if (poopX > gridWidth)
        poopX = 0;
    if (poopY > gridHeight)
        poopY = 0;
    
    var foundEmptyCell = false;
    while(true) {
        for (var i = 0; i < SlugPug.BodyParts.length; i++) {
            if (SlugPug.BodyParts[i][0] != poopX || SlugPug.BodyParts[i][1] != poopY) {
                foundEmptyCell = true;
                break;
            }
        }
        
        if(foundEmptyCell) {
            break;
        }
        
        poopX++;
        if (poopX > gridWidth) {
            poopX = 0;
            poopY++;
            if (poopX > gridHeight) {
                poopY = 0;
            }
        }
        
    }
    return {x: poopX, y: poopY};
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getTimeStamp() {
    var ts = 0;
    if( window.performance && performance.now ) {
        ts = window.performance.now().toFixed(3);
    }
    else {
        var timeStart = Date.now();
        ts = (Date.now() - timeStart).toFixed(3);
    }
    return ts / 1000;
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
    // Whatever your main loop needs to do.
    var now = getTimeStamp();
    var deltaTime = now - SlugPug.LastTimeStamp;
    
    update(deltaTime);
    
    SlugPug.LastTimeStamp = now;
    window.requestAnimationFrame( main );
};

main(); //Start the cycle.

function update(deltaTime) {
    //console.log(deltaTime);
    advanceDog(deltaTime);
    drawFrame();
}

window.addEventListener("DOMContentLoaded", function() {
    SlugPug.init();
});

window.onkeyup = function(evt) {
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