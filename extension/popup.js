document.addEventListener("DOMContentLoaded", async () => {
  const statusContainer = document.getElementById("status-container");
  const WEB_APP_URL = "http://localhost:8080"; // Lumina.AI frontend URL

  // Check storage for token
  const { luminaToken } = await chrome.storage.local.get(["luminaToken"]);

  if (luminaToken) {
    statusContainer.innerHTML = `
      <p class="status-text">
        <strong>Connected</strong>
        You have full access to analysis features.
      </p>
      <button id="dashboard-btn" class="btn">Go to Dashboard</button>
      <button id="logout-btn" class="btn secondary">Disconnect</button>
    `;

    document.getElementById("dashboard-btn").addEventListener("click", () => {
      chrome.tabs.create({ url: `${WEB_APP_URL}/dashboard` });
    });

    document.getElementById("logout-btn").addEventListener("click", async () => {
      await chrome.storage.local.remove("luminaToken");
      window.location.reload();
    });
  } else {
    statusContainer.innerHTML = `
      <p class="status-text">
        <strong>Guest Mode Active</strong>
        You can analyze up to 3 posts for free. Log in for unlimited access.
      </p>
      <button id="login-btn" class="btn">Log in to LUMINA.AI</button>
    `;

    document.getElementById("login-btn").addEventListener("click", () => {
      chrome.tabs.create({ url: `${WEB_APP_URL}/auth` });
    });
  }
});
