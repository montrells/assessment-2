/*
var canvas = document.getElementById('canvas1');
var context = canvas.getContext("2d");
context.fillText("helloWorld", 10, 150);
 */

/*-----------------------------------------------------------------------------------
    Variables and Object
* -----------------------------------------------------------------------------------*/
//----------------------------------SOME GLOBAL VARIABLES
var score = 0;
var ghostScore = 0;
var countBlinkingEyes = 10;
var gHost= false;
var gHost2=false;

//-------------------------------------------------PLAYER OBJECT
var player = { //creating player object
    x:50,   //starting positions of the object
    y: 100,
    pacManMouth: 320,
    pacManDirection: 0, //will change
    pacSize: 32,  //Make pack man bigger or smaller dynamically, but its hard coded for now
    speed: 10
}
var ghost = {
    x:150,
    y: 200,
    speed: 2,
    moving: 0,
    directionX: 0,
    directionY: 0,
    flashing: 0,
    ghostEatUp: false
}
var ghost2 = {
    x:150,
    y: 200,
    speed: 2,
    moving: 0,
    directionX: 0,
    directionY: 0,
    flashing: 0,
    ghostEatUp: false
}
var powerPellet = {
    x:10,
    y:10,
    powerup:false,
    powerCountDown: 0,
    ghostNum: 0,
    ghostNum2: 0
}
//----------------------------------------------KEY CLICKING OBJECT
var keyclicking = {};
document.addEventListener("keydown", function(event) {
    keyclicking[event.keyCode]=true;
    //console.log(keyclicking)  <---this is for testing
    move(keyclicking);
},false);
document.addEventListener("keyup", function(event) {
    delete keyclicking[event.keyCode];
},false);

/*----------------------------------------------------------------------------
    Working with the canvas
* -----------------------------------------------------------------------------*/
var canvas = document.createElement("canvas"); //Creating an HTML element
var context = canvas.getContext("2d");  //rendering type of canvas
canvas.width = 800; //x   size of the canvas
canvas.height = 600; //y
/*---------------------------------------------------------*
   Working with IMAGES
/*---------------------------------------------------------*/
mainImage = new Image(); //creating a new Image
mainImage.ready = false;
mainImage.onload = checkReady; //loading the image from the images folder
mainImage.src= "images/pac.png"; //locates the image for use.

/*-------------------------------------------*/
// FUNCTIONS
/*------------------------------------------*/
function checkReady() {
    this.ready = true;
    playGame();  //play game function below

}
function playGame() {
    render();   //where content is output ..... it calls the function "render()" ...below...to render
    requestAnimationFrame(playGame) //keeps the game refreshed... looping
}

function myNum(num){ //for setting random ghost
    return Math.floor(Math.random() * num);
}

