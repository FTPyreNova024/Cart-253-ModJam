/**
 * Frogfrogfrog
 * Daniel Munoz C
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// CountDown Timer
let timer = 90; // 90 seconds

//Title screen
let gameState = "title";

//Scoreboard
let score = 0;

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 500,
        y: 1000,
        size: 300
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 1000,
        size: 40,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

// Our bugs
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 30,
    speed: 3
};

const spiceyFly = {
    x: 0,
    y: 200, // Will be random
    size: 15,
    speed: 10
};

const mosquito = {
    x: 1000,
    y: 200, // Will be random
    size: 10,
    speed: 7,
    color: [143, 98, 53]
};

const firefly = {
    x: 0,
    y: 200, // Will be random
    size: 20,
    speed: 4,
    color: [255, 200, 0]
};

const toxicFly = {
    x: 1000,
    y: 200, // Will be random
    size: 25,
    speed: 1
};

const illFly = {
    x: 1000,
    y: 200, // Will be random
    size: 20,
    speed: 4
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(1000, 1000);

    // Give the fly its first random position
    resetFly();

    // One minute and a half timer
    setInterval(() => {
        if (gameState === "game") {
            decrementTimer();
        }
    }, 1000);

}

/**
 * Draws the game and title screen
 */
function draw() {
    if (gameState === "title") {
        //Title screen
        drawTitleScreen();

    } else if (gameState === "instructions") {
        //Basic instructions of the game
        drawInstructions();

    } else if (gameState === "flies") {
        //Display types of flies
        drawTypesOfFlies();

    } else if (gameState === "scores") {
        //Display the scoreboard
        drawScoreBoard();

    } else if (gameState === "game") {
        //Game screen
        drawGameScreen();
    }
}
//Game screen
function drawGameScreen() {
    background("#87ceeb");
    push();
    fill(0, 0, 0);
    textSize(20);
    text("Press ESCAPE to go back and pause", 320, 50);
    pop();

    moveBug();
    drawBug();
    moveFrog();
    moveTongue();
    drawFrog();
    tongueOverlap();
    drawScore();
    drawTimer();
}

//Title screen

function drawTitleScreen() {
    push();
    background(25, 120, 11);
    textAlign(CENTER, CENTER);
    textSize(50);
    fill("#000000");
    text("Frogfrogfrog", width / 2, height / 2 - 100);
    textSize(30);
    text("Press ENTER to Start", width / 2, height / 2);
    textSize(30);
    text("Press SHIFT to see the scores", width / 2, height / 2 + 100);
    pop();
}

//Scoreboard screen
//draw the scores
function drawScoreBoard() {
    push();
    background(25, 120, 11);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill("#000000");
    text("Press ESCAPE to go back", width / 2, 200);
    textSize(50);
    text("Scores", width / 2, height / 2 - 200);
    textSize(30);
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    let latestScore = scores[scores.length - 1]; // Get the latest score
    scores.sort((a, b) => b - a); // Sort scores in descending order
    for (let i = 0; i < Math.min(scores.length, 10); i++) {
        if (scores[i] === latestScore) {
            text("latest", width / 2 - 100, height / 2 - 100 + i * 40); // Display "latest" before the score
        }
        text(`${i + 1}. ${scores[i]}`, width / 2, height / 2 - 100 + i * 40);
    }
    pop();
}

//Instructions screen

function drawInstructions() {
    push();
    background(25, 120, 11);
    textAlign(CENTER, CENTER);
    textSize(50);
    fill("#000000");
    text("Instructions", width / 2, height / 2 - 200);
    textSize(30);
    text("Move the frog with 'A' and 'D'", width / 2, height / 2 - 100);
    text("Catch the flies with your tongue by using 'W'", width / 2, height / 2 - 50);
    text("Press ENTER to continue", width / 2, height / 2 + 50);
    text("Press ESCAPE to go back", width / 2, height / 2 + 100);
    pop();
}

