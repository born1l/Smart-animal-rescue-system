document.addEventListener("DOMContentLoaded", function () {

  let selectedRole = "user";

  const roleButtons = document.querySelectorAll(".role-btn");
  const extraFields = document.getElementById("extraFields");
  const loginForm = document.getElementById("loginForm");

  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      roleButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedRole = btn.dataset.role;
      showFields(selectedRole);
    });
  });

  function showFields(role) {
    extraFields.innerHTML = "";

    if (role === "volunteer") {
      extraFields.innerHTML = `
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
      `;
    }

    if (role === "admin") {
      extraFields.innerHTML = `
        <input type="email" id="email" placeholder="Admin Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <input type="text" id="secret" placeholder="Admin Secret Code" required>
      `;
    }
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole })
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") window.location.href = "admin.html";
      else if (data.user.role === "volunteer") window.location.href = "volunteer.html";
      else window.location.href = "home.html";

    } catch (err) {
      alert("Server error. Is the backend running?");
    }
  });

});

// Backend test
fetch("http://localhost:5005/")
  .then(res => res.text())
  .then(data => console.log(data));