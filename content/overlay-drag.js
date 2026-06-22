function startDrag(e) {
    isDragging = true;
    overlayEl.classList.add("dragging");

    // Cache position when dragging starts.
    overlayW = overlayEl.offsetWidth;
    overlayH = overlayEl.offsetHeight;

    offsetX = e.clientX - posX;
    offsetY = e.clientY - posY;

    document.body.style.userSelect = "none";
}

function updatePosition() {
    const clamped = clampPosition(mouseX - offsetX, mouseY - offsetY);
    posX = clamped.x;
    posY = clamped.y;
    overlayEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

    rafId = null;
}

// Mouse events for dragging overlay.
document.addEventListener("mousemove", (e) => {
    if (!isDragging)
        return;

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
    }
});

document.addEventListener("mouseup", () => {
    if (!isDragging)
        return;

    isDragging = false;
    overlayEl.classList.remove("dragging");
    document.body.style.userSelect = "auto";

    // Flush any pending rAF so posX and posY have the latest mouse position.
    // Otherwise fast drags use wrong mouse positions.
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
        updatePosition();
    }

    reposition();
});