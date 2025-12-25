// chrome.scripting.executeScript({
//   target: { tabId: tabs[0].id },
//   func: handleCommand,
//   args: [event.data]
// });

// chrome.runtime.addListener((msg) => {
//   if (msg.type === "switch_tab") {
//     chrome.tabs.query({ currentWindow: true }, (tabs) => {
//       if (!tabs || tabs.length === 0) return;
//       let activeIndex = tabs.findIndex(t => t.active);
//       let nextIndex = msg.direction === "next" 
//         ? (activeIndex + 1) % tabs.length 
//         : (activeIndex - 1 + tabs.length) % tabs.length;
//       chrome.tabs.update(tabs[nextIndex].id, { active: true });
//     });
//   }
// });