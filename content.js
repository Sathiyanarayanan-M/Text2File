// // content.js
// const targetNode = document.body; // Or a more specific ancestor if known
// const config = { childList: true, subtree: true };

// function handleFileInput(fileInput) {
//   console.log("File input added TEXT2FILE:", fileInput);
// }

// const observer = new MutationObserver(function (mutationsList, observer) {
//   for (const mutation of mutationsList) {
//     if (mutation.type === "childList") {
//       mutation.addedNodes.forEach((node) => {
//         // Check if the added node is the file input or contains it
//         if (node.nodeType === 1 && node.matches('input[type="file"]')) {
//           handleFileInput(node);
//         } else if (
//           node.nodeType === 1 &&
//           node.querySelector('input[type="file"]')
//         ) {
//           handleFileInput(node.querySelector('input[type="file"]'));
//         }
//       });
//     }
//   }
// });

// observer.observe(targetNode, config);

// // Also check if the element already exists on page load
// const existingFileInput = document.querySelector('input[type="file"]');
// if (existingFileInput) {
//   handleFileInput(existingFileInput);
// }

// // Remember to disconnect the observer if needed, e.g., before navigating away
// // observer.disconnect();



// **************************


// content.js

// --- MutationObserver logic (Keep this to handle dynamic addition) ---
const targetNode = document.body;
const config = { childList: true, subtree: true };

const observer = new MutationObserver(function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        const fileInput =
          node.nodeType === 1 && node.matches('input[type="file"]')
            ? node
            : node.nodeType === 1
            ? node.querySelector('input[type="file"]')
            : null;
        if (fileInput && !fileInput.dataset.listenerAdded) {
          handleFileInputAppears(fileInput); // Function when input appears
          fileInput.dataset.listenerAdded = "true"; // Prevent adding multiple listeners if observer triggers multiple times for same element
        }
      });
    }
    if (mutation.removedNodes) {
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.matches('input[type="file"]')) {
          console.log("File input removed:", node);
          // Clean up any listeners or state if needed
        } else if (
          node.nodeType === 1 &&
          node.querySelector('input[type="file"]')
        ) {
          console.log(
            "File input removed (within parent):",
            node.querySelector('input[type="file"]')
          );
          // Clean up for child input
        }
      });
    }
  }
});

observer.observe(targetNode, config);

// Check for existing input on load
const existingFileInput = document.querySelector('input[type="file"]');
if (existingFileInput && !existingFileInput.dataset.listenerAdded) {
  handleFileInputAppears(existingFileInput);
  existingFileInput.dataset.listenerAdded = "true";
}

// --- Function to run when the file input appears ---
function handleFileInputAppears(fileInput) {
  console.log("File input detected or added:", fileInput);
  // Initial setup when the element is found/added
  // if (!fileInput.dataset.uploadDate) {
  //   // Avoid overwriting if already set
  //   fileInput.dataset.uploadDate = new Date().toISOString();
  //   console.log("Date added as data attribute:", fileInput.dataset.uploadDate);
  // }

  // // Add event listener for file selection (this is when the user picks a file)
  // if (!fileInput.dataset.changeListener) {
  //   fileInput.addEventListener("change", handleFileSelection);
  //   fileInput.dataset.changeListener = "true"; // Mark listener as added
  // }
}

// --- Function to handle the actual file selection by the user ---
function handleFileSelection(event) {
  const selectedFiles = event.target.files;
  const uploadDate = event.target.dataset.uploadDate; // Retrieve the date

  console.log("User selected file(s):", selectedFiles);
  console.log("Associated upload date:", uploadDate);

  // *** Your logic here to process the selected files with the date ***
  // You might send this data to your background script, process locally, etc.
}

// --- Message Listener (Receives messages from popup.js or other parts of the extension) ---
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "interactWithFileInput") {
    console.log("Message received from popup: interactWithFileInput");
    // Find the file input again, as it might be dynamic
    const fileInput = document.querySelector('input[type="file"]');

    if (fileInput) {
      console.log("File input found. Triggering interaction logic.");
      // *** Execute the interaction logic you want from the popup ***
      // This could be setting an attribute, or preparing for the next user action.
      // For example, if you wanted to programmatically "click" it (which opens the native dialog):
      // fileInput.click(); // Opens the native file dialog, user still has to select

      // Or just confirm its presence and associated data:
      console.log(
        "Current upload date on input:",
        fileInput.dataset.uploadDate
      );
      // You could send a response back to the popup if needed
      // sendResponse({status: "file input found", date: fileInput.dataset.uploadDate});
    } else {
      console.log("File input not currently in the DOM.");
      // You could send a response back to the popup if needed
      // sendResponse({status: "file input not found"});
    }
  }
});
