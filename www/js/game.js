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
        
    }
    
    context.drawImage(dogSprites,0,0,50,50,100,100,50,50);
    
});
