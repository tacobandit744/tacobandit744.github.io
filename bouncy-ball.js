
// Initial positions & speed
let velocityX = 0.15;
let velocityY = 0.1;

let circlePosX = 75;
let circlePosY = 75;

// how big the ball is, in pixels
const circleRadius = 50;

// the bigger the number, the faster the ball goes down naturally
const gravity = 0.001;
// the smaller the number, the faster you throw
const throwSpeed = 22;
// the bigger the number, the faster the ball stops
const airResistance = 0.0005;

let previousTime = performance.now();

let paused = false;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawBall(){
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(circlePosX , circlePosY, circleRadius, 0, Math.PI * 2, true)
    ctx.fill();
}

function putBallAtCursor(ev){
    const rect = canvas.getBoundingClientRect();
    circlePosX = Math.max(Math.min(ev.clientX - rect.left, canvas.width - circleRadius), circleRadius);
    circlePosY = Math.max(Math.min(ev.clientY - rect.top, canvas.height - circleRadius), circleRadius);
}

function draw(tFrame) {
    const delta = tFrame - previousTime;
    previousTime = tFrame;

    ctx.fillStyle = "rgb(255 255 255 / 30%)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(!paused) {
        circlePosX += velocityX * delta;
        circlePosY += velocityY * delta;
        // bounce
        if (circlePosX > canvas.width - circleRadius) {
            velocityX = -velocityX;
            circlePosX = canvas.width - circleRadius;
        }
        if (circlePosY > canvas.height - circleRadius) {
            velocityY = -velocityY;
            circlePosY = canvas.height - circleRadius;
        }
        if (circlePosX < circleRadius) {
            velocityX = -velocityX;
            circlePosX = circleRadius;
        }
        if (circlePosY < circleRadius) {
            velocityY = -velocityY;
            circlePosY = circleRadius;
        }
        velocityY += gravity * delta;
        velocityY -= airResistance * velocityY * delta;
        velocityX -= airResistance * velocityX * delta;
    }
    drawBall();
    window.requestAnimationFrame(draw);
}
canvas.addEventListener("mousedown", (ev) =>{
    paused = true;
    putBallAtCursor(ev);
});
canvas.addEventListener("mouseup", () =>{
    paused = false;
});
canvas.addEventListener("mousemove", (ev)=>{
    if ((ev.buttons & 1) === 1){
        putBallAtCursor(ev);
        velocityX = ev.movementX / throwSpeed;
        velocityY = ev.movementY / throwSpeed;
    }
})
window.requestAnimationFrame(draw);