function drawTypesOfFlies() {
    push();
    background(25, 120, 11);
    textAlign(CENTER, CENTER);
    textSize(50);
    fill("#000000");
    text("Types of Flies", width / 2, height / 2 - 200);
    textSize(30);

    // Regular Fly
    text("Regular Fly: 1 point", width / 2, height / 2 - 100);
    push();
    noStroke();
    fill("#000000");
    ellipse(width / 2 - 150, height / 2 - 100, 30);
    pop();

    // Firefly
    text("Firefly: -1 point", width / 2, height / 2 - 50);
    push();
    noStroke();
    fill(firefly.color);
    ellipse(width / 2 - 120, height / 2 - 50, 20);
    pop();

    // Spicey Fly
    text("Spicey Fly: 4 points", width / 2, height / 2);
    push();
    noStroke();
    fill("#ff0000");
    ellipse(width / 2 - 150, height / 2, 15);
    pop();

    // Ill Fly
    text("Ill Fly: -4 points", width / 2, height / 2 + 50);
    push();
    noStroke();
    fill("#0000ff");
    ellipse(width / 2 - 130, height / 2 + 50, 20);
    pop();

    // Toxic Fly
    text("Toxic Fly: -1 point every 0.7 seconds", width / 2, height / 2 + 100);
    push();
    noStroke();
    fill(119, 255, 0);
    ellipse(width / 2 - 260, height / 2 + 100, 25);
    pop();

    // Mosquito
    text("Mosquito: +1 point every 0.7 seconds", width / 2, height / 2 + 150);
    push();
    noStroke();
    fill(mosquito.color);
    ellipse(width / 2 - 270, height / 2 + 150, 10);
    pop();

    text("Press ENTER to start the game", width / 2, height / 2 + 200);
    text("Press ESCAPE to go back", width / 2, height / 2 + 250);
    pop();
}
/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveBug() {
    // Move the fly
    fly.y += random(-5, 5);
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }

    // Move the firefly
    firefly.y += random(-2, 2);
    firefly.x += firefly.speed;
    // Handle the firefly going off the canvas
    if (firefly.x > width) {
        resetFirefly();
    }

    // Move the spicey fly
    spiceyFly.y += random(-10, 10);
    spiceyFly.x += spiceyFly.speed;
    // Handle the spicey fly going off the canvas
    if (spiceyFly.x > width) {
        resetSpiceyFly();
    }

    // Move the toxic fly
    toxicFly.y += random(-1, 1);
    toxicFly.x -= toxicFly.speed;
    // Handle the toxic fly going off the canvas
    if (toxicFly.x < 0) {
        resetToxicFly();
    }

    // Move the mosquito
    mosquito.y += random(-7, 7);
    mosquito.x -= mosquito.speed;
    // Handle the mosquito going off the canvas
    if (mosquito.x < 0) {
        resetMosquito();
    }

    // Move the illFly
    illFly.y += random(-2, 2);
    illFly.x -= illFly.speed;
    // Handle the illFly going off the canvas
    if (illFly.x < 0) {
        resetIllFly();
    }
}

/**Check if the bugs are caught by the tongue */
function tongueOverlap() {
    checkTongueFlyOverlap();
    checkTongueFireflyOverlap();
    checkTongueSpiceyFlyOverlap();
    checkTongueToxicFlyOverlap();
    checkTongueMosquitoOverlap();
    checkTongueIllFlyOverlap();
}

/**draws either of the bugs**/

function drawBug() {

    drawFirefly();
    drawFly();
    drawSpiceyFly();
    drawToxicFly();
    drawMosquito();
    drawIllFly();
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}
//Draws the firefly as a yellow circle
function drawFirefly() {
    push();
    noStroke();
    fill(firefly.color);
    ellipse(firefly.x, firefly.y, firefly.size);
    pop();
}

//Draws the spicey fly as a red circle
function drawSpiceyFly() {
    push();
    noStroke();
    fill("#ff0000");
    ellipse(spiceyFly.x, spiceyFly.y, spiceyFly.size);
    pop();
}

//Draws the toxic fly as a green circle
function drawToxicFly() {
    push();
    noStroke();
    fill(119, 255, 0);
    ellipse(toxicFly.x, toxicFly.y, toxicFly.size);
    pop();
}

//Draws the mosquito as a brown circle
function drawMosquito() {
    push();
    noStroke();
    fill(mosquito.color);
    ellipse(mosquito.x, mosquito.y, mosquito.size);
    pop();
}

//draws the illFly as a blue circle
function drawIllFly() {
    push();
    noStroke();
    fill("#0000ff");
    ellipse(illFly.x, illFly.y, illFly.size);
    pop();
}

/**
 * Resets the bug to the left with a random y and chooses between a regular fly and a firefly
 */
function resetFly() {
    // Spawn a regular fly
    fly.x = 0;
    fly.y = random(100, 800);
    fly.size = 30;
    fly.speed = 3;

}

function resetFirefly() {
    // Spawn a firefly
    firefly.x = 0;
    firefly.y = random(100, 800);
    firefly.size = 20;
    firefly.speed = 4;
}

