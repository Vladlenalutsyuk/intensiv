// frontend/parent.js - полностью автономный с демо-данными
const DEMO_MODE = true; // Режим демо без API

// Демо данные
const DEMO_PARENT = {
  id: 1,
  name: "Иван Иванов",
  email: "ivan@example.com",
  phone: "+7-999-000-00-00",
  city: "Симферополь",
  telegram: "@ivanov",
  whatsapp: "+7-999-000-00-00",
  extra_email: "ivan.backup@mail.ru",
  avatar_url: ""
};

const DEMO_KIDS = [
  {
    id: 1,
    full_name: "Мария Иванова",
    birth_date: "2016-05-10",
    gender: "female",
    photo_url: "",
    age: 8
  },
  {
    id: 2,
    full_name: "Алексей Иванов",
    birth_date: "2019-09-22",
    gender: "male",
    photo_url: "",
    age: 5
  }
];

const DEMO_ACTIVITIES = [
  {
    id: 1,
    center_id: 1,
    center_name: "Демо Центр развития детей",
    title: "Творческая мастерская",
    category: "творчество",
    description: "Рисование, лепка и поделки для детей 6–10 лет.",
    min_age: 6,
    max_age: 10,
    price: "Цена по запросу",
    city: "Симферополь",
    address: "ул. Пушкина, 10"
  },
  {
    id: 2,
    center_id: 1,
    center_name: "Демо Центр развития детей",
    title: "Гимнастика для детей",
    category: "спорт",
    description: "Общая физическая подготовка и растяжка.",
    min_age: 5,
    max_age: 9,
    price: "1500 руб/мес",
    city: "Симферополь",
    address: "ул. Пушкина, 10"
  },
  {
    id: 3,
    center_id: 1,
    center_name: "Демо Центр развития детей",
    title: "Программирование для детей",
    category: "наука",
    description: "Основы программирования в игровой форме.",
    min_age: 9,
    max_age: 14,
    price: "2000 руб/мес",
    city: "Симферополь",
    address: "ул. Пушкина, 10"
  },
  {
    id: 4,
    center_id: 1,
    center_name: "Демо Центр развития детей",
    title: "Английский язык для малышей",
    category: "языки",
    description: "Изучение английского через игры и песни.",
    min_age: 4,
    max_age: 7,
    price: "1800 руб/мес",
    city: "Симферополь",
    address: "ул. Пушкина, 10"
  }
];

const DEMO_SCHOOL_LESSONS = [
  {
    id: 1,
    kid_id: 1,
    kid_name: "Мария Иванова",
    item_type: "school",
    subject: "Математика",
    weekday: 1,
    lesson_number: 1,
    start_time: "09:00",
    end_time: "09:45"
  },
  {
    id: 2,
    kid_id: 1,
    kid_name: "Мария Иванова",
    item_type: "school",
    subject: "Русский язык",
    weekday: 1,
    lesson_number: 2,
    start_time: "10:00",
    end_time: "10:45"
  },
  {
    id: 3,
    kid_id: 1,
    kid_name: "Мария Иванова",
    item_type: "school",
    subject: "Окружающий мир",
    weekday: 1,
    lesson_number: 3,
    start_time: "11:00",
    end_time: "11:45"
  },
  {
    id: 4,
    kid_id: 2,
    kid_name: "Алексей Иванов",
    item_type: "school",
    subject: "Рисование",
    weekday: 2,
    lesson_number: 3,
    start_time: "11:00",
    end_time: "11:45"
  }
];

const DEMO_EXTRAS = [
  {
    id: 101,
    kid_id: 1,
    kid_name: "Мария Иванова",
    item_type: "extra",
    title: "Творческая мастерская",
    weekday: 2,
    start_time: "17:00",
    end_time: "18:00",
    center_name: "Демо Центр развития детей"
  },
  {
    id: 102,
    kid_id: 2,
    kid_name: "Алексей Иванов",
    item_type: "extra",
    title: "Гимнастика для детей",
    weekday: 3,
    start_time: "16:00",
    end_time: "17:00",
    center_name: "Демо Центр развития детей"
  },
  {
    id: 103,
    kid_id: 1,
    kid_name: "Мария Иванова",
    item_type: "extra",
    title: "Английский язык",
    weekday: 4,
    start_time: "18:00",
    end_time: "19:00",
    center_name: "Демо Центр развития детей"
  }
];

