document.getElementById("reset-btn").addEventListener("click", () => {
    chrome.storage.local.remove(
        ["joblensPosX", "joblensPosY", "joblensSnapEnabled"],
        () => {
            document.getElementById("reset-btn").textContent = "Done";
        }
    );
});

chrome.storage.local.get("joblensEnabled",
    (result) => {
        document.getElementById("joblensEnabled-checkbox").checked = result.joblensEnabled;
    });

document.getElementById("joblensEnabled-checkbox").addEventListener('change',
    (event) => {
        chrome.storage.local.set({ joblensEnabled: event.currentTarget.checked });
        let checkboxChecked = event.currentTarget.checked;
        chrome.tabs.query({ active: true, lastFocusedWindow: true },
            ([tab]) => {
                let message = { enabled: checkboxChecked };
                chrome.tabs.sendMessage(tab.id, message);
            });
    });

