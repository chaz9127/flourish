import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [productiveSites, setProductiveSites] = useState("");
  const [unproductiveSites, setUnproductiveSites] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(["productiveSites", "unproductiveSites"], (data) => {
      setProductiveSites(data.productiveSites || "");
      setUnproductiveSites(data.unproductiveSites || "");
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.sync.set({ productiveSites, unproductiveSites });
  };

  const startFlower = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, { command: "start" });
    }
  };

  const stopFlower = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, { command: "stop" });
    }
  };

  return (
    <div>
      <h1>Flower Counter</h1>
      <input 
        type="text" 
        placeholder="Productive sites (comma separated)" 
        value={productiveSites} 
        onChange={(e) => setProductiveSites(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Unproductive sites (comma separated)" 
        value={unproductiveSites} 
        onChange={(e) => setUnproductiveSites(e.target.value)}
      />
      <button onClick={saveSettings}>Save Settings</button>
      <button onClick={startFlower}>Start Flower!</button>
      <button onClick={stopFlower}>Stop Flower</button>
    </div>
  );
}

export default App;