const DEMO_UPCOMING = [
  {
    id: 1,
    kid_name: "Мария Иванова",
    activity: "Творческая мастерская",
    date: "2025-02-20",
    time: "17:00",
    center: "Демо Центр развития детей"
  },
  {
    id: 2,
    kid_name: "Алексей Иванов",
    activity: "Гимнастика для детей",
    date: "2025-02-21",
    time: "16:00",
    center: "Демо Центр развития детей"
  }
];

let PARENT_ID = 1;
let editingKidId = null;
let SCHOOL_LESSONS = DEMO_SCHOOL_LESSONS;
let EXTRA_SLOTS = DEMO_EXTRAS;
let SCHEDULE_KIDS = DEMO_KIDS;
let currentScheduleView = "week";
let scheduleTypeFilter = "all";

// ---------------------------------------------------------
// ИНИЦИАЛИЗАЦИЯ
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log('✅ Parent page loaded in DEMO mode');
  
  // Создаем демо-пользователя в localStorage если его нет
  if (!localStorage.getItem("razvitime_user")) {
    const demoUser = {
      id: 1,
      role: "parent",
      parent_id: 1,
      name: "Иван Иванов",
      email: "ivan@example.com"
    };
    localStorage.setItem("razvitime_user", JSON.stringify(demoUser));
    console.log('Demo user created in localStorage');
  }
  
  // Загружаем пользователя из localStorage
  const raw = localStorage.getItem("razvitime_user");
  try {
    const user = JSON.parse(raw);
    if (user && user.parent_id) {
      PARENT_ID = user.parent_id;
    }
  } catch (e) {
    console.log('Error parsing user from localStorage');
  }

  // Кнопка выхода
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("razvitime_user");
      localStorage.removeItem("razvitime_token");
      window.location.href = "index.html";
    });
  }

  // Переключение вкладок
  const tabButtons = document.querySelectorAll(".tab-btn[data-section]");
  const sections = document.querySelectorAll(".parent-section");
  
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-section");
      tabButtons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => (s.style.display = "none"));
      btn.classList.add("active");
      const section = document.getElementById(target);
      if (section) {
        section.style.display = "";
        
        // Загружаем данные для активной вкладки
        switch(target) {
          case 'dashboard-section':
            loadDashboard();
            break;
          case 'kids-section':
            loadKids();
            break;
          case 'schedule-section':
            loadSchoolLessons();
            break;
          case 'search-section':
            setupSearch();
            break;
          case 'profile-section':
            loadProfile();
            break;
        }
      }
    });
  });

  // Активируем первую вкладку
  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }
  
  // Инициализация уведомлений
  setupNotificationsBell();
});

