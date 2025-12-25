document.getElementById("refresh").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "refresh_connection" }, (response) => {
        console.log("Popup got response:", response);
    });
});