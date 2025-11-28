// frontend/parent.js
const API_BASE = "http://localhost:5000";

let PARENT_ID = null;

// ---------------------------------------------------------
// ИНИЦИАЛИЗАЦИЯ
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // проверяем авторизацию
  const raw = localStorage.getItem("razvitime_user");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    user = null;
  }

  // если не авторизован или не родитель — отправляем на страницу входа
  if (!user || user.role !== "parent" || !user.parent_id) {
    window.location.href = "auth.html#parent";
    return;
  }

  PARENT_ID = user.parent_id;

  // === КНОПКА ВЫХОДА ===
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("razvitime_user");
      localStorage.removeItem("razvitime_token");
      window.location.href = "index.html";
    });
  }

  // переключение вкладок (разделы кабинета)
  const tabButtons = document.querySelectorAll(".tab-btn[data-section]");
  const sections = document.querySelectorAll(".parent-section");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-section");
      tabButtons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => (s.style.display = "none"));
      btn.classList.add("active");
      const section = document.getElementById(target);
      if (section) section.style.display = "";
    });
  });

  // загрузки и настройка форм
  loadDashboard();
  loadKids();
  loadProfile();
  setupKidsForm();
  setupSearch();
  setupProfileSave();
  setupSchoolForm();   // форма для школьного расписания
  loadSchoolLessons(); // подгрузка школьных уроков
});

// ---------------------------------------------------------
// 2.1. Дашборд
// ---------------------------------------------------------
async function loadDashboard() {
  const greetingBox = document.getElementById("parent-greeting");
  const upcomingBox = document.getElementById("parent-upcoming");
  if (!greetingBox || !upcomingBox) return;

  try {
    const res = await fetch(
      `${API_BASE}/api/parent/dashboard?parentId=${PARENT_ID}`
    );
    const data = await res.json();

    greetingBox.innerHTML = `
      <h3>Здравствуйте, ${data.parent_name || "родитель"}!</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number stat-green">${data.kids_count}</div>
          <div class="stat-label">Детей</div>
        </div>
        <div class="stat-card">
          <div class="stat-number stat-orange">${data.enrollments_count}</div>
          <div class="stat-label">Активных записей в кружки</div>
        </div>
      </div>
    `;

    if (!data.upcoming || data.upcoming.length === 0) {
      upcomingBox.textContent = "Пока нет подтверждённых занятий.";
    } else {
      upcomingBox.innerHTML = `
        <ul class="upcoming-list">
          ${data.upcoming
            .map(
              (u) => `
            <li>
              ${weekdayName(u.weekday)}, ${u.start_time.slice(
                0,
                5
              )}–${u.end_time.slice(0, 5)} —
              ${u.activity_title} (${u.kid_name}), ${u.center_name}
            </li>`
            )
            .join("")}
        </ul>
      `;
    }
  } catch (err) {
    console.error("dashboard error", err);
    greetingBox.textContent = "Ошибка загрузки дашборда (проверьте сервер).";
    upcomingBox.textContent = "";
  }
}

function weekdayName(num) {
  const map = {
    1: "Пн",
    2: "Вт",
    3: "Ср",
    4: "Чт",
    5: "Пт",
    6: "Сб",
    7: "Вс",
  };
  return map[num] || "";
}

// ---------------------------------------------------------
// 2.3. Дети (CRUD)
// ---------------------------------------------------------
let editingKidId = null;

async function loadKids() {
  const list = document.getElementById("kids-list");
  if (!list) return;
  try {
    const res = await fetch(
      `${API_BASE}/api/parent/kids?parentId=${PARENT_ID}`
    );
    const kids = await res.json();

    if (kids.length === 0) {
      list.innerHTML = "<p>Пока нет добавленных детей.</p>";
      return;
    }

    list.innerHTML = kids
      .map((kid) => {
        const age = kid.birth_date ? calcAge(kid.birth_date) : "—";
        return `
        <div class="split-card">
          <div style="display:flex; gap:12px;">
            <div>
              ${
                kid.photo_url
                  ? `<img src="${kid.photo_url}" alt="${kid.full_name}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">`
                  : `<div style="width:60px;height:60px;border-radius:50%;background:#e4f6e4;display:flex;align-items:center;justify-content:center;font-size:24px;">${
                      kid.full_name[0] || "?"
                    }</div>`
              }
            </div>
            <div>
              <h3>${kid.full_name}</h3>
              <p class="section-subtitle">Возраст: ${age}</p>
            </div>
          </div>
          <div class="split-card-footer">
            <button class="btn btn-secondary btn-sm" onclick="editKid(${
              kid.id
            }, '${kid.full_name}', '${kid.birth_date || ""}', '${
          kid.gender || ""
        }', '${kid.photo_url || ""}')">
              Редактировать
            </button>
            <button class="btn btn-outline btn-sm" onclick="deleteKid(${
              kid.id
            })">Удалить</button>
          </div>
        </div>`;
      })
      .join("");
  } catch (err) {
    console.error("kids load error", err);
    list.textContent = "Ошибка загрузки списка детей.";
  }
}

