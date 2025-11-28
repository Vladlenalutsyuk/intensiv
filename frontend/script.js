// frontend/script.js
const API_BASE = "http://localhost:5000";

async function loadStats() {
  const statsContainer = document.getElementById("stats-container");
  if (!statsContainer) return;

  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    const data = await res.json();

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number stat-green">${data.parents}</div>
          <div class="stat-label">Зарегистрированных родителей</div>
        </div>
        <div class="stat-card">
          <div class="stat-number stat-green">${data.kids}</div>
          <div class="stat-label">Детей в системе</div>
        </div>
        <div class="stat-card">
          <div class="stat-number stat-orange">${data.activities}</div>
          <div class="stat-label">Активных кружков</div>
        </div>
        <div class="stat-card">
          <div class="stat-number stat-green">${data.centers}</div>
          <div class="stat-label">Партнёрских центров</div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Ошибка загрузки статистики:", err);
    if (statsContainer) {
      statsContainer.textContent =
        "Не удалось загрузить статистику (проверьте сервер).";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // статистика на главной
  loadStats();

  // спрятать кнопки "Войти/Создать аккаунт" для авторизованного родителя
  let user = null;
  try {
    const raw = localStorage.getItem("razvitime_user");
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    user = null;
  }

  if (user && user.role === "parent") {
    const loginCtas = document.querySelectorAll(".js-login-cta");
    loginCtas.forEach((el) => {
      el.style.display = "none";
    });
  }
});
