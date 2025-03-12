(() => {
  if (document.getElementById("flower-container")) return;
  let intervalId = null;

  chrome.storage.sync.onChanged.addListener((changedItems) => {
    console.log("changed items = ", { changedItems });
    window.updateFlower(changedItems?.flowerStats?.newValue);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.command === "start") {
      chrome.storage.sync.get("intervalActive", (data) => {
        window.resetFlower();
        console.log("intervalActive?", data.intervalActive);
        if (data.intervalActive) return; // Prevent multiple intervals

        chrome.storage.sync.set({ intervalActive: true });

        intervalId = setInterval(() => {
          chrome.storage.sync.get(["productiveSites", "unproductiveSites", "flowerStats"], (data) => {
            console.log("data", { data });
            let flowerStats = data.flowerStats || {
              loading: true,
              growth: 0,
              wilt: 0,
            };
            let growth = flowerStats.growth;
            let wilt = flowerStats.wilt;
            chrome.runtime.sendMessage({ request: "getTabUrl" }, (response) => {
              const productiveSites = data.productiveSites?.split(",") || [];
              const unproductiveSites = data.unproductiveSites?.split(",") || [];
              if (productiveSites.some((site) => response?.url.includes(site.trim()))) {
                console.log("productive");
                if (wilt > 0) {
                  wilt--;
                } else {
                  growth++;
                }
              } else if (unproductiveSites.some((site) => response?.url.includes(site.trim()))) {
                console.log("unproductive");
                if (wilt < 5) {
                  wilt++;
                } else {
                  growth--;
                }
              }
              flowerStats = { loading: false, growth, wilt };
              chrome.storage.sync.set({ flowerStats });
            });
          });
        }, 2500);
      });
    } else if (message.command === "stop") {
      console.log("stop intervalId: ", intervalId);
      clearInterval(intervalId);
      intervalId = null;
      chrome.storage.sync.set({ intervalActive: false });
    }
  });
})();
