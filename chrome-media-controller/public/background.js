let ws;
let reconnectInterval = null;
let reconnectAttempts = 0;
const MAX_ATTEMPTS = 20; 
const SERVER_URL = "wss://4577b19f-11a3-4cb8-9496-017d66144547-00-2vzaz8b5kpix4.spock.replit.dev";

function connectWebSocket() {
  console.log("🌐 Trying to connect:", SERVER_URL);

  ws = new WebSocket(SERVER_URL);

  ws.onopen = () => {
    console.log("✅ Connected to WebSocket server");
    reconnectAttempts = 0;
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  };

  ws.onmessage = (event) => {
    console.log("📩 Command from server:", event.data);
  
    const cmd = event.data;
  
    if (cmd === "next_tab" || cmd === "prev_tab") {
      switchTab(cmd === "next_tab" ? 1 : -1);
      return;
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: handleCommand,
            args: [cmd]
          });
        }
      });
    }
  };
  
  function switchTab(direction) {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) return;
      let activeIndex = tabs.findIndex(t => t.active);
      let newIndex = (activeIndex + direction + tabs.length) % tabs.length;
      chrome.tabs.update(tabs[newIndex].id, { active: true });
    });
  }
  

  ws.onclose = () => {
    console.warn("⚠️ WebSocket closed. Scheduling reconnect...");
    scheduleReconnect();
  };

  ws.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
    ws.close();
  };
}


function scheduleReconnect() {
  if (reconnectInterval || reconnectAttempts >= MAX_ATTEMPTS) return;

  reconnectInterval = setInterval(() => {
    if (reconnectAttempts >= MAX_ATTEMPTS) {
      console.error("⏹️ Max reconnect attempts reached (5 min). Stopping.");
      clearInterval(reconnectInterval);
      reconnectInterval = null;
      return;
    }
    reconnectAttempts++;
    console.log(`🔄 Reconnect attempt ${reconnectAttempts}/${MAX_ATTEMPTS}`);
    connectWebSocket();
  }, 30 * 1000);
}


function handleCommand(cmd) {
  let response = "";
  const delta = 10;

  if(cmd == "fast_forward"){
    document.querySelectorAll("video,audio").forEach(v => {
      v.currentTime = Math.min(v.duration, v.currentTime + delta);
    });
    response = "⏩ Fast Forwarded";
  }

  if(cmd == "fast_backward"){
    document.querySelectorAll("video,audio").forEach(v => {
      v.currentTime = Math.max(0, v.currentTime - delta);
    });
    response = "⏪ Fast Backwarded";
  }
  
  if (cmd === "back") {
    window.history.back();
    response = "⬅️ Navigated Back";
  }
  
  if (cmd === "forward") {
    window.history.forward();
    response = "➡️ Navigated Forward";
  }
  
  if (cmd === "reload") {
    window.location.reload();
    response = "🔄 Page Reloaded";
  }
  
  if (cmd === "next_tab") {
    chrome.runtime.sendMessage({ type: "switch_tab", direction: "next" });
    response = "➡️ Switched to next tab";
  }
  
  if (cmd === "prev_tab") {
    chrome.runtime.sendMessage({ type: "switch_tab", direction: "prev" });
    response = "⬅️ Switched to previous tab";
  }
  if (cmd === "play") {
    document.querySelectorAll("video,audio").forEach(v => v.play());
    response = "▶️ Playing media";
  }
  if (cmd === "pause") {
    document.querySelectorAll("video,audio").forEach(v => v.pause());
    response = "⏸ Media paused";
  }
  if (cmd === "volume_up") {
    document.querySelectorAll("video,audio").forEach(v => {
      v.volume = Math.min(1, v.volume + 0.1);
    });
    response = "🔊 Volume increased";
  }
  if (cmd === "volume_down") {
    document.querySelectorAll("video,audio").forEach(v => {
      v.volume = Math.max(0, v.volume - 0.1);
    });
    response = "🔉 Volume decreased";
  }
  if (cmd === "mute_toggle") {
    document.querySelectorAll("video,audio").forEach(v => {
      v.muted = !v.muted;
    });
    response = "🔇 Toggled mute";
  }
  
  if (cmd === "scroll_up") {
    window.scrollBy(0, -200);
    response = "⬆️ Scrolled up";
  }
  if (cmd === "scroll_down") {
    window.scrollBy(0, 200);
    response = "⬇️ Scrolled down";
  }
  
  if (cmd.startsWith("search:")) {
    const query = cmd.split("search:")[1];
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    response = `🔍 Searching for: ${query}`;
  }

  console.log("✅ Command executed:", response);
}

connectWebSocket();


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "refresh_connection") {
    if (ws) {
      ws.close();
    } else {
      connectWebSocket();
    }
    sendResponse({ status: "reconnecting" });
  }
});
