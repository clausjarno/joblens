let overlayEl = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let mouseX = 0;
let mouseY = 0;
let posX = 0;
let posY = 0;
let rafId = null;

const snapMargin = 16;
let overlayW = 320;
let overlayH = 0;

// Default snapping overlay is enabled.
let snapEnabled = true;