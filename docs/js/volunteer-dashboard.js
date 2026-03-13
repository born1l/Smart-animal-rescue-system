const BASE_URL = "http://localhost:5005";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

// Redirect if not volunteer
if (!token || user.role !== "volunteer") window.location.href = "login.html";

let allCases = [];

// ================= PROFILE =================
const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayPhone = document.getElementById("displayPhone");
if (displayName) displayName.textContent = user.name || "Volunteer";
if (displayEmail) displayEmail.textContent = user.email || "";
if (displayPhone) displayPhone.textContent = user.phone || "";

// ================= LOAD CASES =================
async function loadCases(filter = "all") {
    try {
        const res = await fetch(`${BASE_URL}/api/reports`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        allCases = await res.json();
        updateStats();
        renderCases(filter);
    } catch {
        document.getElementById("caseList").innerHTML = "<p>Could not load cases.</p>";
    }
}

function updateStats() {
    const total = allCases.length;
    const open = allCases.filter(c => c.status === "open").length;
    const active = allCases.filter(c => c.status === "in-progress").length;
    const rescued = allCases.filter(c => c.status === "rescued").length;
    const statTotal = document.getElementById("statTotal");
    const statOpen = document.getElementById("statOpen");
    const statActive = document.getElementById("statActive");
    const statRescued = document.getElementById("statRescued");
    if (statTotal) statTotal.textContent = total;
    if (statOpen) statOpen.textContent = open;
    if (statActive) statActive.textContent = active;
    if (statRescued) statRescued.textContent = rescued;
}

function renderCases(filter = "all") {
    const caseList = document.getElementById("caseList");
    if (!caseList) return;
    const filtered = filter === "all" ? allCases : allCases.filter(c => c.status === filter);
    if (!filtered.length) {
        caseList.innerHTML = "<p>No cases found.</p>";
        return;
    }
    caseList.innerHTML = filtered.map(c => `
        <div class="case-item">
            <div class="case-info">
                <p class="case-title">${c.animalType} — ${c.location}</p>
                <p class="case-location">Urgency: ${c.urgency}</p>
                <p class="case-status">Status: ${c.status}</p>
                ${c.description ? `<p class="case-notes">${c.description}</p>` : ""}
            </div>
            <button class="updateStatusBtn" data-id="${c._id}">Update Status</button>
        </div>
    `).join("");

    document.querySelectorAll(".updateStatusBtn").forEach(btn => {
        btn.addEventListener("click", () => openUpdateModal(btn.dataset.id));
    });
}

// ================= FILTER TABS =================
document.querySelectorAll(".filterBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderCases(btn.dataset.filter);
    });
});

// ================= UPDATE MODAL =================
let editingCaseId = null;

function openUpdateModal(id) {
    editingCaseId = id;
    const c = allCases.find(x => x._id === id);
    if (!c) return;
    const modalCaseId = document.getElementById("modalCaseId");
    const statusSelect = document.getElementById("statusSelect");
    const caseNotes = document.getElementById("caseNotes");
    if (modalCaseId) modalCaseId.textContent = `${c.animalType} — ${c.location}`;
    if (statusSelect) statusSelect.value = c.status;
    if (caseNotes) caseNotes.value = c.description || "";
    document.getElementById("updateModal").classList.add("active");
}

document.getElementById("cancelUpdate")?.addEventListener("click", () => {
    document.getElementById("updateModal").classList.remove("active");
});

document.getElementById("saveUpdate")?.addEventListener("click", async () => {
    const status = document.getElementById("statusSelect").value;
    try {
        await fetch(`${BASE_URL}/api/reports/${editingCaseId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        document.getElementById("updateModal").classList.remove("active");
        loadCases(document.querySelector(".filterBtn.active")?.dataset.filter || "all");
    } catch {
        alert("Failed to update case.");
    }
});

// ================= LOGOUT =================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    document.getElementById("logoutModal").classList.add("active");
});
document.getElementById("cancelLogout")?.addEventListener("click", () => {
    document.getElementById("logoutModal").classList.remove("active");
});
document.getElementById("confirmLogout")?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

// ================= INIT =================
loadCases();