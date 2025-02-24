chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.request === "getTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ url: tabs[0]?.url || "" });
    });
    return true;
  }
});

// chrome.tabs.onActivated.addListener(() => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const newTabId = tabs[0].id;
//     chrome.storage.sync.get(["newTabId", "lastTab"], (data) => {
//       const lastTabId = data.lastTab.id;

//       if (newTabId !== lastTabId) {
//         chrome.tabs.sendMessage(tabs[0].id, { command: "stop" });
//         chrome.storage.sync.set({ lastTabId: newTabId });
//       }
//     });
//     console.log("tabs = ", { tabs });
//   });
// });

chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: "stop" });
  });
});
