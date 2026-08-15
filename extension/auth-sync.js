// Watch for changes to the token in localStorage
let lastToken = null;

function checkAndSyncToken() {
  const currentToken = localStorage.getItem("lumina_token") || localStorage.getItem("token");
  
  if (currentToken !== lastToken) {
    lastToken = currentToken;
    
    // Send the token (or null if logged out) to the extension's background script
    chrome.runtime.sendMessage({
      action: "sync_auth",
      token: currentToken
    });
  }
}

// Check immediately on load
checkAndSyncToken();

// Also listen for storage events (if changed in another tab)
window.addEventListener("storage", (e) => {
  if (e.key === "lumina_token" || e.key === "token") {
    checkAndSyncToken();
  }
});

// Fallback interval just in case storage event is missed during SPA navigation
setInterval(checkAndSyncToken, 2000);
