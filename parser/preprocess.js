// Get description and parse text to lowercase and normalize numbers.

function getJobDescription() {
    const jobDescriptionContainer = document.querySelector(".jobs-description__container");
    return jobDescriptionContainer?.innerText || null;
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