function calcAge(dateStr) {
  // dateStr формата "YYYY-MM-DD"
  const [y, m, d] = dateStr.split("-").map(Number);
  const birth = new Date(y, m - 1, d);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const mDiff = now.getMonth() - birth.getMonth();
  if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return `${age} лет`;
}

function setupKidsForm() {
  const addBtn = document.getElementById("add-kid-btn");
  const formBlock = document.getElementById("kid-form-block");
  const title = document.getElementById("kid-form-title");
  const saveBtn = document.getElementById("kid-save-btn");
  const cancelBtn = document.getElementById("kid-cancel-btn");

  if (!addBtn || !formBlock) return;

  addBtn.addEventListener("click", () => {
    editingKidId = null;
    title.textContent = "Добавить ребёнка";
    document.getElementById("kid-name").value = "";
    document.getElementById("kid-birth").value = "";
    document.getElementById("kid-gender").value = "";
    document.getElementById("kid-photo").value = "";
    formBlock.style.display = "block";
  });

  cancelBtn.addEventListener("click", () => {
    formBlock.style.display = "none";
  });

  saveBtn.addEventListener("click", async () => {
    const full_name = document.getElementById("kid-name").value.trim();
    const birth_date = document.getElementById("kid-birth").value || null;
    const gender = document.getElementById("kid-gender").value || null;
    const photo_url = document.getElementById("kid-photo").value || null;

    if (!full_name) {
      alert("Введите имя ребёнка");
      return;
    }

    const body = { full_name, birth_date, gender, photo_url };
    const url =
      editingKidId === null
        ? `${API_BASE}/api/parent/kids?parentId=${PARENT_ID}`
        : `${API_BASE}/api/parent/kids/${editingKidId}?parentId=${PARENT_ID}`;
    const method = editingKidId === null ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      formBlock.style.display = "none";
      loadKids();
    } catch (err) {
      console.error("kid save error", err);
      alert("Ошибка сохранения ребёнка");
    }
  });
}

function editKid(id, name, birth, gender, photo) {
  editingKidId = id;
  const formBlock = document.getElementById("kid-form-block");
  const title = document.getElementById("kid-form-title");

  title.textContent = "Редактировать ребёнка";
  document.getElementById("kid-name").value = name;
  document.getElementById("kid-birth").value = birth || "";
  document.getElementById("kid-gender").value = gender || "";
  document.getElementById("kid-photo").value = photo || "";
  formBlock.style.display = "block";
}

async function deleteKid(id) {
  if (!confirm("Удалить этого ребёнка?")) return;
  try {
    const res = await fetch(
      `${API_BASE}/api/parent/kids/${id}?parentId=${PARENT_ID}`,
      { method: "DELETE" }
    );
    if (!res.ok) throw new Error("Ошибка удаления");
    loadKids();
  } catch (err) {
    console.error("kid delete error", err);
    alert("Ошибка удаления ребёнка");
  }
}

// ---------------------------------------------------------
// 2.4. Поиск кружков
// ---------------------------------------------------------
function setupSearch() {
  const btn = document.getElementById("search-activities-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const city = document.getElementById("filter-city").value.trim();
    const age = document.getElementById("filter-age").value.trim();
    const category = document.getElementById("filter-category").value;

    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (age) params.append("age", age);
    if (category) params.append("category", category);

    const box = document.getElementById("activities-results");
    box.textContent = "Загрузка...";

    try {
      const res = await fetch(
        `${API_BASE}/api/parent/search-activities?${params.toString()}`
      );
      const activities = await res.json();
      if (!activities.length) {
        box.textContent = "Ничего не найдено.";
        return;
      }

      box.innerHTML = activities
        .map(
          (a) => `
        <article class="activity-card">
          <div class="activity-main">
            <h3>${a.title}</h3>
            <div class="activity-meta">${a.center_name} · ${a.center_city}</div>
            <div class="activity-tags">
              <span class="tag-chip">${a.category || "Без категории"}</span>
              ${
                a.min_age || a.max_age
                  ? `<span class="tag-chip">${a.min_age || "?"}–${
                      a.max_age || "?"
                    } лет</span>`
                  : ""
              }
            </div>
          </div>
          <div class="activity-side">
            <div class="activity-price">Цена по запросу</div>
            <div>
              <button class="btn btn-primary btn-sm" onclick="openActivity(${a.id})">
                Подробнее
              </button>
            </div>
          </div>
        </article>`
        )
        .join("");
    } catch (err) {
      console.error("search error", err);
      box.textContent = "Ошибка поиска кружков.";
    }
  });
}

