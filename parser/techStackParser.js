// Extract Tech Stack.

const tech_patterns = [
    { key: ".net", aliases: [".net", "dotnet", "c#/.net"] },
    { key: "c#", aliases: ["c#", "c sharp"] },
    { key: "javascript", aliases: ["javascript"] },
    { key: "typescript", aliases: ["typescript"] },
    { key: "java", aliases: ["java"] },
    { key: "python", aliases: ["python"] },
    { key: "sql", aliases: ["sql"] },
    { key: "azure", aliases: ["azure"] },
    { key: "aws", aliases: ["aws"] },
    { key: "docker", aliases: ["docker"] },
    { key: "kubernetes", aliases: ["kubernetes"] },
    { key: "ci/cd", aliases: ["ci/cd", "cicd"] },
    { key: "git", aliases: ["git"] },
    { key: "rest api", aliases: ["rest api", "restful api"] },
    { key: "graphql", aliases: ["graphql"] },
    { key: "entity framework", aliases: ["entity framework", "ef core"] },
    { key: "blazor", aliases: ["blazor"] },
    { key: "angular", aliases: ["angular"] },
    { key: "react", aliases: ["react"] },
    { key: "vue", aliases: ["vue"] }
];


function extractTechStack(text) {
    const lower = text;
    const found = [];

    for (const tech of tech_patterns) {
        if (tech.aliases.some(a => lower.includes(a))) {
            found.push(tech.key);
        }
    }

    return [...new Set(found)];
}