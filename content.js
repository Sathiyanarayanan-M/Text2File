let lastFocused = null;

document.addEventListener(
  "focusin",
  (e) => {
    const el = e.target;
    if (
      el.tagName === "TEXTAREA" ||
      el.tagName === "INPUT" ||
      el.isContentEditable
    ) {
      lastFocused = el;
    }
  },
  true
);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  function simulateFileDrop(targetElement, file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    ["dragenter", "dragover", "drop"].forEach((eventType) => {
      const event = new DragEvent(eventType, {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      });
      targetElement.dispatchEvent(event);
    });
  }

  if (msg.action === "sendTextToFocused" && lastFocused) {
    const text = msg.text || "";
    const filename = msg.filename || "file.txt";

    const inputEl = document.querySelector("input[type=file]");
    const newFile = new File([text], filename, { type: "text/plain" });

    if (inputEl) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(newFile);
      inputEl.files = dataTransfer.files;
      inputEl.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (lastFocused) {
      simulateFileDrop(lastFocused, newFile);
    } else {
      sendResponse({ success: true });
    }

    sendResponse({ success: false });
  }

  return true;
});