// ---------------------------------------------------------
// 2.1. Дашборд
// ---------------------------------------------------------
function loadDashboard() {
  const greetingBox = document.getElementById("parent-greeting");
  const upcomingBox = document.getElementById("parent-upcoming");
  if (!greetingBox || !upcomingBox) return;

  // 1) Приветствие
  greetingBox.innerHTML = `
    <div class="dashboard-hero">
      <h2 class="section-title" style="margin-bottom:8px;">
        Здравствуйте, ${DEMO_PARENT.name}!
      </h2>
      <p class="section-subtitle">
        РазвиТайм — это онлайн-помощник для родителей: здесь можно
        вести школьное расписание, записывать детей на кружки и
        получать напоминания о занятиях в одном удобном месте.
      </p>

      <div class="platform-info">
        <h3>Что умеет кабинет родителя</h3>
        <ul class="platform-info-list">
          <li>Добавлять детей и хранить их основные данные.</li>
          <li>Вести школьное расписание по предметам и урокам.</li>
          <li>Подбирать кружки и секции в городе в разделе «Найти занятия».</li>
          <li>Записывать ребёнка в группы центров (через заявки).</li>
          <li>Видеть общее расписание «школа + кружки» по дням недели.</li>
          <li>Настраивать напоминания о занятиях.</li>
          <li>Экспортировать расписание ребёнка в картинку для распечатки или отправки бабушке 😊</li>
        </ul>
      </div>

      <button class="btn btn-secondary btn-sm" id="parent-instruction-toggle">
        Инструкция по кабинету
      </button>

      <div id="parent-instruction" class="instruction-panel" style="display:none;">
        <ol>
          <li><strong>Добавьте детей</strong> во вкладке «Дети» — ФИО, дата рождения, опционально фото.</li>
          <li><strong>Заполните школьное расписание</strong> во вкладке «Расписание» через кнопку
              «Изменить школьное расписание».</li>
          <li><strong>Найдите кружки</strong> во вкладке «Найти занятия» и подберите подходящие по возрасту и городу.</li>
          <li><strong>Запишите ребёнка</strong> на занятия (через заявки в центр, если включено).</li>
          <li><strong>Следите за общим расписанием</strong> (школа + кружки) и выбирайте вид «день / неделя».</li>
          <li><strong>Настройте напоминания</strong> на вкладке «Напоминания» (email / Telegram / др.).</li>
          <li><strong>Экспортируйте расписание</strong> одним кликом в картинку, чтобы поделиться с семьёй.</li>
        </ol>
      </div>
    </div>
  `;

  const instructionToggle = document.getElementById("parent-instruction-toggle");
  const instructionPanel = document.getElementById("parent-instruction");
  if (instructionToggle && instructionPanel) {
    instructionToggle.addEventListener("click", () => {
      const visible = instructionPanel.style.display === "block";
      instructionPanel.style.display = visible ? "none" : "block";
    });
  }

  // 2) Ближайшие занятия
  if (DEMO_UPCOMING.length) {
    upcomingBox.innerHTML = `
      <ul class="upcoming-list">
        ${DEMO_UPCOMING
          .map(
            (x) => `
          <li>
            <strong>${x.kid_name}</strong> · ${x.activity}
            <br>
            ${x.date}, ${x.time}
            ${x.center ? ` · ${x.center}` : ""}
          </li>`
          )
          .join("")}
      </ul>
    `;
  } else {
    upcomingBox.textContent = "Пока нет записанных занятий.";
  }

  // 3) Карусель отзывов
  initReviewsCarousel();
}

// Карусель отзывов (оставляем как есть)
const DEMO_REVIEWS = [
  {
    center: "Демо Центр развития детей",
    text: "Очень нравится, что РазвиТайм собрал все занятия в одном расписании. Больше не путаемся с кружками!",
    parent: "Анна, мама Ани (9 лет)",
  },
  {
    center: "Школа плавания «Дельфин»",
    text: "Удобно видеть уроки и секции в одном месте. Ребёнок сам смотрит расписание и собирает рюкзак.",
    parent: "Марина, мама Ильи (7 лет)",
  },
  {
    center: "Студия творчества «АртMix»",
    text: "Добавила двум детям расписание школы и кружков — и наконец-то не забываю про сменку и форму.",
    parent: "Ольга, мама Даши и Кирилла",
  },
];

function initReviewsCarousel() {
  const carousel = document.getElementById("reviews-carousel");
  const dotsContainer = document.getElementById("reviews-dots");
  if (!carousel || !dotsContainer) return;

  carousel.innerHTML = "";
  dotsContainer.innerHTML = "";

  DEMO_REVIEWS.forEach((r, idx) => {
    const slide = document.createElement("div");
    slide.className = "review-slide" + (idx === 0 ? " active" : "");
    slide.innerHTML = `
      <div class="review-text">"${r.text}"</div>
      <div class="review-meta">
        <span class="review-center">${r.center}</span>
        <span class="review-parent">${r.parent}</span>
      </div>
    `;
    carousel.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "review-dot" + (idx === 0 ? " active" : "");
    dot.setAttribute("data-index", idx);
    dotsContainer.appendChild(dot);
  });

  let current = 0;
  const slides = carousel.querySelectorAll(".review-slide");
  const dots = dotsContainer.querySelectorAll(".review-dot");

  function goTo(idx) {
    if (slides[current]) slides[current].classList.remove("active");
    if (dots[current]) dots[current].classList.remove("active");
    current = idx;
    if (slides[current]) slides[current].classList.add("active");
    if (dots[current]) dots[current].classList.add("active");
  }

  dots.forEach((d) => {
    d.addEventListener("click", () => {
      const idx = Number(d.getAttribute("data-index"));
      goTo(idx);
    });
  });

  // Автопереключение
  setInterval(() => {
    const next = (current + 1) % slides.length;
    goTo(next);
  }, 5000);
}

