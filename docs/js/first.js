const loader = document.getElementById("loader");

setTimeout(() => {
  loader.style.opacity = "0";
  loader.style.transition = "opacity 0.5s ease";
  setTimeout(() => {
    loader.style.display = "none";
    window.location.href = "login.html";
  }, 500);
}, 2500);