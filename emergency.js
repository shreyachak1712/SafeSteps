// 📍 Share Location (unchanged)
function shareLocation() {
  const status = document.getElementById("locationStatus");

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const link = `https://maps.google.com/?q=${lat},${lon}`;
        navigator.clipboard.writeText(
          `I'm in trouble. Here's my location: ${link}`
        ).then(() => {
          status.textContent = "✅ Location copied! Share it via WhatsApp or SMS.";
        });
      },
      () => {
        status.textContent = "⚠️ Could not retrieve location. Please enable GPS.";
      }
    );
  } else {
    status.textContent = "❌ Geolocation not supported in this browser.";
  }
}

// ➕ Add Contact
function addContact() {
  const name = document.getElementById("contactName").value.trim();
  const number = document.getElementById("contactNumber").value.trim();

  if (name && number) {
    const contacts = JSON.parse(localStorage.getItem("trustedContacts")) || [];
    contacts.push({ name, number });
    localStorage.setItem("trustedContacts", JSON.stringify(contacts));
    displayContacts();
    document.getElementById("contactName").value = "";
    document.getElementById("contactNumber").value = "";
  }
}

// ❌ Delete Contact
function deleteContact(index) {
  const contacts = JSON.parse(localStorage.getItem("trustedContacts")) || [];
  contacts.splice(index, 1);
  localStorage.setItem("trustedContacts", JSON.stringify(contacts));
  displayContacts();
}

// 👥 Display Contacts
function displayContacts() {
  const container = document.getElementById("contactList");
  const contacts = JSON.parse(localStorage.getItem("trustedContacts")) || [];

  if (contacts.length === 0) {
    container.innerHTML = "<p>No trusted contacts yet.</p>";
    return;
  }

  container.innerHTML = contacts.map((c, i) => `
    <div class="contact-card">
      <strong>${c.name}</strong><br/>
      <a href="tel:${c.number}">📞 ${c.number}</a><br/>
      <button class="delete-btn" onclick="deleteContact(${i})">🗑️ Delete</button>
    </div>
  `).join("");
}

// Load contacts on page load
window.onload = displayContacts;