// ---------------------------------------------------------
// 2.3. Дети (CRUD)
// ---------------------------------------------------------
function loadKids() {
  const list = document.getElementById("kids-list");
  if (!list) return;
  
  console.log('Loading kids:', DEMO_KIDS);

  if (DEMO_KIDS.length === 0) {
    list.innerHTML = "<p>Пока нет добавленных детей.</p>";
    updateKidsFilter([]);
    return;
  }

  list.innerHTML = DEMO_KIDS
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
            ${kid.gender ? `<p class="section-subtitle">Пол: ${kid.gender === 'male' ? 'мальчик' : 'девочка'}</p>` : ''}
          </div>
        </div>
        <div class="split-card-footer">
          <button class="btn btn-secondary btn-sm" onclick="editKid(${
            kid.id
          }, '${kid.full_name.replace(/'/g, "\\'")}', '${kid.birth_date || ""}', '${
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
    
  updateKidsFilter(DEMO_KIDS);
}

function calcAge(dateStr) {
  if (!dateStr) return "—";
  try {
    const clean = dateStr.includes("T") ? dateStr.slice(0, 10) : dateStr;
    const [y, m, d] = clean.split("-").map(Number);
    if (!y || !m || !d) return "—";
    const birth = new Date(y, m - 1, d);
    if (Number.isNaN(birth.getTime())) return "—";
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const mDiff = now.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} лет`;
  } catch {
    return "—";
  }
}

function normalizeDateForInput(value) {
  if (!value) return "";
  if (typeof value === "string" && value.includes("T")) {
    return value.slice(0, 10);
  }
  if (typeof value === "string" && value.length > 10) {
    return value.slice(0, 10);
  }
  return value;
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

  saveBtn.addEventListener("click", () => {
    const full_name = document.getElementById("kid-name").value.trim();
    const birth_date = document.getElementById("kid-birth").value || null;
    const gender = document.getElementById("kid-gender").value || null;
    const photo_url = document.getElementById("kid-photo").value || null;

    if (!full_name) {
      alert("Введите имя ребёнка");
      return;
    }

    if (editingKidId === null) {
      // Добавление нового ребенка
      const newKid = {
        id: DEMO_KIDS.length + 1,
        full_name,
        birth_date,
        gender,
        photo_url,
        age: birth_date ? calcAge(birth_date) : "—"
      };
      DEMO_KIDS.push(newKid);
      alert("Ребёнок добавлен");
    } else {
      // Редактирование существующего
      const kidIndex = DEMO_KIDS.findIndex(k => k.id === editingKidId);
      if (kidIndex !== -1) {
        DEMO_KIDS[kidIndex] = {
          ...DEMO_KIDS[kidIndex],
          full_name,
          birth_date,
          gender,
          photo_url,
          age: birth_date ? calcAge(birth_date) : "—"
        };
        alert("Данные обновлены");
      }
    }
    
    formBlock.style.display = "none";
    loadKids();
  });
}

function editKid(id, name, birth, gender, photo) {
  editingKidId = id;
  const formBlock = document.getElementById("kid-form-block");
  const title = document.getElementById("kid-form-title");

  title.textContent = "Редактировать ребёнка";
  document.getElementById("kid-name").value = name || "";
  document.getElementById("kid-birth").value = normalizeDateForInput(birth);
  document.getElementById("kid-gender").value = gender || "";
  document.getElementById("kid-photo").value = photo || "";
  formBlock.style.display = "block";
}

function deleteKid(id) {
  if (!confirm("Удалить этого ребёнка?")) return;
  const index = DEMO_KIDS.findIndex(k => k.id === id);
  if (index !== -1) {
    DEMO_KIDS.splice(index, 1);
    loadKids();
    alert("Ребёнок удалён");
  }
}

// Обновление фильтров с детьми
function updateKidsFilter(kids) {
  const kidSelect = document.getElementById("school-kid-select");
  const scheduleKidFilter = document.getElementById("schedule-kid-filter");
  
  SCHEDULE_KIDS = kids;

  if (kidSelect) {
    kidSelect.innerHTML = kids
      .map((k) => `<option value="${k.id}">${k.full_name}</option>`)
      .join("");
  }

  if (scheduleKidFilter) {
    scheduleKidFilter.innerHTML =
      `<option value="all">Все дети</option>` +
      kids
        .map((k) => `<option value="${k.id}">${k.full_name}</option>`)
        .join("");
  }
}

// ---------------------------------------------------------
// 2.4. Поиск кружков
// ---------------------------------------------------------
function setupSearch() {
  const btn = document.getElementById("search-activities-btn");
  const simpleBtn = document.getElementById("simple-search-btn");
  const textInput = document.getElementById("filter-text");
  if (!btn) return;

  function runSearch() {
    const text = textInput ? textInput.value.trim().toLowerCase() : "";
    const city = document.getElementById("filter-city").value.trim().toLowerCase();
    const age = document.getElementById("filter-age").value;
    const category = document.getElementById("filter-category").value;

    const box = document.getElementById("activities-results");
    box.textContent = "Поиск...";

    // Фильтрация
    let filtered = DEMO_ACTIVITIES;
    
    if (text) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(text) || 
        a.description.toLowerCase().includes(text) ||
        a.center_name.toLowerCase().includes(text)
      );
    }
    
    if (city) {
      filtered = filtered.filter(a => a.city.toLowerCase().includes(city));
    }
    
    if (age) {
      const ageNum = parseInt(age);
      filtered = filtered.filter(a => 
        ageNum >= a.min_age && ageNum <= a.max_age
      );
    }
    
    if (category && category !== "any") {
      filtered = filtered.filter(a => a.category === category);
    }

    setTimeout(() => {
      if (!filtered.length) {
        box.textContent = "Ничего не найдено. Попробуйте изменить фильтры.";
        return;
      }

      box.innerHTML = filtered
        .map(
          (a) => `
          <article class="activity-card">
            <div class="activity-main">
              <h3>${a.title}</h3>
              <div class="activity-meta">
                <button class="link-as-button" onclick="openCenter(${a.center_id})">
                  ${a.center_name}
                </button> · ${a.city}
              </div>
              <div class="activity-tags">
                <span class="tag-chip">${a.category || "Без категории"}</span>
                <span class="tag-chip">${a.min_age}–${a.max_age} лет</span>
              </div>
              <p class="activity-description">${a.description}</p>
            </div>
            <div class="activity-side">
              <div class="activity-price">${a.price}</div>
              <div>
                <button class="btn btn-primary btn-sm" onclick="openActivity(${a.id})">
                  Подробнее
                </button>
              </div>
            </div>
          </article>`
        )
        .join("");
    }, 300);
  }

  btn.addEventListener("click", runSearch);

  if (simpleBtn) {
    simpleBtn.addEventListener("click", runSearch);
  }

  if (textInput) {
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runSearch();
      }
    });
  }

  // ПЕРВЫЙ ЗАПУСК - показываем все занятия
  runSearch();
}

function openActivity(id) {
  const activity = DEMO_ACTIVITIES.find(a => a.id === id);
  if (activity) {
    alert(`🎨 ${activity.title}\n\n🏢 Центр: ${activity.center_name}\n📍 Адрес: ${activity.address}, ${activity.city}\n👶 Возраст: ${activity.min_age}-${activity.max_age} лет\n💰 ${activity.price}\n\n📝 Описание: ${activity.description}`);
  }
}

function openCenter(id) {
  alert(`🏢 Демо Центр развития детей\n\n📍 Адрес: ул. Пушкина, 10, Симферополь\n📞 Телефон: +7 978 000-00-01\n🌐 Сайт: https://demo-center1.ru\n\nВ реальном приложении здесь будет полная страница центра.`);
}

