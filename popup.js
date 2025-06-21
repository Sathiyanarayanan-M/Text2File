document.getElementById("send").addEventListener("click", async () => {
  //   const filename = document.getElementById("filename").value || "text.txt";
  //   const content = document.getElementById("filecontent").value;

  //   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  //   chrome.scripting.executeScript({
  //     target: { tabId: tab.id },
  //     func: injectFile,
  //     args: [filename, content],
  //   });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "interactWithFileInput" });
  });
});

function injectFile(filename, content) {
  function waitForFileInput(callback) {
    let times = 0;
    const check = () => {
      if (times > 10) {
        console.error(
          "File input not found. Make sure the chat window is open."
        );
        return;
      }
      const input = document.querySelector('input[type="file"]');

      if (input) {
        console.log("File input found:", input);
        callback(input);
      } else {
        console.log("Waiting for file input...");
        times++;
        setTimeout(check, 300); // check again after 300ms
      }
    };
    check();
  }
  waitForFileInput((fileInput) => {
    const textBlob = new Blob([content], { type: "text/plain" });
    const fakeFile = new File([textBlob], filename, { type: "text/plain" });

    const dt = new DataTransfer();
    dt.items.add(fakeFile);

    if (!fileInput) {
      console.error("File input not found. Make sure the chat window is open.");
      return;
    }
    fileInput.files = dt.files;

    // Optional: trigger a change event
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
  });

  //   const file = new File([content], filename, { type: "text/plain" });

  //   const input = document.querySelector("input[type='file']");

  //   if (!input) {
  //     alert("File input not found. Make sure the chat window is open.");
  //     return;
  //   }

  //   // Create a DataTransfer to simulate file selection
  //   const dt = new DataTransfer();
  //   dt.items.add(file);
  //   input.files = dt.files;

  //   // Optional: Dispatch change event
  //   input.dispatchEvent(new Event("change", { bubbles: true }));

  //   alert(`File "${filename}" injected. Click send.`);
}
