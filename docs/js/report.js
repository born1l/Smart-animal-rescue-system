const BASE_URL = "http://localhost:5005";
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

// ============================
// Report Form Setup
// ============================
const reportForm = document.getElementById("reportForm");
const reportList = document.getElementById("reportList");
const imageInput = document.getElementById("animalImage");
const preview = document.getElementById("preview");

let model;

// ============================
// Load AI Model
// ============================
mobilenet.load().then(m => {
  model = m;
  console.log("AI Model Loaded");
});

// ============================
// Image Preview
// ============================
imageInput?.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
  }
});

// ============================
// Use My Location Button
// ============================
const getLocationBtn = document.getElementById("getLocation");
const locationInput = document.getElementById("location");

getLocationBtn?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  getLocationBtn.textContent = "📍 Fetching...";
  getLocationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        locationInput.value = data.display_name || `${lat}, ${lng}`;
      } catch {
        locationInput.value = `${lat}, ${lng}`;
      }

      getLocationBtn.textContent = "📍 Use My Location";
      getLocationBtn.disabled = false;
    },
    () => {
      alert("Could not get your location. Please enter it manually.");
      getLocationBtn.textContent = "📍 Use My Location";
      getLocationBtn.disabled = false;
    }
  );
});

// ============================
// Save Report to Backend
// ============================
async function saveReport() {
  const report = {
    animalType: document.getElementById("animalType").value,
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
    urgency: document.getElementById("urgency").value
  };

  try {
    const res = await fetch(`${BASE_URL}/api/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(report)
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to submit report.");
      return;
    }

    reportForm.reset();
    if (preview) preview.src = "";
    loadReports();
    alert("Report submitted successfully!");
  } catch {
    alert("Server error. Is the backend running?");
  }
}

// ============================
// Load Reports from Backend
// ============================
async function loadReports() {
  if (!reportList) return;

  try {
    const res = await fetch(`${BASE_URL}/api/reports/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const reports = await res.json();
    reportList.innerHTML = "";

    if (!reports.length) {
      reportList.innerHTML = `<tr><td colspan="5">No reports yet.</td></tr>`;
      return;
    }

    reports.forEach(report => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${report.animalType}</td>
        <td>${report.location}</td>
        <td>${report.description || "—"}</td>
        <td>${report.urgency}</td>
        <td>${report.status}</td>
      `;
      reportList.appendChild(row);
    });
  } catch {
    if (reportList) reportList.innerHTML = `<tr><td colspan="5">Could not load reports.</td></tr>`;
  }
}

// ============================
// Submit Report with AI Check
// ============================
reportForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!model) {
    alert("AI model still loading. Please wait.");
    return;
  }

  if (!imageInput.files.length) {
    alert("Please upload an image first.");
    return;
  }

  try {
    await preview.decode();
  } catch {
    alert("Image could not be loaded. Please try a different file.");
    return;
  }

  const predictions = await model.classify(preview);
  const label = predictions[0].className.toLowerCase();
  console.log("Prediction:", label);

  const animalKeywords = [
    "dog", "cat", "retriever", "animal", "bird", "fish", "snake",
    "horse", "cow", "elephant", "bear", "lion", "tiger", "rabbit",
    "hamster", "turtle", "frog", "deer", "wolf", "fox", "monkey",
    "parrot", "eagle", "owl", "crow", "duck", "goose", "hen",
    "rooster", "lizard", "gecko", "crocodile", "sheep", "goat",
    "pig", "donkey", "squirrel", "rat", "mouse", "bat", "otter",
    "seal", "penguin", "flamingo", "peacock", "panda", "koala"
  ];

  const isAnimal = animalKeywords.some(keyword => label.includes(keyword));

  if (!isAnimal) {
    alert("Please upload an image of an animal.");
    return;
  }

  await saveReport();
});

// ============================
// Clear Reports button (disabled — data is in DB now)
// ============================
const clearBtn = document.getElementById("clearReports");
clearBtn?.addEventListener("click", () => {
  alert("Reports are now stored in the database and cannot be cleared from here.");
});

// ============================
// Initial Load
// ============================
loadReports();
setInterval(loadReports, 10000);