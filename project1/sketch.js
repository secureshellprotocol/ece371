let config = {
    WIDTH: 1280,
    HEIGHT: 600
};

let state = {
    minute_change_chime: 0,
    minute_change_opacity: 150,
    recharge: 0
};

// maps hour -> number of active wicks
const staticWickMap = [1, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

// setup() is called once at page-load
function setup() {
    createCanvas(config.WIDTH, config.HEIGHT);
}

// draw() is called 60 times per second
function draw() {
    let hr = (hour() % 12);
    let min = minute();
    let sec = second();

    background(50);

    drawClockState(hr, min, sec);
}

// Given a time, draw a specific state of the wicks.
function drawClockState(hr, min, sec) {
    // Number of active wicks, including the currently burning one
    let numActive = staticWickMap[hr];

    // If its a new minute, prep the chime!
    if (sec == 0 && state.minute_change_chime == 0) {
        console.log("MINUTE "+ min);
        state.minute_change_chime = 1;
    }

    // if we're rolling over from hr 12 -> 1, 'recharge'
    if (numActive == 12 && min == 0 && sec == 0) {
        state.recharge = 450;
        return
    }

    // the end of a wick 'chimes' for one second when we go to the next minute
    if (state.minute_change_chime == 1) {
        // over one second, fade out to zero opacity. This implicitly relies on
        // this function being called 60 times a second!
        state.minute_change_opacity -= (150 / 60);

        // after the second passes, disable the chime and reset
        if (sec == 1) {
            state.minute_change_chime = 0;
            state.minute_change_opacity = 150;
        }
    }

    // Draw 12 evenly spaced wicks right-to-left
    for (let w = 0; w < 12; w++) {
        // Calculate the offset from the left. We account for the total space
        // each candle takes, adding an offset to place it roughly in the center
        let offsetPercent = 100 * ( (12-w) / 12);

        if (state.recharge == 0) {
            if (w == numActive-1) {   // last wick, getting 'consumed'
                drawWick(min, sec, offsetPercent, 1);
            } else if (w < numActive) {
                drawWick(0, 0, offsetPercent, 0);
            } else {
                drawWick(60, 60, offsetPercent, 0);
            }
        } else {    // recharge routine
            state.minute_change_chime = 1;
            drawWick(((state.recharge / 5) | 0), 0, offsetPercent, 1);
            state.recharge--;
        }

    }
    console.log("drew " +numActive+" wicks.");
}

// Draws one wick at some percent offset from the left. if we are 'noisy', we
// chime if it's a new minute.
function drawWick(min, sec, horizOffsetPercent, noisy) {
    // convert relative measurements to pixels
    // place a 10% buffer on both sides of the canvas, then calculate the offset
    let buffer = config.WIDTH * 0.1
    let offset = (buffer * 8) * (horizOffsetPercent / 100);

    // calculate how much of the wick remains, in percent
    let percentRemaining = 1 - (((60 * min) + (sec)) / 3600);

    // chime if we have to
    if (state.minute_change_chime == 1 && noisy == 1) {
        let bell_color = color(191, 191, 0);
        bell_color.setAlpha(state.minute_change_opacity);
        fill(bell_color);
        circle(buffer + offset, config.HEIGHT * 0.9 * percentRemaining, 30);
    }

    // draw the wick
    let c = color(225, 225, 225);
    fill(c);
    noStroke();
    rect(buffer + offset - 4, 0, 8, config.HEIGHT * 0.9 * percentRemaining);

    // draw the base
    let basec = color(205,133,63);
    fill(basec);
    ellipse(buffer + offset, 0, 30, 6);
}
