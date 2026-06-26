// Return the node with the job description.
function getJobDescriptionNode() {
    const nodes = Array.from(document.querySelectorAll("div, section, article, main"));

    let score = -Infinity;
    let bestMatch = null;

    for (let node of nodes) {
        let liCount = node.querySelectorAll("li").length;
        let textLength = node.textContent.length;

        let newScore = (textLength / 50) + (liCount * 0.2);

        if (newScore > score) {
            score = newScore;
            bestMatch = node;
        }
    }
    return bestMatch;
}

function preprocess(text) {
    if (!text) return null;
    return normalizeNumbers(text.toLowerCase());
}

function normalizeNumbers(text) {
    const dutchNumbers = {
        een: 1,
        één: 1,
        twee: 2,
        drie: 3,
        vier: 4,
        vijf: 5,
        zes: 6,
        zeven: 7,
        acht: 8,
        negen: 9,
        tien: 10
    };

    let result = text;

    for (const [word, num] of Object.entries(dutchNumbers)) {
        result = result.replaceAll(word, num.toString());
    }

    return result;
}