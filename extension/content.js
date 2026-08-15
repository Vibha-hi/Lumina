// --- Platform Configurations ---
const platforms = {
  linkedin: {
    host: "linkedin.com",
    name: "LinkedIn",
    composeSelector: 'div[role="textbox"]',
    buttonContainer: '.share-creation-state__bottom-control', 
    getContainer: (textbox) => textbox.closest('.share-creation-state') || textbox.parentElement,
    feedSelector: 'div.feed-shared-update-v2, div.update-components-text'
  },
  twitter: {
    host: "twitter.com",
    name: "X",
    composeSelector: 'div[data-testid="tweetTextarea_0"]',
    buttonContainer: '[data-testid="toolBar"]',
    getContainer: (textbox) => textbox.closest('[data-testid="tweetTextarea_0"]').parentElement.parentElement,
    feedSelector: 'article[data-testid="tweet"]'
  },
  x: {
    host: "x.com",
    name: "X",
    composeSelector: 'div[data-testid="tweetTextarea_0"]',
    buttonContainer: '[data-testid="toolBar"]',
    getContainer: (textbox) => textbox.closest('[data-testid="tweetTextarea_0"]').parentElement.parentElement,
    feedSelector: 'article[data-testid="tweet"]'
  },
  facebook: {
    host: "facebook.com",
    name: "Facebook",
    composeSelector: 'div[contenteditable="true"][role="textbox"]',
    buttonContainer: 'form[method="POST"]',
    getContainer: (textbox) => textbox.closest('form') || textbox.parentElement,
    feedSelector: 'div[role="article"]'
  },
  instagram: {
    host: "instagram.com",
    name: "Instagram",
    composeSelector: 'textarea',
    buttonContainer: 'textarea',
    getContainer: (textbox) => textbox.parentElement,
    feedSelector: 'article'
  },
  reddit: {
    host: "reddit.com",
    name: "Reddit",
    composeSelector: 'div[contenteditable="true"]',
    buttonContainer: 'div[contenteditable="true"]',
    getContainer: (textbox) => textbox.parentElement,
    feedSelector: 'shreddit-post, div[data-testid="post-container"]'
  }
};

let currentPlatform = null;

// Determine current platform
for (const key in platforms) {
  if (window.location.hostname.includes(platforms[key].host)) {
    currentPlatform = platforms[key];
    break;
  }
}

// --- DOM Observer to detect compose boxes ---
if (currentPlatform) {
  console.log(`[LUMINA.AI] Active on ${currentPlatform.name}`);
  const observer = new MutationObserver((mutations) => {
    const textboxes = document.querySelectorAll(currentPlatform.composeSelector);
    textboxes.forEach(textbox => {
      if (!textbox.dataset.luminaInjected) {
        injectButton(textbox);
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// --- Text Selection Analysis Logic (Universal) ---
let selectionBtn = null;
let activeTooltip = null;
let currentSelectedText = "";

document.addEventListener("mouseup", (e) => {
  // Wait a tiny bit for the selection to register
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    // If they clicked the button itself, or a tooltip, don't hide it yet
    if (e.target.closest('.lumina-selection-btn') || e.target.closest('.lumina-hover-tooltip') || e.target.closest('#lumina-results-panel')) {
      return;
    }

    // If valid text selected and no button exists, create it
    if (text.length >= 5 && text.length < 5000) {
      currentSelectedText = text; // Update the globally scoped variable
      
      if (!selectionBtn) {
        selectionBtn = document.createElement("button");
        selectionBtn.className = "lumina-selection-btn";
        selectionBtn.innerHTML = "✨";
        document.body.appendChild(selectionBtn);
        
        selectionBtn.addEventListener("mousedown", (e) => {
          e.preventDefault(); // Keep selection
          e.stopPropagation();
        });
        
        selectionBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          selectionBtn.style.display = "none";
          // Use currentSelectedText instead of the stale closure variable
          triggerSelectionAnalysis(currentSelectedText, e.clientX, e.clientY);
        });
      }
      
      // Position button near the end of selection (using fixed viewport coordinates)
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      selectionBtn.style.left = `${rect.right + 5}px`;
      selectionBtn.style.top = `${rect.bottom - 20}px`;
      selectionBtn.style.display = "flex";
    } else {
      // If selection is too short or cleared, hide button
      if (selectionBtn) selectionBtn.style.display = "none";
    }
  }, 10);
}, true); // Use capture phase to bypass React stopPropagation

document.addEventListener("mousedown", (e) => {
  // Hide tooltips/buttons if clicking outside
  if (!e.target.closest('.lumina-selection-btn') && !e.target.closest('.lumina-hover-tooltip') && !e.target.closest('#lumina-results-panel')) {
    if (selectionBtn) selectionBtn.style.display = "none";
    if (activeTooltip) {
      activeTooltip.remove();
      activeTooltip = null;
    }
  }
}, true); // Use capture phase

// --- UI Injection ---
function injectButton(textbox) {
  textbox.dataset.luminaInjected = "true";
  const container = currentPlatform.getContainer(textbox);
  
  if (!container) return;

  const btn = document.createElement("button");
  btn.className = "lumina-analyze-btn";
  btn.innerHTML = `<span class="lumina-icon">✨</span> Analyze`;
  
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Extract text depending on element type
    let text = "";
    if (textbox.tagName === "TEXTAREA") {
      text = textbox.value;
    } else {
      text = textbox.innerText || textbox.textContent;
    }

    if (text.trim().length < 10) {
      showToast("Please enter at least 10 characters to analyze.", "error");
      return;
    }

    startAnalysis(btn, text);
  });

  // Inject logic (simplified, will need platform specific tweaking in real world)
  container.appendChild(btn);
}

