function createOverlay() {
    if (overlayEl) return;

    overlayEl = document.createElement("div");
    overlayEl.id = "joblens-overlay";

    const theme = getTheme();
    overlayEl.className = `joblens joblens--medium joblens--${theme}`;

    overlayEl.innerHTML = `
        <div class="joblens-header">
        <span class="joblens-title"> 🔍 JobLens </span>
            <button id="joblens-snap-toggle" class="joblens-snap-toggle" title="Disable corner snapping">📌</button>
        </div>
        <div class="joblens-experience">Loading...</div>
        <div class="joblens-section-title">Tech Stack</div>
        <div class="joblens-tech"></div>
    `;

    const header = overlayEl.querySelector(".joblens-header");
    header.addEventListener("mousedown", startDrag);

    const snapToggle = overlayEl.querySelector("#joblens-snap-toggle");
    // StopPropagation stops the "dragging" from starting.
    snapToggle.addEventListener("mousedown", (e) => e.stopPropagation())
    snapToggle.addEventListener("click", toggleSnap);

    loadPositionAndInit();
}

function updateOverlay(data) {
    const status = getExperienceStatus(data.experience, data.semantic);
    const theme = getTheme();

    overlayEl.classList.remove("joblens--good", "joblens--medium", "joblens--bad");
    overlayEl.classList.add(`joblens--${status.level}`);
    overlayEl.classList.add(`joblens--${theme}`);

    overlayEl.querySelector(".joblens-experience").textContent = status.label;
    overlayEl.querySelector(".joblens-tech").innerHTML = renderTechList(data.tech);

    // Content changed, re-measure and correct position.
    // overlayEl already exists but is not appended yet because asynchronous storage.
    if (document.body.contains(overlayEl)) {
        overlaH = overlayEl.offsetHeight;
        reposition();
    }
}

function renderTechList(tech) {
    return `
    <ul class="joblens-tech-list">
    ${tech.map(t => `
        <li>${t}</li>
      `).join("")}
    </ul>
    `;
}

// Not implemented / Needed for now.
function removeOverlay() {
    overlayEl?.remove();
    overlayEl = null;
}

function getExperienceStatus(experience, semanticScore) {
    if (!experience && semanticScore <= 0) {
        return {
            label: "No experience mentioned",
            level: "good"
        };
    }

    const min = experience?.min ?? 0;

    if (min > 2) {
        return {
            label: `${experience.min}-${experience.max ?? "+"} years`,
            level: "bad"
        };
    }

    if (min > 0) {
        return {
            label: `${experience.min}-${experience.max ?? "+"} years`,
            level: "medium"
        };
    }

    return {
        label: "Unclear experience",
        level: "medium"
    };
}

// Try to take the site's current theme.
// If it fails, use system default.
function getTheme() {
    const html = document.documentElement;

    const siteTheme = html.classList.contains("theme--dark");

    if (siteTheme !== null && siteTheme !== undefined) {
        return siteTheme ? "dark" : "light";
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
}