// ---------------------------------------------------------
// 2.2. Профиль родителя
// ---------------------------------------------------------
function loadProfile() {
  document.getElementById("profile-city").value = DEMO_PARENT.city || "";
  document.getElementById("profile-phone").value = DEMO_PARENT.phone || "";
  document.getElementById("profile-telegram").value = DEMO_PARENT.telegram || "";
  document.getElementById("profile-whatsapp").value = DEMO_PARENT.whatsapp || "";
  document.getElementById("profile-extra-email").value = DEMO_PARENT.extra_email || "";
  document.getElementById("profile-avatar").value = DEMO_PARENT.avatar_url || "";
}

function setupProfileSave() {
  const btn = document.getElementById("profile-save-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    DEMO_PARENT.city = document.getElementById("profile-city").value.trim();
    DEMO_PARENT.phone = document.getElementById("profile-phone").value.trim();
    DEMO_PARENT.telegram = document.getElementById("profile-telegram").value.trim();
    DEMO_PARENT.whatsapp = document.getElementById("profile-whatsapp").value.trim();
    DEMO_PARENT.extra_email = document.getElementById("profile-extra-email").value.trim();
    DEMO_PARENT.avatar_url = document.getElementById("profile-avatar").value.trim();
    
    alert("Профиль сохранён (демо-режим)");
  });
}