// --- Analysis Flow ---
function startAnalysis(buttonElement, text) {
  buttonElement.classList.add("lumina-loading");
  buttonElement.innerHTML = `<span class="lumina-spinner"></span> Analyzing...`;
  
  // Create or show the UI panel
  let panel = document.getElementById("lumina-results-panel");
  if (!panel) {
    panel = createPanel();
  }
  
  panel.classList.add("lumina-open");
  panel.innerHTML = `<div class="lumina-panel-loading">
    <div class="lumina-spinner large"></div>
    <p>Analyzing your post for risks...</p>
  </div>`;

  chrome.runtime.sendMessage({
    action: "analyze",
    data: {
      text: text,
      platform: currentPlatform ? currentPlatform.name : window.location.hostname
    }
  }, (response) => {
    buttonElement.classList.remove("lumina-loading");
    buttonElement.innerHTML = `<span class="lumina-icon">✨</span> Analyze`;
    
    if (response && response.success) {
      let data = response.data;
      if (data.analysis) {
        // Handle guest response format
        data = data.analysis;
      }
      renderResults(panel, data);
    } else {
      renderError(panel, response?.error || "An unknown error occurred");
    }
  });
}

// --- Results UI Rendering ---
function createPanel() {
  const panel = document.createElement("div");
  panel.id = "lumina-results-panel";
  document.body.appendChild(panel);
  
  // Close button functionality handled in render function
  return panel;
}

function renderError(panel, errorMsg) {
  panel.innerHTML = `
    <div class="lumina-panel-header">
      <h3>LUMINA.AI</h3>
      <button class="lumina-close-btn">&times;</button>
    </div>
    <div class="lumina-panel-content lumina-error">
      <p>⚠️ Analysis Failed</p>
      <p class="lumina-error-msg">${errorMsg}</p>
      ${errorMsg === "GUEST_LIMIT_REACHED" ? '<button class="lumina-login-btn">Log in to continue</button>' : ''}
    </div>
  `;
  attachCloseListener(panel);
  
  const loginBtn = panel.querySelector(".lumina-login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.open("http://localhost:8080/auth", "_blank");
    });
  }
}

