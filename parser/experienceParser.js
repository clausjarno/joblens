// Filter text, extract experience numerically and score semantic if unclear.

function getExperienceSentences(text) {
    return text
        .split("\n")
        .filter(line => /ervaring|werkervaring|experience|jaar|jaren|years?/i.test(line)
        );
}

function extractNumericExperience(text) {
    const patterns = [
        // Range with optional prefix
        /(?:minstens|minimaal|minimum|at least)?\s*(\d+)\s*(?:à|-|to|tot)\s*(\d+)\s*(?:jaar|years?)/i,

        // Simple range (3-5 years)
        /(\d+)\s*-\s*(\d+)\s*(?:jaar|years?)/i,

        // 5+ years / 3+ years
        /(\d+)\s*\+?\s*(?:jaar|years?)(?:\s*(?:ervaring|experience))?/i,

        // Maximum (Maximum 2 jaar)
        /(?:maximaal|max|maximum)\s*(\d+)\s*\+?\s*(?:jaar|years?)/i,

        // Minstens explicit (Minstens 3 jaar)
        /(?:minstens|minimaal|minimum|at least)\s*(\d+)\s*(?:jaar|years?)/i,

        // Fallback pattern (less strict wording)
        /(\d+)\s*(?:jaar|years?)\s*(?:ervaring|experience)/i
    ];

    for (const p of patterns) {
        const match = text.match(p);
        if (match) {
            // Log for debugging matched regex.
            // console.log("Matched:", p);
            // console.log(match);

            const lower = text;

            if (match[2]) {
                return {
                    min: parseInt(match[1]),
                    max: parseInt(match[2])
                };
            }

            const value = parseInt(match[1]);

            if (lower.includes("maximaal") || lower.includes("maximum")) {
                return {
                    min: 0,
                    max: value
                };
            }

            return {
                min: value,
                max: null,
            };
        }
    }

    return null;
}

function estimateExperienceLevel(text) {
    const lower = text;

    const signals = [
        { keywords: ["enkele jaren", "several years", "few years"], score: 2 },
        { keywords: ["hands-on experience", "sterke ervaring", "strong experience"], score: 2 },
        { keywords: ["junior", "starter"], score: 0 }
    ];

    let score = 0;

    for (const group of signals) {
        for (const kw of group.keywords) {
            if (lower.includes(kw)) {
                score = Math.max(score, group.score);
            }
        }
    }

    return score;
}