// ---------------------------------------------------------
// Расписание: школа + кружки
// ---------------------------------------------------------
const KID_COLOR_PALETTE = [
  "#c6f1a9", // зелёный бренда
  "#ffc7a6", // оранжевый бренда
  "#a9d5ff",
  "#f7b6ff",
  "#ffeaa6",
];

let KID_COLORS = {};

function initKidColors(kids) {
  kids.forEach((k, idx) => {
    if (!KID_COLORS[k.id]) {
      KID_COLORS[k.id] = KID_COLOR_PALETTE[idx % KID_COLOR_PALETTE.length];
    }
  });
}

function getKidColor(kidId) {
  return KID_COLORS[kidId] || "#e5f0ff";
}

function loadSchoolLessons() {
  const box = document.getElementById("school-lessons-list");
  const kidSelect = document.getElementById("school-kid-select");
  const scheduleKidFilter = document.getElementById("schedule-kid-filter");

  // Инициализируем цвета для детей
  initKidColors(DEMO_KIDS);

  if (kidSelect) {
    kidSelect.innerHTML = DEMO_KIDS
      .map((k) => `<option value="${k.id}">${k.full_name}</option>`)
      .join("");
  }

  SCHEDULE_KIDS = DEMO_KIDS;

  if (scheduleKidFilter) {
    scheduleKidFilter.innerHTML =
      `<option value="all">Все дети</option>` +
      DEMO_KIDS
        .map((k) => `<option value="${k.id}">${k.full_name}</option>`)
        .join("");
  }

  SCHOOL_LESSONS = DEMO_SCHOOL_LESSONS;
  EXTRA_SLOTS = DEMO_EXTRAS;

  if (box) {
    box.textContent = "Школьные уроки учитываются в общей таблице расписания выше.";
  }

  renderScheduleTable();
}

