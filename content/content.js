let observer = null;

// Check when page loads.
chrome.storage.local.get("joblensEnabled",
    (result) => {
        if (result.joblensEnabled) {
            startObserving();
        }
        else {
            stopObserving();
        }
    });

// Listen for a message from toggler.
chrome.runtime.onMessage.addListener((message) => {
    if (message.enabled === true) {
        startObserving();
    }
    else {
        stopObserving();
    }
});

function startObserving() {
    let timer = null;

    createOverlay();

    // Initial scan of the page.
    handleJobText();

    // Observe the entire document.body with a debouncer.
    // Check for mutation in overlayEl -> don't need to fire observer.
    observer = new MutationObserver((mutations) => {
        let hasExternalMutation = mutations.some(m => !overlayEl.contains(m.target));
        clearTimeout(timer);

        timer = setTimeout(() => {
            if (hasExternalMutation) {
                handleJobText();
            }
        }, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function stopObserving() {
    observer?.disconnect();
    removeOverlay();
}

function handleJobText() {
    let text = preprocess(getJobDescriptionNode().textContent);

    // Safeguard against unloaded DOM elements.
    if (!text || text.trim().length < 100)
        return;

    // Tests each extracted line against each regex.
    const lines = getExperienceSentences(text);
    let bestMatch = null;
    // Infinity is nothing, takes first score meaning currently no candidate is exists yet. When using 0 I imply another candidate exists.
    let bestScore = -Infinity;
    const min_Acceptable_Score = 2;

    for (const line of lines) {
        const numeric = extractNumericExperience(line);
        if (!numeric)
            continue;

        const score = scoreLine(line);

        // console.log("Line: ", line);
        console.log("Score: ", score);

        if (score > bestScore) {
            bestScore = score;
            bestMatch = numeric;
        }
    }

    if (bestScore < min_Acceptable_Score)
        bestMatch = null;

    // Semantic needs broader perspective.
    const semantic = estimateExperienceLevel(text);

    console.log("Numeric experience:", bestMatch);
    console.log("Semantic experience score:", semantic);

    const tech = extractTechStack(text);

    updateOverlay({ experience: bestMatch, semantic, tech });
}

// Score each extracted line to improve confidence.
function scoreLine(line) {
    let score = 0;
    const lower = line.toLowerCase();
    const scoringRules = [
        {
            score: 4,
            keywords: ["experience", "ervaring", "werkervaring", "hands-on"]
        },
        {
            score: 3,
            keywords: ["you have", "je hebt", "ideal candidate", "we are looking for"]
        },
        {
            score: -3,
            keywords: ["years ago", "last", "jaren geleden", "al meer dan"]
        },
        {
            score: -2,
            keywords: ["company", "our", "ons"]
        }
    ];

    for (const rule of scoringRules) {
        for (const kw of rule.keywords) {
            if (lower.includes(kw)) {
                score += rule.score;
                // Prevents counting the same rule twice.
                break;
            }
        }
    }

    return score;
}