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

    if(role === "volunteer"){
      extraFields.innerHTML = `
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
      `;
    }

    if(role === "admin"){
      extraFields.innerHTML = `
        <input type="email" placeholder="Admin Email" required>
        <input type="password" placeholder="Password" required>
        <input type="text" placeholder="Admin Secret Code" required>
      `;
    }
  }

  // 🔥 LOGIN FIX
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    localStorage.setItem("loggedIn", "true");
    window.location.href = "home.html";
  });

});