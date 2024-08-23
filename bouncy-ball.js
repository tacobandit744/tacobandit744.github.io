window.addEventListener("DOMContentLoaded", (()=> {
    // Initial positions & speed
    let velocityX = 0.15;
    let velocityY = 0.1;

    let circlePosX = 75;
    let circlePosY = 75;

    // how big the ball is, in pixels
    const circleRadius = 50;

    // the bigger the number, the faster the ball goes down naturally
    const gravity = 0.001;
    // the bigger the number, the faster you throw
    const throwSpeed = 0.05;
    // for some reason touch controls are way more sensitive
    const touchThrowSpeed = 0.005;
    // the bigger the number, the faster the ball stops
    const airResistance = 0.0005;

    // simulation resolution, 1/fps * 1000, 8 ~= 120fps
    const speedIndex = 8;

    // how many ms of lag are allowed before skipping
    // too big may cause a lot of lag when resuming
    // too small may cause the ball to freeze when at low fps
    const tickLimit = 300;

    let previousTime;

    let paused = false;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    function drawBall() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(circlePosX, circlePosY, circleRadius, 0, Math.PI * 2, true)
        ctx.fill();
    }

    function putBallAtCursor(ev) {
        const rect = canvas.getBoundingClientRect();
        circlePosX = Math.max(Math.min(ev.clientX - rect.left, canvas.width - circleRadius), circleRadius);
        circlePosY = Math.max(Math.min(ev.clientY - rect.top, canvas.height - circleRadius), circleRadius);
    }
    function doTick(){
        if (!paused) {
            circlePosX += velocityX * speedIndex;
            circlePosY += velocityY * speedIndex;
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
            velocityY += gravity * speedIndex;
            velocityY -= airResistance * velocityY * speedIndex;
            velocityX -= airResistance * velocityX * speedIndex;
        }
    }

    function draw(tFrame) {
        let delta = tFrame - previousTime;
        ctx.fillStyle = "rgb(255 255 255 / 30%)"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if(delta > speedIndex){
            previousTime = tFrame;
        }
        if(delta < tickLimit) {
            while (delta > speedIndex) {
                doTick();
                delta -= speedIndex;
            }
        }
        drawBall();
        window.requestAnimationFrame(draw);
    }

    canvas.addEventListener("mousedown", (ev) => {
        paused = true;
        putBallAtCursor(ev);
        velocityX = 0;
        velocityY = 0;
    });
    canvas.addEventListener("mouseup", () => {
        paused = false;
    });
    canvas.addEventListener("mousemove", (ev) => {
        if ((ev.buttons & 1) === 1) {
            putBallAtCursor(ev);
            velocityX = ev.movementX * throwSpeed;
            velocityY = ev.movementY * throwSpeed;
        }
    })
    let currentTouch = null;
    let currentTouchX = 0;
    let currentTouchY = 0;
    canvas.addEventListener("touchstart", (ev) => {
        // only react to touch if not already tracking one
        if (currentTouch === null) {
            ev.preventDefault();
            paused = true;
            const touch =
                ev.targetTouches.length >= 1
                    ? ev.targetTouches.item(0)
                    : ev.touches.item(0);
            currentTouch = touch.identifier;
            currentTouchX = touch.clientX;
            currentTouchY = touch.clientY;
            putBallAtCursor(touch);
            velocityX = 0;
            velocityY = 0;
        }
    })
    canvas.addEventListener("touchend", (ev) => {
        for (let i = 0; i < ev.changedTouches.length; i++) {
            const touch = ev.changedTouches[i];
            if (touch.identifier === currentTouch) {
                ev.preventDefault();
                paused = false;
                currentTouch = null;
            }
        }
    });
    canvas.addEventListener("touchcancel", (ev) => {
        for (let i = 0; i < ev.changedTouches.length; i++) {
            const touch = ev.changedTouches[i];
            if (touch.identifier === currentTouch) {
                ev.preventDefault();
                paused = false;
                currentTouch = null;
            }
        }
    });
    canvas.addEventListener("touchmove", (ev) => {
        for (let i = 0; i < ev.changedTouches.length; i++) {
            const touch = ev.changedTouches[i];
            if (touch.identifier === currentTouch) {
                ev.preventDefault();
                putBallAtCursor(touch);
                velocityX = (touch.clientX - currentTouchX) * touchThrowSpeed;
                velocityY = (touch.clientY - currentTouchY) * touchThrowSpeed;
            }
        }
    })
    function zero(tFrame){
        previousTime = tFrame;
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(zero);
}));
