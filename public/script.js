// --- HerGuide Frontend Application Logic ---

// 1. Application State
let allResources = [];
let currentCategory = "all";
let searchQuery = "";
let savedResourceIds = JSON.parse(localStorage.getItem("herguide_saved_ids")) || [];

// 2. DOM Elements
const resourceGrid = document.getElementById("resourceGrid");
const savedResourceGrid = document.getElementById("savedResourceGrid");
const emptySavedState = document.getElementById("emptySavedState");
const noResults = document.getElementById("noResults");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const savedCountBadge = document.getElementById("savedCountBadge");
const clearAllSavedBtn = document.getElementById("clearAllSavedBtn");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const toast = document.getElementById("toast");

// 3. Notification Helper
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// 4. Render Resource Card HTML
function createResourceCard(res, isSavedView = false) {
  const isSaved = savedResourceIds.includes(res.id);
  const card = document.createElement("article");
  card.className = "resource-card";
  card.setAttribute("data-id", res.id);

  card.innerHTML = `
    <div class="card-top">
      <span class="card-category-badge">${res.categoryLabel || res.category}</span>
      <button 
        class="save-card-btn ${isSaved ? "saved" : ""}" 
        aria-label="${isSaved ? "Remove from saved" : "Save resource"}"
        title="${isSaved ? "Remove bookmark" : "Save resource"}"
        data-action="toggle-save" 
        data-id="${res.id}">
        ${isSaved ? "❤️" : "🤍"}
      </button>
    </div>
    <h3 class="card-title">${res.title}</h3>
    <p class="card-description">${res.description}</p>
    <div class="card-footer">
      <span class="card-helpline">📞 ${res.helpline || "N/A"}</span>
      <a href="${res.url}" target="_blank" rel="noopener noreferrer" class="card-action-link">
        Visit Website →
      </a>
    </div>
  `;
  return card;
}

// 5. Filter and Render Directory
function renderDirectory() {
  resourceGrid.innerHTML = "";

  const filtered = allResources.filter(res => {
    const matchesCategory = currentCategory === "all" || res.category === currentCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      (res.title && res.title.toLowerCase().includes(query)) || 
      (res.description && res.description.toLowerCase().includes(query)) || 
      (res.categoryLabel && res.categoryLabel.toLowerCase().includes(query));
    
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    filtered.forEach(res => {
      resourceGrid.appendChild(createResourceCard(res));
    });
  }
}

// 6. Render Saved Resources Section
function renderSavedResources() {
  savedResourceGrid.innerHTML = "";
  const savedItems = allResources.filter(res => savedResourceIds.includes(res.id));

  // Update navbar badge
  savedCountBadge.textContent = savedResourceIds.length;

  if (savedItems.length === 0) {
    emptySavedState.style.display = "block";
    clearAllSavedBtn.style.display = "none";
  } else {
    emptySavedState.style.display = "none";
    clearAllSavedBtn.style.display = "inline-block";
    savedItems.forEach(res => {
      savedResourceGrid.appendChild(createResourceCard(res, true));
    });
  }
}

// 7. Toggle Save / Bookmark
function toggleSave(resourceId) {
  const index = savedResourceIds.indexOf(resourceId);
  const resource = allResources.find(r => r.id === resourceId);
  const title = resource ? resource.title : "Resource";

  if (index > -1) {
    savedResourceIds.splice(index, 1);
    showToast(`Removed "${title}" from saved items.`);
  } else {
    savedResourceIds.push(resourceId);
    showToast(`Saved "${title}"!`);
  }

  // Persist to local storage
  localStorage.setItem("herguide_saved_ids", JSON.stringify(savedResourceIds));

  // Re-render both views to sync icon states
  renderDirectory();
  renderSavedResources();
}

// 8. Fetch Resources from Express API
async function loadResources() {
  try {
    const response = await fetch("/api/resources");
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    const data = await response.json();
    allResources = Array.isArray(data) ? data : [];
    renderDirectory();
    renderSavedResources();
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    resourceGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; border-color: #ef9a9a; background-color: #ffebee;">
        <p style="color: #c62828; font-weight: 600;">⚠️ Unable to load resources at this moment.</p>
        <p style="font-size: 0.85rem; margin-top: 6px; color: #555;">Please check if the server is running or try refreshing the page.</p>
      </div>
    `;
    emptySavedState.style.display = "block";
  }
}

// 9. Event Listeners for Directory & Saved Grids
document.addEventListener("click", (e) => {
  const saveBtn = e.target.closest('[data-action="toggle-save"]');
  if (saveBtn) {
    const resId = saveBtn.getAttribute("data-id");
    toggleSave(resId);
  }
});

// Category Filter Click
categoryFilters.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter-pill")) {
    document.querySelectorAll(".filter-pill").forEach(btn => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    e.target.classList.add("active");
    e.target.setAttribute("aria-selected", "true");
    currentCategory = e.target.getAttribute("data-category");
    renderDirectory();
  }
});

// Search Filter Input
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  clearSearchBtn.style.display = searchQuery ? "block" : "none";
  renderDirectory();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  clearSearchBtn.style.display = "none";
  renderDirectory();
});

// Clear All Saved Resources
clearAllSavedBtn.addEventListener("click", () => {
  if (savedResourceIds.length === 0) return;
  if (confirm("Are you sure you want to clear all your saved bookmarks?")) {
    savedResourceIds = [];
    localStorage.removeItem("herguide_saved_ids");
    renderDirectory();
    renderSavedResources();
    showToast("All bookmarks cleared.");
  }
});

// Mobile Navbar Toggle
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// Close mobile menu when clicking any nav link
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

// 10. AI Assistant Live Conversation (Gemini POST /api/ask)
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = chatInput.value.trim();
  if (!userText) return;

  // Render User Message
  appendChatMessage(userText, "user");
  chatInput.value = "";

  // Show temporary "Thinking..." state
  const thinkingMessageDiv = appendChatMessage("Thinking...", "assistant", true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    // Update thinking bubble with Gemini's reply
    updateChatMessage(thinkingMessageDiv, data.reply || "No response received.");
  } catch (error) {
    console.error("AI Assistant error:", error);
    updateChatMessage(
      thinkingMessageDiv,
      "Sorry, I encountered an issue while connecting to the assistant. Please try again shortly."
    );
  }
});

function appendChatMessage(text, sender, isThinking = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${sender}-message`;
  if (isThinking) {
    messageDiv.classList.add("chat-thinking");
  }

  const avatar = sender === "assistant" ? "💜" : "👩";
  const formattedText = formatChatMessageText(text);

  messageDiv.innerHTML = `
    <div class="chat-avatar">${avatar}</div>
    <div class="chat-bubble"><p>${formattedText}</p></div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return messageDiv;
}

function updateChatMessage(messageElement, newText) {
  if (!messageElement) return;
  messageElement.classList.remove("chat-thinking");
  const bubble = messageElement.querySelector(".chat-bubble");
  if (bubble) {
    bubble.innerHTML = `<p>${formatChatMessageText(newText)}</p>`;
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatChatMessageText(text) {
  if (!text) return "";
  // Escape raw HTML characters to prevent XSS
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Format basic bold markdown **text** and linebreaks cleanly
  return escaped
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

// 11. Initial Load from API
loadResources();
