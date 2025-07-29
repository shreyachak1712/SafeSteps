const tips = [
  // Travel
  { text: "🔔 Always stay alert in unfamiliar surroundings", category: "travel" },
  { text: "💼 Keep emergency tools like pepper spray handy", category: "travel" },
  { text: "🧭 Carry a fully charged phone and power bank while traveling", category: "travel" },
  { text: "🚌 Prefer public transport over walking alone in unknown places", category: "travel" },
  { text: "📱 Save emergency numbers in speed dial before trips", category: "travel" },

  // Night Safety
  { text: "🌃 Avoid isolated roads when walking alone at night", category: "night" },
  { text: "🌙 Let a friend know your live location if traveling at night", category: "night" },
  { text: "🚶 Walk confidently and avoid distractions like using your phone", category: "night" },
  { text: "💡 Stay in well-lit areas during night walks", category: "night" },

  // Home
  { text: "🚪 Lock all doors and windows when you're home alone", category: "home" },
  { text: "🧯 Keep a mini fire extinguisher in the kitchen", category: "home" },
  { text: "🔑 Avoid hiding spare keys under mats or flowerpots", category: "home" },
  { text: "🎥 Install basic surveillance or doorbell camera", category: "home" },

  // Online
  { text: "📵 Don’t share personal info on unknown websites", category: "online" },
  { text: "🔐 Use strong passwords and 2FA for social accounts", category: "online" },
  { text: "👀 Avoid clicking suspicious links even if sent by a friend", category: "online" },
  { text: "📲 Regularly update your phone's OS and security apps", category: "online" },

  // All-purpose
  { text: "🧠 Trust your instincts – if something feels wrong, it probably is", category: "all" },
  { text: "🚨 Memorize local emergency contact numbers", category: "all" },
  { text: "👟 Wear comfortable footwear when heading out alone", category: "all" },
  { text: "🗣️ Learn a few self-defense techniques – they help boost confidence", category: "all" },
  { text: "🎒 Carry a whistle or personal alarm device", category: "all" },
  { text: "🎓 Attend local safety workshops or webinars", category: "all" }
];


const container = document.getElementById('tipContainer');

function displayTips(filteredTips) {
  container.innerHTML = '';
  filteredTips.forEach(tip => {
    const div = document.createElement('div');
    div.className = 'tip-card';
    div.textContent = tip.text;
    container.appendChild(div);
  });
}

function filterTips(category) {
  if (category === 'all') {
    displayTips(tips);
  } else {
    const filtered = tips.filter(tip => tip.category === category || tip.category === 'all');
    displayTips(filtered);
  }
}

function showRandomTip() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  container.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'tip-card';
  div.textContent = randomTip.text;
  container.appendChild(div);
}

// Initial load
displayTips(tips);

document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox, index) => {
  checkbox.addEventListener('change', () => {
    sessionStorage.setItem(`check-${index}`, checkbox.checked);
  });

  // Load previous state on page load
  const saved = sessionStorage.getItem(`check-${index}`);
  if (saved === 'true') checkbox.checked = true;
});

// Save checkbox state to localStorage
document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox, index) => {
  const key = `safety-check-${checkbox.id}`;
  
  // Restore saved state
  const saved = localStorage.getItem(key);
  if (saved === 'true') {
    checkbox.checked = true;
  }

  // Save state on change
  checkbox.addEventListener('change', () => {
    localStorage.setItem(key, checkbox.checked);
  });
});

// Reset Function
function resetChecklist() {
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
    localStorage.removeItem(`safety-check-${checkbox.id}`);
  });
}

function saveDailyChecklist() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  let checkedItems = [];

  document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox) => {
    if (checkbox.checked) {
      checkedItems.push(checkbox.id);
    }
  });

  let allData = JSON.parse(localStorage.getItem("dailySafetyHistory")) || {};
  allData[today] = checkedItems;
  localStorage.setItem("dailySafetyHistory", JSON.stringify(allData));

  alert("Checklist saved for today!");
  viewHistory(); // refresh history after saving
}

function viewHistory() {
  const data = JSON.parse(localStorage.getItem("dailySafetyHistory")) || {};
  let historyHtml = "<h3>🗂️ Checklist History</h3>";

  if (Object.keys(data).length === 0) {
    historyHtml += "<p>No history found yet.</p>";
  }

  for (const date in data) {
    historyHtml += `<strong>${date}</strong><ul>`;
    data[date].forEach(id => {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        historyHtml += `<li>${label.textContent}</li>`;
      } else {
        historyHtml += `<li>(Checklist item not found)</li>`;
      }
    });
    historyHtml += "</ul>";
  }

  document.getElementById("historySection").innerHTML = historyHtml;
}

// Optional: Load history automatically when page loads
window.addEventListener("DOMContentLoaded", viewHistory);
