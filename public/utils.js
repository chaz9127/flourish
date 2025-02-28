window.FLOWER_CONTAINER_ID = "flourish-flower-container";
window.FLOWER_TEXT_ID = "flourish-flower-text";

window.init = () => {
  if (document.getElementById(window.FLOWER_CONTAINER_ID)) return;
  const flowerContainer = document.createElement("div");
  flowerContainer.id = window.FLOWER_CONTAINER_ID;
  const flowerText = document.createElement("span");
  flowerText.id = window.FLOWER_TEXT_ID;
  flowerContainer.appendChild(flowerText);
  document.body.appendChild(flowerContainer);
};

window.resetFlower = () => {
  console.log("resetting flower...");
  window.init();
  const flowerContainer = document.getElementById(window.FLOWER_CONTAINER_ID);
  flowerContainer.style.position = "absolute";
  flowerContainer.style.backgroundColor = "red";
  flowerContainer.style.width = "150px";
  flowerContainer.style.height = "150px";
  flowerContainer.style.bottom = "0";
  flowerContainer.style.right = "0";
  flowerContainer.style.zIndex = "10000";
  flowerContainer.style.color = "white";
  flowerContainer.style.fontSize = "16px";
  flowerContainer.style.display = "flex";
  flowerContainer.style.alignItems = "center";
  flowerContainer.style.justifyContent = "center";

  const flowerText = document.getElementById(window.FLOWER_TEXT_ID);
  flowerText.innerText = `Flower Level: Loading...`;
};

window.updateFlower = (flowerStats = {}) => {
  const flowerText = document.getElementById(window.FLOWER_TEXT_ID);
  const displayText = `
    growth: ${flowerStats.growth} \n\n
    wilt: ${flowerStats.wilt}
  `;
  flowerText.innerHTML = `Flower Level: ${displayText}`;
};
