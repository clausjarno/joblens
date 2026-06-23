document.getElementById("reset-btn").addEventListener("click", () => {
    chrome.storage.local.remove(
        ["joblensPosX", "joblensPosY", "joblensSnapEnabled"],
        () => {
            document.getElementById("reset-btn").textContent = "Done";
        }
    );
});