const context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 400;
context.canvas.width = 1220;

// Start the grame count at 1 (also level 1)
let frameCount = 1;

// Set the number of obstacles to match the current "level" number
let obCount = frameCount;

// Create a collection to hold the randomly generated x coordinates
const obXCoors = [];

// Player
const square = {
    height: 32,
    jumping: true,
    width: 32,
    x: 0,
    xVelocity: 0,
    y:0,
    yVelocity:0
};

// Controller
const controller = {
    left: false,
    right: false,
    up: false,

    keyListener: function (event){
         let key_state = (event.type == "keydown") ? true : false;

         switch (event.keyCode){
             case 65: // A key
                controller.left = key_state;
                break;
            case 87: // W key
                controller.up = key_state;
                break;
            case 68: // D key
                controller.right = key_state;
                break;
         }
    }
};

const loop = function(){
    if(controller.up && square.jumping == false) {
        square.yVelocity -= 20;
        square.jumping = true;
    }

    if(controller.left) {
        square.xVelocity -= 0.5;
    }

    if(controller.right) {
        square.xVelocity += 0.5;
    }
    // Gravity/Friction Elements (come back and study this)
    square.yVelocity += 1.5; //gravity
    square.x += square.xVelocity;
    square.y += square.yVelocity;
    
    square.xVelocity *= 0.9; //friction
    square.yVelocity *= 0.9; //friction
    
    // if the square is falling below floor line, then:
    if(square.y > 386 - 16 - 32){
        square.jumping = false;
        square.y = 386 - 16 - 32;
        square.yVelocity = 0;
    }
    
    // This sets up the player to come back on the left side of the screen when exiting from the right side
    if(square.x < -20) {
        square.x = 1220;
    } else if (square.x > 1220) { // if the square goes off the right boundary
        square.x = -20

        nextFrame();
    }

    // Creates the backdrop for each frame
    context.fillStyle = "#201A23";
    context.fillRect(0, 0, 1220, 400); // x, y, width, height

    // Creates and fills the cube for each frame
    context.fillStyle = "#8DAA9D"; // hex for cube color
    context.beginPath();
    context.rect(square.x, square.y, square.width, square.height);
    context.fill();

    // Create the obstacles for each frame
    // Set the standard obstacle height
    const height = 200 * Math.cos(Math.PI / 6);
    context.fillStyle = "FBF5F3"; //hex for triangle color
    obXCoors.forEach((obXCoor) => {
        context.beginPath();
        // (x = random, y = coor. on "ground")
        context.moveTo(obXCoor, 385);

        // (x = ^random + 20, y = coor. on "ground")
        context.lineTo(obXCoor + 20, 385);

        // (x = ^random + 10, y = peak of triangle)
        context.lineTo(obXCoor + 10, 510 - height);

        context.closePath();
        context.fill()
    });
    // Creates the "ground" for each frame
    context.strokeStyle = "#2E2532";
    context.lineWidth = 30;
    context.beginPath();
    context.moveTo(0, 385);
    context.stroke();

    //Updates when called to tell the browser it is ready to draw again
    window.requestAnimationFrame(loop);
    //It is a rule of the requestAnimationFrame method that the callback you pass to it must have requestAnimationFrame called within itself (if you want to animate another frame at the next repaint).
};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);

window.requestAnimationFrame(loop);

// Create obstacles for each frame

const nextFrame = () => {
    //increase the frame/level count
    frameCount++;
    for(let i = 0; i < obCount; i++ ){
        // Randomly generate the x coordinate for the top corner start of each triangle
        obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);

        obXCoors.push(obXCoor);
    }
}