function renderScheduleTable() {
  const wrapper = document.getElementById("schedule-table-wrapper");
  const kidFilter = document.getElementById("schedule-kid-filter");
  if (!wrapper || !kidFilter) return;

  const kidId = kidFilter.value === "all" ? null : Number(kidFilter.value);

  // Фильтруем школьные уроки
  let lessons = SCHOOL_LESSONS;
  if (kidId) {
    lessons = lessons.filter((l) => l.kid_id === kidId);
  }

  // Фильтруем кружки
  let extra = EXTRA_SLOTS;
  if (kidId) {
    extra = extra.filter((e) => e.kid_id === kidId);
  }

  // Применяем фильтр типов
  if (scheduleTypeFilter === "school") {
    extra = [];
  } else if (scheduleTypeFilter === "extras") {
    lessons = [];
  }

  if (!lessons.length && !extra.length) {
    wrapper.textContent = "Расписание пока пусто. Добавьте школьные уроки и/или запишите ребёнка на кружки.";
    return;
  }

  const weekdays = [1, 2, 3, 4, 5, 6, 7];
  const weekdayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Максимальный номер урока
  const maxLesson = lessons.reduce((max, l) => Math.max(max, l.lesson_number || 1), 1) || 1;

  let visibleWeekdays = weekdays;
  if (currentScheduleView === "day") {
    const jsDay = new Date().getDay();
    const weekday = jsDay === 0 ? 7 : jsDay;
    visibleWeekdays = [weekday];
  }

  const headerTitle = currentScheduleView === "day" ? "Расписание на сегодня" : "Расписание на неделю";

  let html = `<h3 style="margin-top:0;margin-bottom:8px;">${headerTitle}</h3>`;
  html += `<div class="schedule-table-scroll"><table class="schedule-table">`;

  // THEAD
  html += "<thead><tr><th>Урок / блок</th>";
  visibleWeekdays.forEach((wd) => {
    html += `<th>${weekdayLabels[wd - 1]}</th>`;
  });
  html += "</tr></thead>";

  // TBODY
  html += "<tbody>";

  // 1) Строки с уроками школы
  for (let lessonNum = 1; lessonNum <= maxLesson; lessonNum++) {
    html += `<tr><td class="schedule-lesson-num">${lessonNum}</td>`;
    visibleWeekdays.forEach((wd) => {
      const cellItems = lessons.filter(
        (l) => (l.lesson_number || 1) === lessonNum && l.weekday === wd
      );
      if (!cellItems.length) {
        html += `<td class="schedule-cell schedule-cell-empty"></td>`;
      } else {
        const cellHtml = cellItems
          .map((l) => {
            const color = getKidColor(l.kid_id);
            return `
              <div class="schedule-badge schedule-badge-school" style="background:${color};">
                <div class="schedule-badge-subject">${l.subject || 'Предмет'}</div>
                <div class="schedule-badge-kid">${l.kid_name}</div>
              </div>
            `;
          })
          .join("");
        html += `<td class="schedule-cell">${cellHtml}</td>`;
      }
    });
    html += "</tr>";
  }

  // 2) ДОП. ЗАНЯТИЯ (КРУЖКИ)
  html += `<tr><td class="schedule-lesson-num">Кружки</td>`;
  visibleWeekdays.forEach((wd) => {
    const daySlots = extra.filter((e) => e.weekday === wd);
    if (!daySlots.length) {
      html += `<td class="schedule-cell schedule-cell-empty"></td>`;
    } else {
      const cellHtml = daySlots
        .map((e) => {
          const color = getKidColor(e.kid_id);
          return `
            <div class="schedule-badge schedule-badge-extra" style="border-color:${color};">
              <div class="schedule-badge-subject">${e.title || 'Кружок'}</div>
              <div class="schedule-badge-kid">
                ${e.kid_name} · ${e.start_time?.slice(0, 5) || '--:--'}-${e.end_time?.slice(0, 5) || '--:--'}
              </div>
              ${e.center_name ? `<div class="schedule-badge-center">${e.center_name}</div>` : ''}
            </div>
          `;
        })
        .join("");
      html += `<td class="schedule-cell">${cellHtml}</td>`;
    }
  });
  html += "</tr>";

  html += "</tbody></table></div>";

  wrapper.innerHTML = html;
}

