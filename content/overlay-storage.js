// Persist overlay position and snapping status.
function savePosition() {
    chrome.storage.local.set({
        joblensPosX: posX,
        joblensPosY: posY,
        joblensSnapEnabled: snapEnabled
    });
}

function toggleSnap() {
    snapEnabled = !snapEnabled;

    const snapToggle = overlayEl.querySelector("#joblens-snap-toggle");
    snapToggle.textContent = snapEnabled ? "📌" : "📍";
    snapToggle.title = snapEnabled ? "Disable corner snapping" : "Enable corner snapping";
    overlayEl.classList.toggle("snap-disabled", !snapEnabled);

    if (snapEnabled)
        snapToCorner();
    else {
        // Need it here because of event order.
        savePosition();
    }
}

function loadPositionAndInit() {
    chrome.storage.local.get(["joblensPosX", "joblensPosY", "joblensSnapEnabled"],
        (result) => {
            snapEnabled = result.joblensSnapEnabled ?? true;

            if (result.joblensPosX != null && result.joblensPosY != null) {
                posX = result.joblensPosX;
                posY = result.joblensPosY;
            } else {
                posX = window.innerWidth - overlayW - 40;
                posY = 120;
            }

            document.body.appendChild(overlayEl);
            overlayH = overlayEl.offsetHeight;

            // Re-clamp now that we know real height.
            reposition();

            const snapToggle = overlayEl.querySelector("#joblens-snap-toggle");
            snapToggle.textContent = snapEnabled ? "📌" : "📍";
            overlayEl.classList.toggle("snap-disabled", !snapEnabled);

            // Reposition once the website finished loading all elements.
            setTimeout(() => {
                overlayH = overlayEl.offsetHeight;
                reposition();
            }, 500);
        }
    );
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area != "local")
        return;

    if ("joblensPosX" in changes && changes.joblensPosX.newValue === undefined) {
        snapEnabled = true;

        if (overlayEl) {
            overlayW = overlayEl.offsetWidth;
            overlayH = overlayEl.offsetHeight;

            posX = window.innerWidth - overlayW - snapMargin;
            posY = snapMargin;
            overlayEl.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
            savePosition();

            const snapToggle = overlayEl.querySelector("#joblens-snap-toggle");
            snapToggle.textContent = "📌";
            snapToggle.title = "Disable corner snapping";
            overlayEl.classList.remove("snap-disabled");
        }
    }
});