function openActivity(id) {
  // можно сделать отдельную страницу activity.html?id=...
  window.location.href = `activity.html?id=${id}`;
}

// ---------------------------------------------------------
// 2.2. Профиль родителя
// ---------------------------------------------------------
async function loadProfile() {
  try {
    const res = await fetch(
      `${API_BASE}/api/parent/profile?parentId=${PARENT_ID}`
    );
    const p = await res.json();

    document.getElementById("profile-city").value = p.city || "";
    document.getElementById("profile-phone").value = p.phone || "";
    document.getElementById("profile-telegram").value = p.telegram || "";
    document.getElementById("profile-whatsapp").value = p.whatsapp || "";
    document.getElementById("profile-extra-email").value =
      p.extra_email || "";
    document.getElementById("profile-avatar").value = p.avatar_url || "";
  } catch (err) {
    console.error("profile load error", err);
  }
}

function setupProfileSave() {
  const btn = document.getElementById("profile-save-btn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const body = {
      city: document.getElementById("profile-city").value.trim(),
      phone: document.getElementById("profile-phone").value.trim(),
      telegram: document.getElementById("profile-telegram").value.trim(),
      whatsapp: document.getElementById("profile-whatsapp").value.trim(),
      extra_email: document
        .getElementById("profile-extra-email")
        .value.trim(),
      avatar_url: document.getElementById("profile-avatar").value.trim(),
    };
    try {
      const res = await fetch(
        `${API_BASE}/api/parent/profile?parentId=${PARENT_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Ошибка сохранения");
      alert("Профиль сохранён");
    } catch (err) {
      console.error("profile save error", err);
      alert("Ошибка сохранения профиля");
    }
  });
}

// ---------------------------------------------------------
// ШКОЛЬНОЕ РАСПИСАНИЕ (school_lessons)
// ---------------------------------------------------------
async function loadSchoolLessons() {
  const box = document.getElementById("school-lessons-list");
  const kidSelect = document.getElementById("school-kid-select");
  if (!box || !kidSelect || !PARENT_ID) return;

  try {
    // сначала загрузим детей, чтобы заполнить селект
    const kidsRes = await fetch(
      `${API_BASE}/api/parent/kids?parentId=${PARENT_ID}`
    );
    const kids = await kidsRes.json();
    kidSelect.innerHTML = kids
      .map((k) => `<option value="${k.id}">${k.full_name}</option>`)
      .join("");

    const res = await fetch(
      `${API_BASE}/api/parent/school-lessons?parentId=${PARENT_ID}`
    );
    const lessons = await res.json();

    if (!lessons.length) {
      box.textContent = "Пока нет школьного расписания.";
      return;
    }

    box.innerHTML = `
      <ul class="upcoming-list">
        ${lessons
          .map(
            (l) =>
              `<li>${l.kid_name}: ${weekdayName(
                l.weekday
              )}, урок ${l.lesson_number || "?"} — ${l.subject}</li>`
          )
          .join("")}
      </ul>
    `;
  } catch (err) {
    console.error("school lessons load error", err);
    box.textContent = "Ошибка загрузки школьного расписания.";
  }
}

function setupSchoolForm() {
  const btn = document.getElementById("school-add-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const kid_id = document.getElementById("school-kid-select").value;
    const weekday = document.getElementById("school-weekday").value;
    const lesson_number =
      document.getElementById("school-lesson-number").value;
    const subject = document
      .getElementById("school-subject")
      .value.trim();

    if (!kid_id || !weekday || !subject) {
      alert("Выберите ребёнка, день и введите предмет");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/parent/school-lessons?parentId=${PARENT_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kid_id: Number(kid_id),
            weekday: Number(weekday),
            lesson_number: lesson_number ? Number(lesson_number) : null,
            subject,
          }),
        }
      );
      if (!res.ok) throw new Error("Ошибка сохранения");
      document.getElementById("school-subject").value = "";
      loadSchoolLessons();
    } catch (err) {
      console.error("school lessons save error", err);
      alert("Ошибка сохранения урока");
    }
  });
}
