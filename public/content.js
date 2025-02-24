(() => {
  const FLOWER_TEXT_ID = "flower-text-id";
  if (document.getElementById("flower-container")) return;
  let intervalId = null;

  const flowerContainer = document.createElement("div");
  const flowerText = document.createElement("span");
  flowerText.id = FLOWER_TEXT_ID;

  chrome.storage.sync.onChanged.addListener((changedItems) => {
    console.log("changed items = ", { changedItems });
    const currentFlowerText = document.getElementById(FLOWER_TEXT_ID);
    if (currentFlowerText && changedItems?.flowerLevel?.newValue) {
      currentFlowerText.innerText = `Flower Level: ${changedItems.flowerLevel.newValue}`;
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    const resetFlower = () => {
      flowerContainer.id = "flower-container";
      flowerContainer.style.position = "absolute";
      flowerContainer.style.backgroundColor = "red";
      flowerContainer.style.width = "150px";
      flowerContainer.style.height = "150px";
      flowerContainer.style.bottom = "0";
      flowerContainer.style.right = "0";
      flowerContainer.style.zIndex = "10000";
      flowerContainer.style.color = "white";
      flowerContainer.style.fontSize = "20px";
      flowerContainer.style.display = "flex";
      flowerContainer.style.alignItems = "center";
      flowerContainer.style.justifyContent = "center";

      flowerText.innerText = `Flower Level: Loading...`;
      flowerContainer.appendChild(flowerText);
      document.body.appendChild(flowerContainer);
    };
    if (message.command === "start") {
      chrome.storage.sync.get("intervalActive", (data) => {
        resetFlower();
        console.log("intervalActive?", data.intervalActive);
        if (data.intervalActive) return; // Prevent multiple intervals

        chrome.storage.sync.set({ intervalActive: true });

        intervalId = setInterval(() => {
          chrome.storage.sync.get(
            ["productiveSites", "unproductiveSites", "flowerLevel"],
            (data) => {
              console.log("data", { data });
              let flowerLevel = data.flowerLevel || 0;
              chrome.runtime.sendMessage(
                { request: "getTabUrl" },
                (response) => {
                  const productiveSites =
                    data.productiveSites?.split(",") || [];
                  const unproductiveSites =
                    data.unproductiveSites?.split(",") || [];
                  if (
                    productiveSites.some((site) =>
                      response?.url.includes(site.trim()),
                    )
                  ) {
                    flowerLevel++;
                  } else if (
                    unproductiveSites.some((site) =>
                      response?.url.includes(site.trim()),
                    )
                  ) {
                    console.log("unproductive");
                    flowerLevel--;
                  }
                  chrome.storage.sync.set({ flowerLevel });
                  // flowerText.innerText = `Flower Level: ${flowerLevel}`;
                },
              );
            },
          );
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
