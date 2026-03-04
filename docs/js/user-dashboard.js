// ==========================
// User Dashboard JS
// ==========================

// Initialize map on the home page
document.addEventListener("DOMContentLoaded", function () {
  const mapElem = document.getElementById('map');
  if (mapElem) {
    const map = L.map('map').setView([26.1445, 91.7362], 13);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        map.setView([lat, lng], 14);
        L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();

        // Nearby places (mock)
        const places = [
          { name: "Happy Paws Clinic", lat: lat + 0.01, lng: lng + 0.01 },
          { name: "Animal Rescue Center", lat: lat - 0.01, lng: lng - 0.01 },
          { name: "Vet Care Hospital", lat: lat + 0.015, lng: lng - 0.005 }
        ];
        places.forEach(p => L.marker([p.lat, p.lng]).addTo(map).bindPopup(p.name));
      }, () => alert("Geolocation failed. Showing default location."));
    }
  }

  // Fetch daily quote
  const quoteTextElem = document.getElementById("quote-text");
  if (quoteTextElem) {
    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(data => {
        quoteTextElem.textContent = `"${data.content}" — ${data.author}`;
      })
      .catch(() => {
        quoteTextElem.textContent = "Stay pawsitive and help animals today! 🐾";
      });
  }

  // Report form JS
  const reportForm = document.getElementById('reportForm');
  if (reportForm) {
    const reportList = document.getElementById('reportList');
    const locationInput = document.getElementById('location');
    const getLocationBtn = document.getElementById('getLocation');
    const photoInput = document.getElementById('photo');
    const takePhotoBtn = document.getElementById('takePhoto');

    // Get user location
    getLocationBtn?.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            locationInput.value = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
          },
          () => alert("Could not get your location. Please enter manually.")
        );
      }
    });

    // Trigger file input on camera button
    takePhotoBtn?.addEventListener('click', () => photoInput?.click());

    // Load saved reports
    const storedReports = JSON.parse(localStorage.getItem('reports')) || [];
    storedReports.forEach(addReportRow);

    // Submit new report
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const report = {
        animal: document.getElementById('animalType').value,
        location: locationInput.value,
        description: document.getElementById('description').value,
        urgency: document.getElementById('urgency').value,
        status: "Pending",
        photoURL: photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : ""
      };

      // Save to localStorage
      const reports = JSON.parse(localStorage.getItem('reports')) || [];
      reports.push(report);
      localStorage.setItem('reports', JSON.stringify(reports));

      // Add to table
      addReportRow(report);

      // Reset form
      reportForm.reset();
    });

    // Helper function to add a row
    function addReportRow(report) {
      const row = document.createElement('tr');
      if (report.urgency === "high") row.style.backgroundColor = "#ffcccc";
      row.innerHTML = `
        <td>${report.animal}</td>
        <td>${report.location}</td>
        <td>${report.description}</td>
        <td>${report.urgency}</td>
        <td>${report.status}</td>
        <td>${report.photoURL ? `<img src="${report.photoURL}" width="80" style="border-radius:6px;">` : "No Photo"}</td>
      `;
      reportList.appendChild(row);
    }
  }

  // ==========================
  // SOS Button: Open report.html directly
  // ==========================
  const sosBtn = document.getElementById('sosBtn');
  sosBtn?.addEventListener('click', () => {
    window.location.href = "report.html";
  });

  // ==========================
  // Navbar links open separate HTML pages
  // ==========================
  document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', (e) => {
      // Optionally, prevent default for some logic
      // e.preventDefault();
      // window.location.href = link.href; // already works as default
    });
  });
});

const clearBtn = document.getElementById('clearReports');

clearBtn?.addEventListener('click', () => {
  if (confirm("Are you sure you want to delete all reports?")) {
    localStorage.removeItem('reports'); // clears all saved reports

    // Clear table content
    const reportList = document.getElementById('reportList');
    reportList.innerHTML = '';

    alert("All reports have been cleared!");
  }
});

