const webSocket = new WebSocket('ws://192.168.1.53:8080');

webSocket.onopen = function(evt) {
    console.log("socket opened")
}

webSocket.onerror = function(evt) {
    console.log("ws error", evt, this);
}

function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
    strokeWeight(4);
    stroke(0);
    fill(255);
    rect(0, 0, width, height)
    fill(0)
    if(touches.length > 0) {
        circle(touches[0].x, touches[0].y, 10);
        let pos = [touches[0].x/width, touches[0].y/height]
        webSocket.send(JSON.stringify(pos));
    }
    strokeWeight(.5);
    textSize(20);
    text("touches: "+touches.length, 20, 20)
}