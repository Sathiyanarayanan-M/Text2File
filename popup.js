document.addEventListener("DOMContentLoaded", () => {
  const filenameInput = document.getElementById("filename");
  const contentTextarea = document.getElementById("filecontent");

  chrome.storage.local.get(["filename", "filecontent"], (data) => {
    if (data.filename) filenameInput.value = data.filename;
    if (data.filecontent) contentTextarea.value = data.filecontent;
  });

  filenameInput.addEventListener("input", () => {
    chrome.storage.local.set({ filename: filenameInput.value });
  });

  contentTextarea.addEventListener("input", () => {
    chrome.storage.local.set({ filecontent: contentTextarea.value });
  });

  document.getElementById("send").addEventListener("click", async () => {
    const filename = filenameInput.value || "file.txt";
    const content = contentTextarea.value || "";

    console.log("TEXT2FILE: Sending text");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return console.error("Text2File: No active tab");
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
