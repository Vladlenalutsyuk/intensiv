const express = require("express");
const router = express.Router();

// =============================================
// ВРЕМЕННЫЕ FIXTURES ДАННЫЕ
// =============================================
const demoCenters = {
  1: {
    id: 1,
    name: "Демо Центр развития детей",
    description: "Творчество, спорт и развитие для детей 4–12 лет.",
    city: "Симферополь",
    address: "ул. Пушкина, 10",
    phone: "+7 978 000-00-01",
    whatsapp: "+7 978 000-00-01",
    website: "https://demo-center1.ru",
    instagram: "@demo_center1",
    is_active: true
  }
};

const demoActivities = {
  1: [
    {
      id: 1,
      title: "Творческая мастерская",
      category: "творчество",
      description: "Рисование, лепка и поделки для детей 6–10 лет.",
      min_age: 6,
      max_age: 10,
      level: "начальный",
      is_active: true,
      enrollments_count: 8
    },
    {
      id: 2,
      title: "Гимнастика для детей",
      category: "спорт",
      description: "Общая физическая подготовка и растяжка.",
      min_age: 5,
      max_age: 9,
      level: "начальный",
      is_active: true,
      enrollments_count: 12
    }
  ]
};

// Демо данные для родительского раздела
const demoParents = {
  1: {
    id: 1,
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7-999-000-00-00",
    city: "Симферополь"
  }
};

const demoKids = {
  1: [
    {
      id: 1,
      name: "Мария",
      birth_date: "2016-05-10",
      age: 8,
      gender: "female"
    },
    {
      id: 2,
      name: "Алексей", 
      birth_date: "2019-09-22",
      age: 5,
      gender: "male"
    }
  ]
};

// Демо занятия для поиска
const demoAllActivities = [
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
    address: "ул. Пушкина, 10",
    is_active: true
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
    address: "ул. Пушкина, 10",
    is_active: true
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
    address: "ул. Пушкина, 10",
    is_active: true
  }
];

// Демо школьные уроки
const demoSchoolLessons = {
  1: [
    {
      id: 1,
      kid_id: 1,
      subject: "Математика",
      day_of_week: 1,
      start_time: "09:00",
      end_time: "09:45",
      teacher: "Иванова А.П.",
      room: "201"
    },
    {
      id: 2,
      kid_id: 1,
      subject: "Русский язык",
      day_of_week: 1,
      start_time: "10:00",
      end_time: "10:45",
      teacher: "Петрова И.С.",
      room: "202"
    }
  ]
};

// =============================================
// PARENT ENDPOINTS
// =============================================

// GET /api/parent/dashboard
router.get("/parent/dashboard", async (req, res) => {
  console.log('✅ Parent dashboard called');
  res.json({
    success: true,
    data: {
      user: demoParents[1],
      stats: {
        total_kids: 2,
        active_enrollments: 3,
        upcoming_lessons: 5,
        favorite_categories: ["творчество", "спорт"]
      },
      upcoming_schedule: [
        {
          id: 1,
          date: "2025-02-20",
          time: "17:00",
          activity: "Творческая мастерская",
          kid_name: "Мария",
          center: "Демо Центр развития детей"
        }
      ]
    }
  });
});

// GET /api/parent/profile
router.get("/parent/profile", async (req, res) => {
  console.log('✅ Parent profile called');
  res.json({
    success: true,
    data: demoParents[1]
  });
});

// GET /api/parent/kids
router.get("/parent/kids", async (req, res) => {
  console.log('✅ Parent kids called');
  const parentId = parseInt(req.query.parentId) || 1;
  
  res.json({
    success: true,
    data: demoKids[parentId] || []
  });
});

// POST /api/parent/kids
router.post("/parent/kids", async (req, res) => {
  console.log('✅ Parent add kid called');
  res.json({
    success: true,
    message: "Ребенок добавлен",
    kid_id: 999
  });
});

// GET /api/parent/search-activities
router.get("/parent/search-activities", async (req, res) => {
  console.log('✅ Parent search activities called');
  
  const { activityName, city, childAge, category } = req.query;
  
  let filteredActivities = demoAllActivities.filter(activity => {
    // Фильтр по названию
    if (activityName && !activity.title.toLowerCase().includes(activityName.toLowerCase())) {
      return false;
    }
    
    // Фильтр по городу
    if (city && !activity.city.toLowerCase().includes(city.toLowerCase())) {
      return false;
    }
    
    // Фильтр по возрасту
    if (childAge) {
      const age = parseInt(childAge);
      if (age < activity.min_age || age > activity.max_age) {
        return false;
      }
    }
    
    // Фильтр по категории
    if (category && category !== "any" && activity.category !== category) {
      return false;
    }
    
    return true;
  });
  
  res.json({
    success: true,
    data: {
      activities: filteredActivities,
      total: filteredActivities.length,
      filters: req.query
    }
  });
});

// GET /api/parent/school-lessons
router.get("/parent/school-lessons", async (req, res) => {
  console.log('✅ Parent school lessons called');
  const kidId = parseInt(req.query.kidId) || 1;
  
  res.json({
    success: true,
    data: demoSchoolLessons[kidId] || []
  });
});


// =============================================
// CENTER ENDPOINTS
// =============================================

