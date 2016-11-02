/** Slug Pug Namespace **/

var SlugPug = SlugPug || {
    Initialized: false,
    GameState: null,
    Score: 0,
    ScoreIncrement: 10,
    Context: null,
    AudioClips: {
        collect: null,
        poop: null
    },
    Sprites: {
        Body: null,
        Head: [],
        Tail: [],
        Poop: [],
        Treats: []
    },
    Animations: {
        Poop: null,
        Head: null,
        Tail: null,
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
    drawRotatedSprite: function(sprite, x, y, angle) {
        var TO_RADIANS = Math.PI/180;
        SlugPug.Context.save();
        SlugPug.Context.translate((x * sprite.width)+sprite.width/2, (y * sprite.height) + sprite.height/2);
        SlugPug.Context.rotate(angle * TO_RADIANS);
        
        SlugPug.Context.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, 
                                  -sprite.width/2, -sprite.height/2, 
                                  sprite.width, sprite.height);
        
        //SlugPug.Context.rotate(-angle * TO_RADIANS);
        //SlugPug.Context.translate(-(x * sprite.width)-sprite.width/2, -(y * sprite.height) - sprite.height/2);
        
        SlugPug.Context.restore();
        
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
    
    // Create sprites for the treats
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,0,0,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,50,0,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,0,50,50,50));
    SlugPug.Sprites.Treats.push(new SlugPug.Sprite(treatSprites,50,50,50,50));
    
    // Create sprites for the poop animation
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,0,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,50,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,100,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,150,0,50,50));
    SlugPug.Sprites.Poop.push(new SlugPug.Sprite(poopSprites,200,0,50,50));
    
    // Create sprites for the head animation
    SlugPug.Sprites.Head.push(new SlugPug.Sprite(dogSprites,50,0,50,50));
    SlugPug.Sprites.Head.push(new SlugPug.Sprite(dogSprites,100,0,50,50));
    SlugPug.Sprites.Head.push(new SlugPug.Sprite(dogSprites,0,50,50,50));
    SlugPug.Sprites.Head.push(new SlugPug.Sprite(dogSprites,50,50,50,50));
    SlugPug.Sprites.Head.push(new SlugPug.Sprite(dogSprites,100,50,50,50));
    
    // Create sprites for the tail animation
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,0,100,50,50));
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,50,100,50,50));
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,100,100,50,50));
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,150,100,50,50));
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,0,150,50,50));
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,50,150,50,50));
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,100,150,50,50));
    SlugPug.Sprites.Tail.push(new SlugPug.Sprite(dogSprites,150,150,50,50));
    
    SlugPug.Sprites.Body = dogBody;
    SlugPug.Background = bgImg;
    
    SlugPug.CurrentDirection = SlugPug.Direction.Left;
    SlugPug.PreviousDirection = SlugPug.Direction.Left;
    
    SlugPug.Animations.Poop = new SlugPug.Animation(.15, SlugPug.Sprites.Poop);
    SlugPug.Animations.Head = new SlugPug.Animation(.2, SlugPug.Sprites.Head);
    SlugPug.Animations.Tail = new SlugPug.Animation(.2, SlugPug.Sprites.Tail);
    
    // Create sound effects
    SlugPug.AudioClips.collect = new Audio("audio/bark.ogg");
    SlugPug.AudioClips.poop = new Audio("audio/stinky.ogg");
    
    SlugPug.GameState = SlugPug.gameStates().Paused;
    SlugPug.LastTimeStamp = getTimeStamp();
    SlugPug.Initialized = true;
    
    // Now that everything is initialized, start the main loop
    main();
}

function drawFrame() {
    if (!SlugPug.Initialized) return;
    
    SlugPug.Context.clearRect(0,0,SlugPug.Grid.width,SlugPug.Grid.height);
    SlugPug.Context.drawImage(SlugPug.Background,0,0);
    
    // Draw Treat
    SlugPug.drawSprite(SlugPug.Sprites.Treats[0],SlugPug.Treat.x, SlugPug.Treat.y);
    SlugPug.drawRotatedSprite(SlugPug.Sprites.Treats[1],1,0,45);
    
    // Draw Poop Animation
    if (SlugPug.Animations.Poop != null) {
        var f = SlugPug.Animations.Poop.getKeyFrame(SlugPug.Poop.stateTime);
        SlugPug.drawSprite(SlugPug.Sprites.Poop[f], SlugPug.Poop.x, SlugPug.Poop.y);
    }
    
    // Draw Head Animation
    if (SlugPug.Animations.Head != null) {
        var f = SlugPug.Animations.Head.getKeyFrame(SlugPug.Poop.stateTime);
        SlugPug.drawSprite(SlugPug.Sprites.Head[f], SlugPug.BodyParts[0][0], SlugPug.BodyParts[0][1]);
    }
    
    // Draw Tail Animation
    if (SlugPug.Animations.Tail != null) {
        var lastPos = SlugPug.BodyParts.length - 1;
        var f = SlugPug.Animations.Tail.getKeyFrame(SlugPug.Poop.stateTime);
        //SlugPug.drawSprite(SlugPug.Sprites.Tail[f], SlugPug.BodyParts[lastPos][0], SlugPug.BodyParts[lastPos][1]);
        SlugPug.drawRotatedSprite(SlugPug.Sprites.Tail[f], SlugPug.BodyParts[lastPos][0], SlugPug.BodyParts[lastPos][1], getTailRotation());
    }
    
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

function getTailRotation() {
    var rotation = 0;
    var partCount = SlugPug.BodyParts.length;
    var tailPos = SlugPug.BodyParts[partCount-1];
    var endPos = SlugPug.BodyParts[partCount-2];
    
    var tX = tailPos[0] - endPos[0];
    var tY = tailPos[1] - endPos[1];
    
    if (tX == 0 && tY == 1) {
        //tailDirection = TailDirection.Down;
        rotation = 0;
    }
    if (tX == 0 && tY == -1) {
        //tailDirection = TailDirection.Up;
        rotation = 180;
    }
    if (tX == 1 && tY == 0) {
        //tailDirection = TailDirection.Left;
        rotation = -90;
    }
    if (tX == -1 && tY == 0) {
        //tailDirection = TailDirection.Right;
        rotation = 90;
    }
    
    return rotation;
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
            SlugPug.AudioClips.collect.play();
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

function update(deltaTime) {
    SlugPug.Poop.stateTime += deltaTime;
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