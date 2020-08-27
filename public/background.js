chrome.runtime.onMessage.addListener(({ type, payload }) => {
  switch (type) {
    case "SHOW_STOCK":
      chrome.storage.sync.get(["stocks"], function (result) {
        console.log(result);
      });
      break;
    case "SAVE_STOCK":
      chrome.storage.sync.set({ stocks: payload });
      break;

    default:
      break;
  }
});
