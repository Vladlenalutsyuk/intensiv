// frontend/auth.js


document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");
  const roleParentBtn = document.getElementById("role-parent");
  const roleCenterBtn = document.getElementById("role-center");
  const hiddenRole = document.getElementById("role-input");
  const statusBox = document.getElementById("auth-status");

  if (!authForm) return;

  function setRole(role) {
    hiddenRole.value = role;
    if (role === "parent") {
      roleParentBtn.classList.add("active");
      roleCenterBtn.classList.remove("active");
    } else {
      roleCenterBtn.classList.add("active");
      roleParentBtn.classList.remove("active");
    }
  }

  // Если пришли с хэшем #center или #parent
  if (location.hash === "#center") setRole("center_admin");
  else setRole("parent");

  roleParentBtn.addEventListener("click", () => setRole("parent"));
  roleCenterBtn.addEventListener("click", () => setRole("center_admin"));

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.textContent = "Выполняем вход...";
    statusBox.className = "auth-status";

    const email = authForm.email.value.trim();
    const password = authForm.password.value.trim();
    const role = hiddenRole.value;

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        statusBox.textContent = data.error || "Ошибка входа";
        statusBox.className = "auth-status error";
        return;
      }

      // Сохраняем пользователя
      localStorage.setItem("razvitime_token", data.token);
      localStorage.setItem("razvitime_user", JSON.stringify(data.user));

      statusBox.textContent = "Успешный вход!";
      statusBox.className = "auth-status success";

      // Редирект по роли
      if (data.user.role === "parent") {
        window.location.href = "parent.html";
      } else if (data.user.role === "center_admin") {
        window.location.href = "center.html"; // позже сделаем кабинет центра
      }
    } catch (err) {
      console.error("auth error", err);
      statusBox.textContent = "Ошибка соединения с сервером.";
      statusBox.className = "auth-status error";
    }
  });
});
