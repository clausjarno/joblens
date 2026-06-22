// Helper function for clamping.
function clampPosition(x, y) {
    const maxX = window.innerWidth - overlayW;
    const maxY = window.innerHeight - overlayH;

    return {
        x: Math.min(Math.max(x, 0), maxX),
        y: Math.min(Math.max(y, 0), maxY)
    }
}

// Snapping Overlay
function snapToCorner() {
    if (!snapEnabled)
        return;

    const centerX = posX + overlayW / 2;
    const centerY = posY + overlayH / 2;

    const isLeft = centerX < window.innerWidth / 2;
    const isTop = centerY < window.innerHeight / 2;

    posX = isLeft ? snapMargin : window.innerWidth - overlayW - snapMargin;
    posY = isTop ? snapMargin : window.innerHeight - overlayH - snapMargin;

    overlayEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    savePosition();
}

// Helper function for repositioning when resizing/focusing.
function reposition() {
    if (!overlayEl)
        return;

    if (snapEnabled)
        snapToCorner();
    else {
        const clamped = clampPosition(posX, posY);
        posX = clamped.x;
        posY = clamped.y;
        overlayEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        savePosition();
    }
}

window.addEventListener("resize", () => {
    if (!overlayEl)
        return;
    overlayW = overlayEl.offsetWidth;
    overlayH = overlayEl.offsetHeight;
    reposition();
})

// Resize never fires if the user moves the browser window onto a smaller display.
window.addEventListener("focus", () => {
    reposition();
})