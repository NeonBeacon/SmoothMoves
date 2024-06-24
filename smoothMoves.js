const track = document.getElementById("image-track");

let mouseDownAt = 0,
    prevPercentage = 0,
    percentage = 0,
    velocity = 0,
    animationFrameId,
    isMouseDown = false;

// Initialize the track position on page load
window.onload = () => updateTrackAndImages(0, 0);

window.onmousedown = e => {
    isMouseDown = true;
    mouseDownAt = e.clientX; // Store the X position of the mouse when pressed down
    cancelAnimationFrame(animationFrameId); // Cancel any ongoing inertia animation
};

window.onmouseup = () => {
    isMouseDown = false;
    applyInertia(); // Apply inertia on mouse up
};

window.onmousemove = e => {
    if (!isMouseDown) return; // Do nothing if the mouse is not pressed down

    const mouseDelta = e.clientX - mouseDownAt; // Calculate the change in mouse position
    mouseDownAt = e.clientX; // Update the last mouse X position
    updateTrackAndImages(mouseDelta);
};

window.onwheel = e => {
    if (e.deltaX === 0) return; // Only handle horizontal scroll
    const scrollAmount = e.deltaX * 0.02; // Increase the multiplier for a faster scroll
    updateTrackAndImages(scrollAmount, false);
};


function updateTrackAndImages(delta, isMouseMove = true) {
    const maxDelta = window.innerWidth / 2; // Maximum change in position, using half the window's width
    const scrollSpeed = 0.2; // Adjust this value to control the speed of scrolling

    if (isMouseMove) {
        velocity = (delta / maxDelta) * 100 * scrollSpeed; // Calculate the velocity based on mouse movement
        percentage = Math.min(Math.max(prevPercentage + velocity, -100), 0); // Constrain percentage between -100 and 0
        prevPercentage = percentage; // Update prevPercentage for the next frame
    } else {
        prevPercentage = percentage; // Store the current percentage for future reference
        percentage = Math.min(Math.max(prevPercentage - delta, -100), 0); // Constrain percentage between -100 and 0
    }

    track.style.transform = `translate(${percentage}%, -50%)`; // Move the track

    // Loop through each image in the track
    const images = track.getElementsByClassName("image");
    const totalImages = images.length;
    for (let i = 0; i < totalImages; i++) {
        const imageParallaxSpeed = ((totalImages - i) * 0.3) + 0.9; // Adjust the values to control the speed
        const delayFactor = (i / totalImages) * -100; // Adjust this value to control the delay
        const imageNextPosition = percentage * imageParallaxSpeed - delayFactor;
        const clampedPosition = Math.max(-100, Math.min(100, 100 + imageNextPosition)); // Constrain position between -100 and 100
        images[i].style.objectPosition = `${clampedPosition}% center`; // Apply the position
    }
}

function applyInertia() {
    const friction = 0.96; // Adjust this value to control the inertia friction
    if (Math.abs(velocity) < 0.01) return; // Stop the animation when the velocity is very low

    velocity *= friction; // Apply friction to the velocity
    percentage = Math.min(Math.max(prevPercentage + velocity, -100), 0); // Update the percentage based on the velocity
    prevPercentage = percentage; // Update the previous percentage for the next frame

    updateTrackAndImages(0, false); // Update the track and images
    animationFrameId = requestAnimationFrame(applyInertia); // Continue the inertia animation
}
