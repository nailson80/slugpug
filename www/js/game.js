/** Slug Pug Namespace **/

var SlugPug = SlugPug || {
    Initialized: false,
    GameState: null,
    Score: 0,
    ScoreIncrement: 10,
    Context: null,
    Sprites: {
        Body: null,
        Head: null,
        Tail: null,
        Poop: [],
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
        stateTime: 0,
        x: 4,
        y: 0
    },
    Treat: {
        x: 3,
        y: 3
    },
    Direction: {
        Left: 0,
        Right: 1,
        Up: 2,
        Down: 3
    },
    DeltaTime: 0,
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
        cellHeight: 50
    },
    init: function() {
        init();
    },
    drawSprite: function(sprite, x, y) {
        // Make sure the the Context has been assigned
        // and the sprite is not null, otherwise an error
        // will occur, especially changing browser tabs
        if (SlugPug.Context == null || sprite == null) return;
        
        SlugPug.Context.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, x * sprite.width, y * sprite.height, sprite.width, sprite.height);
    },
    gameStates: function() {
        return {Running: 0, Paused: 1, GameOver: 2};
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
    
    var poopSprites = new Image(250,50);
    poopSprites.src = "images/poop-sprites.png";
    
    // Create sprites for the dog
    var dogBody = new SlugPug.Sprite(dogSprites,0,0,50,50);
    var dogHead = new SlugPug.Sprite(dogSprites,50,0,50,50);
    var dogTail = new SlugPug.Sprite(dogSprites,0,100,50,50);
    
    // Create sprites for the treats
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,0,0,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,50,0,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,0,50,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,50,50,50,50));
    
    // Create sprites for the poop
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,0,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,50,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,100,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,150,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,200,0,50,50));
    
    SlugPug.Sprites.Body = dogBody;
    SlugPug.Sprites.Head = dogHead;
    SlugPug.Sprites.Tail = dogTail;
    SlugPug.Background = bgImg;
    
    SlugPug.CurrentDirection = SlugPug.Direction.Left;
    SlugPug.PreviousDirection = SlugPug.Direction.Left;
    
    SlugPug.Initialized = true;
    SlugPug.GameState = SlugPug.gameStates().Paused;
    SlugPug.LastTimeStamp = getTimeStamp();
    
    window.anim = new SlugPug.Animation(.15, SlugPug.Sprites.Poop);
}

function drawFrame() {
    if (!SlugPug.Initialized) return;
    
    SlugPug.Context.clearRect(0,0,SlugPug.Grid.width,SlugPug.Grid.height);
    SlugPug.Context.drawImage(SlugPug.Background,0,0);
    
    // Draw Treat
    SlugPug.drawSprite(SlugPug.Sprites.Treats[0],SlugPug.Treat.x, SlugPug.Treat.y);
    
    // Draw Poop
    //SlugPug.drawSprite(SlugPug.Sprites.Poop, SlugPug.Poop.x, SlugPug.Poop.y);
    if (window.anim != undefined) {
        var f = window.anim.getKeyFrame(SlugPug.Poop.stateTime);
        console.log(f);
        SlugPug.drawSprite(SlugPug.Sprites.Poop[f], SlugPug.Poop.x, SlugPug.Poop.y);
    }
    
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
        
        // Check for collision with treat
        if (head[0] == SlugPug.Treat.x && head[1] == SlugPug.Treat.y) {
            SlugPug.Score += SlugPug.ScoreIncrement;
            SlugPug.Treat = placeObject();
            SlugPug.BodyParts.push([]);
            console.log(SlugPug.Score);
        }
    }
}

function placeObject() {
    var gridWidth = 15;
    var gridHeight = 7;
    
    var objectX = getRandomNumber(0, gridWidth);
    var objectY = getRandomNumber(0, gridHeight);
    
    if (objectX > gridWidth)
        objectX = 0;
    if (objectY > gridHeight)
        objectY = 0;
    
    var foundEmptyCell = false;
    while(true) {
        for (var i = 0; i < SlugPug.BodyParts.length; i++) {
            if (SlugPug.BodyParts[i][0] != objectX || SlugPug.BodyParts[i][1] != objectY) {
                foundEmptyCell = true;
                break;
            }
        }
        
        if(foundEmptyCell) {
            break;
        }
        
        objectX++;
        if (objectX > gridWidth) {
            objectX = 0;
            objectY++;
            if (objectX > gridHeight) {
                objectY = 0;
            }
        }
        
    }
    
    return {x: objectX, y: objectY};
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getTimeStamp() {
    var ts = 0;
    if( window.performance && performance.now ) {
        ts = window.performance.now() / 1000;
    }
    else {
        var timeStart = Date.now();
        ts = (Date.now() - timeStart);
    }
    return ts;
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

SlugPug.Animation = function(frameDuration, keyFrames) {
    this.frameDuration = frameDuration;
    this.keyFrames = keyFrames;
    
    this.getKeyFrame = function(stateTime) {
        var frameNumber = stateTime / frameDuration;
        //frameNumber = Math.min(this.keyFrames.length-1, frameNumber);
        frameNumber = frameNumber % this.keyFrames.length;
        return Math.floor(frameNumber);
    }
}

/** Game Loop and Initialization **/

window.main = function () {
    //Whatever your main loop needs to do.
    //setTimeout(function() {  
    //}, 1000 / 16);
    
    var deltaTime = (getTimeStamp() - SlugPug.LastTimeStamp)
    SlugPug.LastTimeStamp = getTimeStamp();
    SlugPug.DeltaTime = deltaTime;

    update(deltaTime);
    window.requestAnimationFrame( main );
};

main(); //Start the cycle.

function update(deltaTime) {
    SlugPug.Poop.stateTime += deltaTime;
    advanceDog(deltaTime);
    drawFrame();
    //if (window.anim != undefined)
    //    console.log(window.anim.getKeyFrame(deltaTime));
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