function setupScheduleControls() {
  const kidFilter = document.getElementById("schedule-kid-filter");
  const viewButtons = document.querySelectorAll(".view-btn");
  const typeRadios = document.querySelectorAll('input[name="schedule-type"]');

  typeRadios.forEach((r) => {
    r.addEventListener("change", () => {
      scheduleTypeFilter = r.value || "all";
      renderScheduleTable();
    });
  });

  const toggleSchoolFormBtn = document.getElementById("toggle-school-form-btn");
  const schoolFormContainer = document.getElementById("school-form-container");

  if (kidFilter) {
    kidFilter.addEventListener("change", () => {
      renderScheduleTable();
    });
  }

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentScheduleView = btn.getAttribute("data-view") || "week";
      renderScheduleTable();
    });
  });

  if (toggleSchoolFormBtn && schoolFormContainer) {
    toggleSchoolFormBtn.addEventListener("click", () => {
      const visible = schoolFormContainer.style.display === "block";
      schoolFormContainer.style.display = visible ? "none" : "block";
    });
  }
}

function setupSchoolForm() {
  const btn = document.getElementById("school-add-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const kid_id = document.getElementById("school-kid-select").value;
    const weekday = document.getElementById("school-weekday").value;
    const lesson_number = document.getElementById("school-lesson-number").value;
    const subject = document.getElementById("school-subject").value.trim();

    if (!kid_id || !weekday || !subject) {
      alert("Выберите ребёнка, день и введите предмет");
      return;
    }

    const kid = DEMO_KIDS.find(k => k.id == kid_id);
    if (!kid) {
      alert("Ребёнок не найден");
      return;
    }

    const newLesson = {
      id: SCHOOL_LESSONS.length + 1,
      kid_id: Number(kid_id),
      kid_name: kid.full_name,
      item_type: "school",
      subject,
      weekday: Number(weekday),
      lesson_number: lesson_number ? Number(lesson_number) : null,
      start_time: "09:00",
      end_time: "09:45"
    };

    SCHOOL_LESSONS.push(newLesson);
    document.getElementById("school-subject").value = "";
    
    alert("Урок добавлен (демо-режим)");
    renderScheduleTable();
  });
}

function setupScheduleExport() {
  const btn = document.getElementById("export-schedule-btn");
  const wrapper = document.getElementById("schedule-table-wrapper");
  if (!btn || !wrapper) return;

  btn.addEventListener("click", () => {
    alert("В демо-режиме экспорт работает через библиотеку html2canvas. Для реального использования подключите эту библиотеку.");
  });
}

// ---------------------------------------------------------
// Уведомления
// ---------------------------------------------------------
function setupNotificationsBell() {
  const bell = document.getElementById("notifications-bell");
  const dropdown = document.getElementById("notifications-dropdown");
  const badge = document.getElementById("notifications-badge");
  
  if (!bell || !dropdown) return;

  const demoReminders = [
    {
      id: 1,
      title: "Завтра у Марии творческая мастерская",
      time_label: "Завтра в 17:00",
      center_name: "Демо Центр развития детей",
      note: "Не забудьте взять сменную обувь и фартук"
    },
    {
      id: 2,
      title: "У Алексея завтра гимнастика",
      time_label: "Завтра в 16:00",
      center_name: "Демо Центр развития детей",
      note: "Форма для занятий"
    }
  ];

  function renderNotifications() {
    dropdown.innerHTML = demoReminders
      .map(
        (r) => `
        <div class="notification-item">
          <div class="notification-title">${r.title}</div>
          <div class="notification-meta">
            ${r.time_label}${r.center_name ? " · " + r.center_name : ""}
          </div>
          ${r.note ? `<div class="notification-note">${r.note}</div>` : ""}
          <div class="notification-actions">
            <button class="btn btn-outline btn-sm" data-reminder-id="${r.id}">
              Закрыть
            </button>
          </div>
        </div>
      `
      )
      .join("");

    if (badge) {
      badge.hidden = demoReminders.length === 0;
      badge.textContent = demoReminders.length;
    }

    dropdown.querySelectorAll("button[data-reminder-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-reminder-id"));
        alert(`Напоминание #${id} закрыто (демо-режим)`);
        dropdown.classList.remove("open");
      });
    });
  }

  renderNotifications();

  bell.addEventListener("click", () => {
    dropdown.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-notifications") && dropdown.classList.contains("open")) {
      dropdown.classList.remove("open");
    }
  });
}

// ---------------------------------------------------------
// Вспомогательные функции
// ---------------------------------------------------------
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