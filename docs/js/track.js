document.addEventListener("DOMContentLoaded", function () {

  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  const trackStatus = document.getElementById("trackStatus");

  if (reports.length === 0) {
    trackStatus.innerHTML = "<p>No report found.</p>";
    return;
  }

  // Simulate status change (for testing)
  reports[reports.length - 1].status = "Accepted";
  reports[reports.length - 1].volunteer = {
    name: "Rahul Sharma",
    location: "3 km away"
  };

  localStorage.setItem("reports", JSON.stringify(reports));

  const latestReport = reports[reports.length - 1];

  if (latestReport.status === "Pending") {
    trackStatus.innerHTML = "<p>Your request is under review...</p>";
  }

  else if (latestReport.status === "Rejected") {
    trackStatus.innerHTML = `
      <p style="color:red;">Your request has been rejected.</p>
      <button onclick="location.href='report.html'">Re-enter Details</button>
      <button onclick="location.href='home.html'">Go Home</button>
    `;
  }

  else if (latestReport.status === "Accepted") {
    trackStatus.innerHTML = `
      <p style="color:green;">Your request has been accepted!</p>
      <h3>Volunteer Details:</h3>
      <p>Name: ${latestReport.volunteer.name}</p>
      <p>Location: ${latestReport.volunteer.location}</p>
      <button id="chatBtn">Chat with Volunteer</button>
    `;
  }

});