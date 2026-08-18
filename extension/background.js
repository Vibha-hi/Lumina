// API URL constants
const API_BASE_URL = "https://lumina-0eyg.onrender.com/api";

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sync_auth") {
    if (request.token) {
      chrome.storage.local.set({ luminaToken: request.token });
    } else {
      chrome.storage.local.remove("luminaToken");
    }
    return false; // synchronous
  }

  if (request.action === "analyze") {
    handleAnalysisRequest(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));

    // Return true to indicate we wish to send a response asynchronously
    return true;
  }
});

async function handleAnalysisRequest({ text, platform }) {
  try {
    // Check if we have an auth token stored
    const { luminaToken } = await chrome.storage.local.get(["luminaToken"]);

    const endpoint = luminaToken ? "/analyze" : "/analyze/guest";
    const headers = {
      "Content-Type": "application/json"
    };

    if (luminaToken) {
      headers["Authorization"] = `Bearer ${luminaToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text, platform, source: "extension" }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      if (data.message === "You've used your free analysis. Create an account to continue analyzing content.") {
        throw new Error("GUEST_LIMIT_REACHED");
      }
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data.data; // The API wraps the response in a 'data' field
  } catch (error) {
    // We remove console.error because Chrome flags it as an extension error 
    // in chrome://extensions even though it's caught and handled gracefully here.
    throw error;
  }
}