// GET /api/center/dashboard
router.get("/dashboard", async (req, res) => {
  console.log('✅ Center dashboard called');
  res.json({
    center_name: "Демо Центр развития детей",
    center_city: "Симферополь",
    activities_count: 2,
    requests_last_30d: 5,
    subscription: {
      id: 1,
      start_date: "2025-01-01",
      end_date: "2025-03-01",
      is_active: true,
      tariff_code: "SUB_10",
      tariff_name: "Подписка: до 10 постов/2 мес",
      price_month: 15000.00
    },
    latest_enrollments: [
      {
        id: 1,
        status: "approved",
        created_at: "2025-02-15T10:00:00.000Z",
        kid_name: "Аня Л.",
        activity_title: "Творческая мастерская"
      }
    ]
  });
});

// GET /api/center/profile
router.get("/profile", async (req, res) => {
  console.log('✅ Center profile called');
  res.json({
    name: "Демо Центр развития детей",
    description: "Творчество, спорт и развитие для детей 4–12 лет.",
    city: "Симферополь",
    address: "ул. Пушкина, 10",
    phone: "+7 978 000-00-01",
    whatsapp: "+7 978 000-00-01",
    website: "https://demo-center1.ru",
    instagram: "@demo_center1"
  });
});

// POST /api/center/profile
router.post("/profile", async (req, res) => {
  console.log('✅ Center profile update called');
  res.json({ success: true, message: "Профиль обновлен" });
});

// GET /api/center/activities
router.get("/activities", async (req, res) => {
  console.log('✅ Center activities called');
  res.json([
    {
      id: 1,
      title: "Творческая мастерская",
      category: "творчество",
      description: "Рисование, лепка и поделки для детей 6–10 лет.",
      min_age: 6,
      max_age: 10,
      level: "начальный",
      is_active: true,
      enrollments_count: 8
    },
    {
      id: 2,
      title: "Гимнастика для детей",
      category: "спорт",
      description: "Общая физическая подготовка и растяжка.",
      min_age: 5,
      max_age: 9,
      level: "начальный",
      is_active: true,
      enrollments_count: 12
    }
  ]);
});

// GET /api/center/enrollments
router.get("/enrollments", async (req, res) => {
  console.log('✅ Center enrollments called');
  res.json([
    {
      id: 1,
      status: "approved",
      comment: "Аня ходит на творчество по вторникам.",
      created_at: "2025-02-15T10:00:00.000Z",
      kid_name: "Аня Л.",
      birth_date: "2016-05-10",
      parent_name: "Демо Родитель",
      parent_phone: "+7-999-000-00-00",
      parent_email: "parent_demo@example.com",
      activity_title: "Творческая мастерская"
    },
    {
      id: 2,
      status: "pending",
      comment: null,
      created_at: "2025-02-14T15:30:00.000Z",
      kid_name: "Илья Л.",
      birth_date: "2018-09-22",
      parent_name: "Демо Родитель",
      parent_phone: "+7-999-000-00-00",
      parent_email: "parent_demo@example.com",
      activity_title: "Гимнастика для детей"
    }
  ]);
});

// POST /api/center/enrollments/:id/status
router.post("/enrollments/:id/status", async (req, res) => {
  console.log('✅ Center enrollment status update called');
  res.json({ success: true, message: "Статус обновлен" });
});

// POST /api/center/activities
router.post("/activities", async (req, res) => {
  console.log('✅ Center create activity called');
  res.json({ success: true, id: 999 });
});

// PUT /api/center/activities/:id
router.put("/activities/:id", async (req, res) => {
  console.log('✅ Center update activity called');
  res.json({ success: true });
});

// DELETE /api/center/activities/:id
router.delete("/activities/:id", async (req, res) => {
  console.log('✅ Center delete activity called');
  res.json({ success: true });
});

// =============================================
// PUBLIC ENDPOINTS
// =============================================

// GET /api/public/centers/:id
router.get("/centers/:id", async (req, res) => {
  const centerId = parseInt(req.params.id, 10);
  console.log('✅ Public center called:', centerId);
  
  const center = demoCenters[centerId];
  if (!center) {
    return res.status(404).json({ error: "Center not found" });
  }
  
  res.json(center);
});

// GET /api/public/centers/:id/activities
router.get("/centers/:id/activities", async (req, res) => {
  const centerId = parseInt(req.params.id, 10);
  console.log('✅ Public center activities called:', centerId);
  
  const activities = demoActivities[centerId] || [];
  res.json(activities);
});

// GET /api/public/activities
router.get("/activities", async (req, res) => {
  console.log('✅ Public activities called');
  const allActivities = Object.values(demoActivities).flat();
  res.json(allActivities);
});

// GET /api/public/activities/:id
router.get("/activities/:id", async (req, res) => {
  const activityId = parseInt(req.params.id, 10);
  console.log('✅ Public activity details called:', activityId);
  
  const allActivities = Object.values(demoActivities).flat();
  const activity = allActivities.find(a => a.id === activityId);
  
  if (!activity) {
    return res.status(404).json({ error: "Activity not found" });
  }
  
  res.json(activity);
});

// GET /api/public/activities/:id/groups
router.get("/activities/:id/groups", async (req, res) => {
  console.log('✅ Public activity groups called');
  res.json([
    {
      id: 1,
      name: "Младшая группа",
      min_age: 6,
      max_age: 8,
      weekday: 2,
      start_time: "17:00:00",
      end_time: "18:00:00",
      capacity: 12,
      price: 1800.00
    }
  ]);
});




module.exports = router;