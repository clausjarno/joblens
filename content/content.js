createOverlay();

let lastJobId = null;

// Observe changes to DOM element, run function if something changed.
const targetNode = document.querySelector(".jobs-search__job-details--wrapper");

if (targetNode) {
    const observer = new MutationObserver(() => {
        handleJobChange();
    });

    observer.observe(targetNode, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

function handleJobChange() {
    let text = preprocess(getJobDescription());

    // Safeguard against unloaded DOM elements.
    if (!text || text.trim().length < 100)
        return;

    const jobId = new URLSearchParams(window.location.search).get("currentJobId");

    // Is it the same job? (check because observer can make it refresh more than once)
    if (jobId === lastJobId)
        return;
    lastJobId = jobId;

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

        console.log("Line: ", line);
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