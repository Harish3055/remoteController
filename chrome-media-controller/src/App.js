import React from 'react';

function App() {
  function sendCommand(command) {
    window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      window.chrome.tabs.sendMessage(tabs[0].id, { command });
    });
  }
  return (
    <>
    <button onClick={() => sendCommand("play")}>Play</button>
    <button onClick={() => sendCommand("pause")}>Pause</button>
    <button onClick={() => sendCommand("scrollDown")}>Scroll Down</button>
    <button onClick={() => sendCommand("scrollUp")}>Scroll Up</button>
    </>
  );
}

export default App;