function resetSpiceyFly() {
    // Spawn a spicey fly
    spiceyFly.x = 0;
    spiceyFly.y = random(100, 800);
    spiceyFly.size = 15;
    spiceyFly.speed = 10;
}

function resetToxicFly() {
    // Spawn a toxic fly
    toxicFly.x = 1000;
    toxicFly.y = random(100, 800);
    toxicFly.size = 25;
    toxicFly.speed = 1;
}

function resetMosquito() {
    // Spawn a mosquito
    mosquito.x = 1000;
    mosquito.y = random(100, 800);
    mosquito.size = 10;
    mosquito.speed = 7;
}

function resetIllFly() {
    // Spawn a illFly
    illFly.x = 1000;
    illFly.y = random(100, 800);
    illFly.size = 20;
    illFly.speed = 4;
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    if (keyIsDown(65)) { // 'A' key
        frog.body.x = max(frog.body.x - 10, 0);
    }
    if (keyIsDown(68)) { // 'D' key
        frog.body.x = min(frog.body.x + 10, width);
    }
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Increment the score
        score++;
    }
}

function checkTongueFireflyOverlap() {
    // Get distance from tongue to firefly
    const d = dist(frog.tongue.x, frog.tongue.y, firefly.x, firefly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + firefly.size / 2);
    if (eaten) {
        // Reset the firefly
        resetFirefly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Decrease the score
        score--;
    }
}

function checkTongueSpiceyFlyOverlap() {
    // Get distance from tongue to spicey fly
    const d = dist(frog.tongue.x, frog.tongue.y, spiceyFly.x, spiceyFly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + spiceyFly.size / 2);
    if (eaten) {
        // Reset the spicey fly
        resetSpiceyFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Increment the score
        score += 4;
    }
}

function checkTongueToxicFlyOverlap() {
    // Get distance from tongue to toxic fly
    const d = dist(frog.tongue.x, frog.tongue.y, toxicFly.x, toxicFly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + toxicFly.size / 2);
    if (eaten) {
        // Reset the toxic fly
        resetToxicFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Decrease the score through time
        let decrementInterval = setInterval(() => {
            score--;
        }, 700);

        setTimeout(() => {
            clearInterval(decrementInterval);
        }, 7000);
    }
}

function checkTongueMosquitoOverlap() {
    // Get distance from tongue to mosquito
    const d = dist(frog.tongue.x, frog.tongue.y, mosquito.x, mosquito.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + mosquito.size / 2);
    if (eaten) {
        // Reset the mosquito
        resetMosquito();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Increase the score
        let incrementInterval = setInterval(() => {
            score++;
        }, 700);

        setTimeout(() => {
            clearInterval(incrementInterval);
        }, 7000);
    }
}

function checkTongueIllFlyOverlap() {
    // Get distance from tongue to illFly
    const d = dist(frog.tongue.x, frog.tongue.y, illFly.x, illFly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + illFly.size / 2);
    if (eaten) {
        // Reset the illFly
        resetIllFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
        // Decrease the score
        score -= 4;
    }
}

// draws the scoreboad on the top left corner
function drawScore() {
    push();
    fill("#000000");
    textSize(40);
    text("POINTS: " + score, 30, 70);
    pop();
}

//CountDown Timer
function decrementTimer() {
    if (timer > 0) {
        timer--;
    } else {
        saveScore();
        gameState = "scores";
        timer = 90;
        score = 0;
    }
}

//draws the timer on the top right corner
function drawTimer() {
    push();
    fill("#000000");
    textSize(40);
    text("TIME LEFT: " + timer, 700, 70);
    pop();
}

/**
 * Saves the score to local storage
 */
function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
}

// Save the score when the timer reaches 0
if (timer === 0) {
    saveScore();
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function keyPressed() {
    if (key === 'w' && frog.tongue.state === "idle" && gameState === "game") {
        frog.tongue.state = "outbound";
    } else if (keyCode === ENTER && gameState === "title") {
        gameState = "instructions";
    } else if (keyCode === ENTER && gameState === "instructions") {
        gameState = "flies";
    } else if (keyCode === ENTER && gameState === "flies") {
        gameState = "game";
    } else if (keyCode === ESCAPE && gameState === "game") {
        gameState = "title";
    }

    if (keyCode === SHIFT && gameState === "title") {
        gameState = "scores";
    } else if (keyCode === ESCAPE && gameState === "scores") {
        gameState = "title";
    } else if (keyCode === ESCAPE && gameState === "instructions") {
        gameState = "title";
    } else if (keyCode === ESCAPE && gameState === "flies") {
        gameState = "instructions";
    }

}