// ✅ Firebase Auth & Firestore References
const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Safety Tips List
const tips = [
  { text: "🔔 Always stay alert in unfamiliar surroundings", category: "travel" },
  { text: "💼 Keep emergency tools like pepper spray handy", category: "travel" },
  { text: "🧭 Carry a fully charged phone and power bank while traveling", category: "travel" },
  { text: "🚌 Prefer public transport over walking alone in unknown places", category: "travel" },
  { text: "📱 Save emergency numbers in speed dial before trips", category: "travel" },

  { text: "🌃 Avoid isolated roads when walking alone at night", category: "night" },
  { text: "🌙 Let a friend know your live location if traveling at night", category: "night" },
  { text: "🚶 Walk confidently and avoid distractions like using your phone", category: "night" },
  { text: "💡 Stay in well-lit areas during night walks", category: "night" },

  { text: "🚪 Lock all doors and windows when you're home alone", category: "home" },
  { text: "🧯 Keep a mini fire extinguisher in the kitchen", category: "home" },
  { text: "🔑 Avoid hiding spare keys under mats or flowerpots", category: "home" },
  { text: "🎥 Install basic surveillance or doorbell camera", category: "home" },

  { text: "📵 Don’t share personal info on unknown websites", category: "online" },
  { text: "🔐 Use strong passwords and 2FA for social accounts", category: "online" },
  { text: "👀 Avoid clicking suspicious links even if sent by a friend", category: "online" },
  { text: "📲 Regularly update your phone's OS and security apps", category: "online" },

  { text: "🧠 Trust your instincts – if something feels wrong, it probably is", category: "all" },
  { text: "🚨 Memorize local emergency contact numbers", category: "all" },
  { text: "👟 Wear comfortable footwear when heading out alone", category: "all" },
  { text: "🗣️ Learn a few self-defense techniques – they help boost confidence", category: "all" },
  { text: "🎒 Carry a whistle or personal alarm device", category: "all" },
  { text: "🎓 Attend local safety workshops or webinars", category: "all" }
];

// ✅ Tip Display Logic
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
  const filtered = category === 'all'
    ? tips
    : tips.filter(tip => tip.category === category || tip.category === 'all');
  displayTips(filtered);
}

function showRandomTip() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  container.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'tip-card';
  div.textContent = randomTip.text;
  container.appendChild(div);
}

// Initial display
displayTips(tips);

// ✅ Save Checklist to Firestore
function saveDailyChecklist() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save your checklist.");
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const checkedItems = [];

  document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox) => {
    if (checkbox.checked) checkedItems.push(checkbox.id);
  });

  db.collection("checklists")
    .doc(user.uid)
    .set({ [today]: checkedItems }, { merge: true })
    .then(() => {
      alert("Checklist saved for today!");
      viewHistory();
    })
    .catch((err) => {
      console.error("❌ Error saving checklist:", err);
      alert("Error saving checklist. Try again.");
    });
}

// ✅ Load Checklist History
function viewHistory() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to view your history.");
    return;
  }

  db.collection("checklists")
    .doc(user.uid)
    .get()
    .then((doc) => {
      const data = doc.data() || {};
      let historyHtml = "<h3>🗂️ Checklist History</h3>";

      if (Object.keys(data).length === 0) {
        historyHtml += "<p>No history found yet.</p>";
      }

      for (const date in data) {
        historyHtml += `<strong>${date}</strong><ul>`;
        data[date].forEach((id) => {
          const label = document.querySelector(`label[for="${id}"]`);
          historyHtml += `<li>${label ? label.textContent : "✔️ " + id}</li>`;
        });
        historyHtml += "</ul>";
      }

      document.getElementById("historySection").innerHTML = historyHtml;
    })
    .catch((err) => {
      console.error("❌ Error loading history:", err);
      alert("Error loading history. Try again later.");
    });
}

// ✅ Reset All Checkboxes
function resetChecklist() {
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
}

// ✅ Auto-load History if Logged In
auth.onAuthStateChanged((user) => {
  if (user) {
    viewHistory();
  }
});
