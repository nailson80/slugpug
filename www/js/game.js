var SlugPug = SlugPug || {};

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
    
    SlugPug.Sprite = function(img, x, y, width, height) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };
    
    SlugPug.drawSrite = function(context, sprite, x, y) {
        context.drawImage(sprite.img, sprite.x, sprite.y, sprite.width, sprite.height, x, y, sprite.width, sprite.height);
    }
    
    var dogBody = new SlugPug.Sprite(dogSprites,0,0,50,50);
    
    //context.drawImage(dogSprites,dogBody.x,dogBody.y,dogBody.width,dogBody.height,100,100,50,50);
    SlugPug.drawSrite(context, dogBody, 0, 0);
    SlugPug.drawSrite(context, dogBody, 50, 0);
    SlugPug.drawSrite(context, dogBody, 100, 0);
    SlugPug.drawSrite(context, dogBody, 150, 0);
    SlugPug.drawSrite(context, dogBody, 200, 0);
    SlugPug.drawSrite(context, dogBody, 250, 0);
    SlugPug.drawSrite(context, dogBody, 300, 0);
    
});

window.onkeyup = function(evt) {
    console.log(evt);
};
