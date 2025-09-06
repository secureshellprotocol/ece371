let config = {
    WIDTH: 1920,
    HEIGHT: 900
};

// setup() is called once at page-load
function setup() {
    createCanvas(config.WIDTH, config.HEIGHT);
}

// draw() is called 60 times per second
function draw() {
    let hr = hour() % 12;
    let min = minute();
    let sec = second();

    if (sec == 0) {
        console.log("MINUTE " + min);
    }

    background(225);

    drawClockState(hr, min, sec);
    //textSize(32);
    //fill(180);
    //text(hr, 10, 30);
    //fill(100);
    //text(min, 10, 60);
    //fill(0);
    //text(sec, 10, 90);
}

// Given a time, draw a specific state of the wicks
function drawClockState(hr, min, sec) {
    // Number of active wicks, including the currently burning one
    let numActive = 12 - hr + 1;

    // Draw 12 evenly spaced wicks right-to-left
    for (let w = 0; w < numActive; w++) {
        // Calculate the offset from the left. We account for the total space
        // each candle takes, adding an offset to place it roughly in the center
        let offsetPercent = 100 * ( (12-w) / 12);
        if (w == numActive-1) {
            drawWick(min, sec, offsetPercent);
        } else {
            drawWick(0, 0, offsetPercent);
        }
    }
    console.log("drew " +numActive+" wicks.");
}

// Draws one wick at some percent offset from the left.
function drawWick(min, sec, horizOffsetPercent) {
    // convert relative measurements to pixels
    // place a 10% buffer on both sides of the canvas, then calculate the offset
    let buffer = config.WIDTH * 0.1
    let offset = (buffer * 8) * (horizOffsetPercent / 100);

    // calculate how much of the wick remains, in percent
    let percentRemaining = 1 - (((60 * min) + (sec)) / 3600);

    let c = color(51, 51, 0);
    fill(c);
    noStroke();
    rect(buffer + offset - 8, 0, 16, config.HEIGHT * 0.9 * percentRemaining);
}
