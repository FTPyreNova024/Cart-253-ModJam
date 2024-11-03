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
    size: 10,
    speed: 3
};

const firefly = {
    x: 0,
    y: 200, // Will be random
    size: 20,
    speed: 2,
    color: [255, 200, 0]
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(1000, 1000);

    // Give the fly and firefly its first random position
    resetFirefly();
    resetFly();
}

function draw() {
    background("#87ceeb");
    moveBug();
    drawBug();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    checkTongueFireflyOverlap();
    drawScore();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveBug() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }

    // Move the firefly
    firefly.x += firefly.speed;
    // Handle the firefly going off the canvas
    if (firefly.x > width) {
        resetFirefly();
    }
}

/**draws either of the bugs**/

function drawBug() {
    // Draw multiple bugs with a higher chance of fireflies
    for (let i = 0; i < 5; i++) {
        if (random() < 0.7) {
            drawFirefly();
        } else {
            drawFly();
        }
    }
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
//Draws the firefly as a red circle
function drawFirefly() {
    push();
    noStroke();
    fill(firefly.color);
    ellipse(firefly.x, firefly.y, firefly.size);
    pop();
}

/**
 * Resets the bug to the left with a random y and chooses between a regular fly and a firefly
 */
function resetFly() {
    // Spawn a regular fly
    fly.x = 0;
    fly.y = random(100, 800);
    fly.size = 10;
    fly.speed = 3;

}

function resetFirefly() {
    // Spawn a firefly
    firefly.x = 0;
    firefly.y = random(100, 800);
    firefly.size = 20;
    firefly.speed = 2;
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
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

function drawScore() {
    push();
    fill("#000000");
    textSize(40);
    text("FLIES CAUGHT: " + score, 30, 70);
    pop();
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}