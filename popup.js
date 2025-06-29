document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("send").addEventListener("click", async () => {
    const filename = document.getElementById("filename").value || "file.txt";
    const content = document.getElementById("filecontent").value;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return console.error("No active tab");
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "sendTextToFocused", text: content, filename },
        (response) => {
          console.log("TEXT2FILE: Response:", response);
          if (chrome.runtime.lastError) {
            console.error("TEXT2FILE Error:", chrome.runtime.lastError.message);
          } else if (response?.success) {
            console.log("TEXT2FILE: Text sent to focused element");
          } else {
            console.warn("TEXT2FILE: No element focused");
          }
        }
      );
    });
  });
});