function render() {  //function creates image
    context.fillStyle = "black"; //changing the background to black
    context.fillRect(0, 0, canvas.width, canvas.height); //size of the canvas
    /*-------------------------POWER PELLET----------------------------------*/

    if(!powerPellet.powerup && powerPellet.powerCountDown < 5){
        powerPellet.x = myNum(420)+30; //adjusting the powerpellet's position
        powerPellet.y = myNum(250)+30;
        powerPellet.powerup = true;
    }

    if(powerPellet.powerup){
        context.fillStyle = "#ffffff"; //power pellet will be white
        context.beginPath() //going to start a path
        context.arc(powerPellet.x, powerPellet.y, 10,0, Math.PI * 2, true);  //creating a circle power pellet
        context.closePath(); //using coordinates above now ... close the path
        context.fill();  //filling the pellet
    }
    /*-------------------------------------------------------------------------------
    -----------------Ghost functionality--------------------------------------------------*/
    if(!gHost){ //if ghost don't exist... call out random ghosts
        ghost.ghostNum = myNum(5)*64;
        ghost.x = myNum(450); //random x position
        ghost.y = myNum(250)+ 30; //random y position ..down from top 30px on y axis
        gHost = true;
    }
    if(!gHost2){ //if ghost don't exist... call out random ghosts
        ghost2.ghostNum = myNum(5)*64;
        ghost2.x = myNum(450); //random x position
        ghost2.y = myNum(250)+ 30; //random y position ..down from top 30px on y axis
        gHost2 = true;
    }
    if(ghost.moving < 0){
        ghost.moving = (myNum(10)*3)+10 +myNum(2); //ghost moving random directions
        ghost.speed = myNum(1)+1; //ghost moving random speeds
        ghost.directionX = 0;
        ghost.directionY = 0;
        if(powerPellet.ghostEatUp) {ghost.speed=ghost.speed* -1;} //if this condition is true ghost will run away
        if(ghost.moving % 2){ //ghost random direction
            if(player.x < ghost.x){ghost.directionX = -ghost.speed;}else{ghost.directionX = ghost.speed;}
        }else{
            if(player.y < ghost.y){ghost.directionY = -ghost.speed;}else{ghost.directionY = ghost.speed;}
        }
    }
    ghost.moving --; //random patterns always moving near PacMan
    ghost.x = ghost.x + ghost.directionX;   //ghost moving right left
    ghost.y = ghost.y + ghost.directionY;    //ghost moving up and down

    if(ghost.x >= (canvas.width-32)) {ghost.x=0;}
    if(ghost.y >= (canvas.width-32)) {ghost.y=0;}
    if(ghost.x < 0){ghost.x=(canvas.width-32);}
    if(ghost.y < 0){ghost.y=(canvas.height-32);}
    /*-------------------------------------------------------GHOST2---------------NOT DRY---*/
    if(ghost2.moving < 0){
        ghost2.moving = (myNum(10)*3)+10 +myNum(2); //ghost moving random directions
        ghost2.speed = myNum(1)+1; //ghost moving random speeds
        ghost2.directionX = 0;
        ghost2.directionY = 0;
        if(powerPellet.ghostEatUp) {ghost2.speed=ghost2.speed* -1;} //if this condition is true ghost will run away
        if(ghost2.moving % 2){ //ghost random direction
            if(player.x < ghost2.x){ghost2.directionX = -ghost2.speed;}else{ghost2.directionX = ghost2.speed;}
        }else{
            if(player.y < ghost2.y){ghost2.directionY = -ghost2.speed;}else{ghost2.directionY = ghost2.speed;}
        }
    }
    ghost2.moving --; //random patterns always moving near PacMan
    ghost2.x = ghost2.x + ghost2.directionX;   //ghost moving right left
    ghost2.y = ghost2.y + ghost2.directionY;    //ghost moving up and down

    if(ghost2.x >= (canvas.width-32)) {ghost2.x=0;}
    if(ghost2.y >= (canvas.width-32)) {ghost2.y=0;}
    if(ghost2.x < 0){ghost2.x=(canvas.width-32);}
    if(ghost2.y < 0){ghost2.y=(canvas.height-32);}


    //---------------------GHOST EYES BLINKING...MOVING.....
    if (countBlinkingEyes>0){
        countBlinkingEyes--;}else {countBlinkingEyes=20; //slowing down the eys and the blinking... more realistic now

        if(ghost.flashing === 0){ghost.flashing = 32; ghost2.flashing = 32;} else{ghost.flashing = 0; ghost2.flashing = 0;}}

    /*---------------End Ghost--------------------------------------------*/

    /*------------------------------------------ Collision Detection----------------------------------*/

//-------------------Ghost collision detection
    if(player.x <= (ghost.x + 26)&& ghost.x <= (player.x+26) && player.y <= (ghost.y + 26) && ghost.y <= (player.y + 32)){
        console.log('ghost'); //Creating a larger hit area on the ghost
        if(powerPellet.ghostEatUp){
            score++; //score for the player goes up
        }else {
            ghostScore++; //score for the ghost goes up
        }

        player.x = 10;
        player.y = 100;
        ghost.x = 300;
        ghost.y = 200;
        powerPellet.powerCountDown=0;

    }
    if(player.x <= (ghost2.x + 26)&& ghost2.x <= (player.x+26) && player.y <= (ghost2.y + 26) && ghost2.y <= (player.y + 32)){
        console.log('ghost'); //Creating a larger hit area on the ghost
        if(powerPellet.ghostEatUp){
            score++; //score for the player goes up
        }else {
            ghostScore++; //score for the ghost goes up
        }

        player.x = 10;
        player.y = 100;
        ghost2.x = 300;
        ghost2.y = 200;
        powerPellet.powerCountDown=0;

    }
//Power up collision detection......
    if(player.x <= powerPellet.x && powerPellet.x <= (player.x+32) && player.y <= powerPellet.y && powerPellet.y <= (player.y + 32)){
        console.log('hit'); //detects when the pellet object is hit by the player
        powerPellet.powerup= false;
        powerPellet.powerCountDown = 500; //how long the ghost are eatable
        powerPellet.ghostNum= ghost.ghostNum; //to change the color
        powerPellet.ghostNum2= ghost2.ghostNum;
        ghost.ghostNum = 384;
        ghost2.ghostNum = 384;
        powerPellet.x=0;
        powerPellet.y=0;
        powerPellet.ghostEatUp = true;
        player.speed=20; // increasing the speed of the player
    }
    //--------------collision detection for power up..
    if(powerPellet.ghostEatUp){
        powerPellet.powerCountDown--;  //counts down until ghost gets its color back
        if(powerPellet.powerCountDown <= 0) {
            powerPellet.ghostEatUp = false;
            ghost.ghostNum = powerPellet.ghostNum;  // reverts back after above conditions are met
            ghost2.ghostNum = powerPellet.ghostNum2;
            player.speed=10;
        }
    }



    /*----------------------------------------------------------------------------*/


    context.font = "20px Verdana"; //changing font size and style
    context.fillStyle = "white";
    context.fillText("PacMan: " + score + "vs Ghost" + ghostScore, 2, 18);

    //drawing out the ghost
    context.drawImage(mainImage, ghost2.ghostNum, ghost2.flashing, 32, 32, ghost2.x, ghost2.y, 32, 32);
    context.drawImage(mainImage, ghost.ghostNum, ghost.flashing, 32, 32, ghost.x, ghost.y, 32, 32);//dynamic flashing
    //drawing out the PacMan
    context.drawImage(mainImage, player.pacManMouth, player.pacManDirection, 32, 32, player.x, player.y, 32, 32); //draws out the main image and moves image around the page //can also size the image(mainImage,10, 10, 400, 400)position/size  //(image, 40,0, 60,115 ,10,10, 200,100) granular selection 8 in total, last 2 is size

}
/*---------------------------------------PacMan-----------------------------------------*/
function move(keyclicking){ //moves the player
    if(37 in keyclicking){player.x-= player.speed; player.pacManDirection=64;} //going left
    if(38 in keyclicking){player.y-= player.speed; player.pacManDirection=96;} //going up
    if(39 in keyclicking){player.x+= player.speed; player.pacManDirection=0;}  //going right
    if(40 in keyclicking){player.y+= player.speed; player.pacManDirection=32;}// going down
    //player.x++ for testing using "console.log()" ... 37 displays after pressing the left arrow on the keyboard...
    //-------------------------------keeping players in the game from staying off the page
    if(player.x >= (canvas.width-32)) {player.x=0;}
    if(player.y >= (canvas.width-32)) {player.y=0;}
    if(player.x < 0){player.x=(canvas.width-32);}
    if(player.y < 0){player.y=(canvas.height-32);}
    //-------------------------------------flips through the Pacman mouth images giving its location
    if(player.pacManMouth === 320){player.pacManMouth = 352;} else{player.pacManMouth = 320;}


    render();
}
/*
****************************************************************************
*/
document.body.style.backgroundImage = "url('http://images1.wikia.nocookie.net/__cb20100925112354/pacman/images/9/90/Pacman.jpg')";
document.body.appendChild(canvas); //loads this js to the body of the HTML tags
//context.fillText("helloWorld", 10, 150);
