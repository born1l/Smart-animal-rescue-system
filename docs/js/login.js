const BASE_URL = "http://localhost:5005";

document.addEventListener("DOMContentLoaded", function () {
  // ================= LOGIN / SIGNUP TOGGLE =================
  const loginSection = document.getElementById("loginSection");
  const signupSection = document.getElementById("signupSection");
  const showLoginBtn = document.getElementById("showLogin");
  const showSignupBtn = document.getElementById("showSignup");

  showLoginBtn.addEventListener("click", () => {
    loginSection.style.display = "block";
    signupSection.style.display = "none";
    showLoginBtn.classList.add("active");
    showSignupBtn.classList.remove("active");
  });
  showSignupBtn.addEventListener("click", () => {
    loginSection.style.display = "none";
    signupSection.style.display = "block";
    showSignupBtn.classList.add("active");
    showLoginBtn.classList.remove("active");
  });

  // ================= ROLE SWITCHER (LOGIN) =================
  let selectedRole = "user";
  const roleButtons = document.querySelectorAll("#loginSection .role-btn[data-role]");

  function showLoginFields(role) {
    const fields = document.getElementById("loginFields");
    if (role === "admin") {
      fields.innerHTML = `
        <input type="email" id="email" placeholder="Admin Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <input type="text" id="secret" placeholder="Admin Secret Code" required>
      `;
    } else {
      fields.innerHTML = `
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
      `;
    }
  }

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedRole = btn.dataset.role;
      showLoginFields(selectedRole);
    });
  });

  // Show default fields on load
  showLoginFields("user");

  // ================= LOGIN SUBMIT =================
  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "admin") window.location.href = "admin.html";
      else if (data.user.role === "volunteer") window.location.href = "volunteer.html";
      else window.location.href = "home.html";
    } catch {
      alert("Server error. Is the backend running?");
    }
  });

  // ================= SIGNUP SUBMIT =================
  document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const phone = document.getElementById("signupPhone").value;
    const role = document.getElementById("signupRole").value;
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone, role })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Signup failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.user.role === "volunteer") window.location.href = "volunteer.html";
      else window.location.href = "home.html";
    } catch {
      alert("Server error. Is the backend running?");
    }
  });
});