function renderResults(panel, data) {
  const riskColor = data.overall_risk < 40 ? "green" : data.overall_risk < 70 ? "yellow" : "red";
  
  panel.innerHTML = `
    <div class="lumina-panel-header">
      <h3>LUMINA.AI Analysis</h3>
      <button class="lumina-close-btn">&times;</button>
    </div>
    <div class="lumina-panel-content">
      <div class="lumina-score-card ${riskColor}">
        <span class="lumina-score-label">Overall Risk</span>
        <span class="lumina-score-value">${data.overall_risk}/100</span>
      </div>
      
      <div class="lumina-sub-scores">
        ${renderProgressBar("Professional", data.professional_risk)}
        ${renderProgressBar("Privacy", data.privacy_risk)}
        ${renderProgressBar("Legal", data.legal_risk)}
        ${renderProgressBar("Misunderstanding", data.misunderstanding_risk)}
      </div>

      ${data.summary ? `
      <div class="lumina-section">
        <h4>Summary</h4>
        <div class="lumina-summary">${data.summary.replace(/\\n/g, '<br>')}</div>
      </div>
      ` : ''}

      ${data.risky_phrases && data.risky_phrases.length > 0 ? `
      <div class="lumina-section">
        <h4>Risky Phrases</h4>
        <ul class="lumina-risky-list">
          ${data.risky_phrases.map(p => `
            <li>
              <span class="lumina-phrase">"${p.phrase}"</span>
              <p class="lumina-reason">${p.reason}</p>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      ${data.rewrite ? `
      <div class="lumina-section">
        <h4>Suggested Rewrite</h4>
        <div class="lumina-rewrite-box">
          <p>${data.rewrite}</p>
          <button class="lumina-copy-btn">Copy</button>
        </div>
      </div>
      ` : ''}
    </div>
  `;
  
  attachCloseListener(panel);
  
  const copyBtn = panel.querySelector('.lumina-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(data.rewrite);
      copyBtn.innerText = "Copied!";
      setTimeout(() => copyBtn.innerText = "Copy", 2000);
    });
  }
}

function renderProgressBar(label, value) {
  const color = value < 40 ? "#10b981" : value < 70 ? "#f59e0b" : "#ef4444";
  return `
    <div class="lumina-progress-row">
      <span class="lumina-progress-label">${label}</span>
      <div class="lumina-progress-track">
        <div class="lumina-progress-fill" style="width: ${value}%; background-color: ${color}"></div>
      </div>
    </div>
  `;
}

function attachCloseListener(panel) {
  panel.querySelector('.lumina-close-btn').addEventListener('click', () => {
    panel.classList.remove('lumina-open');
  });
}

function showToast(message, type) {
  alert(`Lumina.AI: ${message}`); // Simplified for now, use a real toast UI in prod
}

// --- Selection Tooltip UI ---
function triggerSelectionAnalysis(text, x, y) {
  // Create a minimal tooltip container at the click coordinates
  const tooltip = document.createElement("div");
  tooltip.className = "lumina-hover-tooltip";
  tooltip.innerHTML = `<span class="lumina-spinner"></span> <span style="margin-left: 8px;">LUMINA analyzing...</span>`;
  
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y + 15}px`; // slightly below the cursor
  document.body.appendChild(tooltip);
  
  // Track active tooltip to hide it on outside clicks
  const observerEl = currentPlatform ? null : null; 
  // wait we use global activeTooltip
  
  chrome.runtime.sendMessage({
    action: "analyze",
    data: {
      text: text,
      platform: currentPlatform ? currentPlatform.name : window.location.hostname
    }
  }, (response) => {
    // Check for runtime errors first to avoid "Unchecked runtime.lastError"
    if (chrome.runtime.lastError) {
      tooltip.innerHTML = `<span>⚠️ Failed to analyze - Please go to extension and log-in to Lumina</span>`;
      setTimeout(() => tooltip.remove(), 3000);
      return;
    }
    
    if (response && response.success) {
      let data = response.data.analysis || response.data;
      const riskColor = data.overall_risk < 40 ? "#10b981" : data.overall_risk < 70 ? "#f59e0b" : "#ef4444";
      
      tooltip.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">✨</span>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: ${riskColor};">Risk Score: ${data.overall_risk}/100</strong>
            ${data.overall_risk >= 70 ? '<span style="font-size: 11px; color: #a1a1aa;">⚠️ Proceed with caution</span>' : ''}
          </div>
        </div>
      `;
      
      // Click tooltip to open full panel
      tooltip.style.cursor = "pointer";
      tooltip.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        let panel = document.getElementById("lumina-results-panel");
        if (!panel) panel = createPanel();
        panel.classList.add("lumina-open");
        renderResults(panel, data);
        tooltip.remove();
      });
      
    } else {
      tooltip.innerHTML = `<span>⚠️ Failed to analyze - Please go to extension and log-in to Lumina</span>`;
      setTimeout(() => tooltip.remove(), 3000);
    }
  });
}
