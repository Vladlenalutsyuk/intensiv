const express = require("express");
const router = express.Router();
const db = require("../db");

// Временные фиктивные данные для центров
const demoCenters = {
  1: {
    id: 1,
    name: "Демо Центр развития детей",
    description: "Творчество, спорт и развитие для детей 4–12 лет. Современные методики, опытные педагоги, уютная атмосфера.",
    city: "Симферополь",
    address: "ул. Пушкина, 10",
    phone: "+7 978 000-00-01",
    whatsapp: "+7 978 000-00-01",
    website: "https://demo-center1.ru",
    instagram: "@demo_center1",
    is_active: true
  },
  2: {
    id: 2, 
    name: "Школа робототехники RoboKids",
    description: "Робототехника, программирование и инженерное мышление для детей 8-16 лет. LEGO Education, Arduino, Python.",
    city: "Симферополь",
    address: "пр-т Победы, 15",
    phone: "+7 978 000-00-02",
    whatsapp: "+7 978 000-00-02", 
    website: "https://robokids.ru",
    instagram: "@robokids",
    is_active: true
  }
};

const demoActivities = {
  1: [
    {
      id: 1,
      title: "Творческая мастерская",
      category: "творчество", 
      description: "Рисование, лепка и поделки для детей 6–10 лет. Развиваем мелкую моторику и творческое мышление.",
      min_age: 6,
      max_age: 10,
      level: "начальный",
      is_active: true
    },
    {
      id: 2,
      title: "Гимнастика для детей",
      category: "спорт",
      description: "Общая физическая подготовка и растяжка. Укрепляем здоровье и формируем правильную осанку.",
      min_age: 5,
      max_age: 9, 
      level: "начальный",
      is_active: true
    }
  ],
  2: [
    {
      id: 3,
      title: "Робототехника LEGO",
      category: "IT",
      description: "Сборка и программирование роботов на LEGO Education. Основы механики и алгоритмического мышления.",
      min_age: 8,
      max_age: 13,
      level: "начальный", 
      is_active: true
    },
    {
      id: 4,
      title: "Python для подростков",
      category: "IT",
      description: "Основы программирования на Python для школьников. Создаем первые игры и приложения.",
      min_age: 12,
      max_age: 16,
      level: "начальный",
      is_active: true
    }
  ]
};

// GET /api/public/centers/:id
router.get("/centers/:id", async (req, res) => {
  const centerId = parseInt(req.params.id, 10);
  
  console.log('📞 Requested center ID:', centerId);
  
  if (isNaN(centerId)) {
    return res.status(400).json({ error: "Invalid center ID" });
  }

  // Используем фиктивные данные
  const center = demoCenters[centerId];
  
  if (!center) {
    console.log('❌ Center not found:', centerId);
    return res.status(404).json({ error: "Center not found" });
  }

  console.log('✅ Found center:', center.name);
  res.json(center);
});

// GET /api/public/centers/:id/activities
router.get("/centers/:id/activities", async (req, res) => {
  const centerId = parseInt(req.params.id, 10);
  
  console.log('📞 Requested activities for center ID:', centerId);
  
  if (isNaN(centerId)) {
    return res.status(400).json({ error: "Invalid center ID" });
  }

  // Используем фиктивные данные
  const activities = demoActivities[centerId] || [];
  
  console.log('✅ Found activities:', activities.length);
  res.json(activities);
});

// GET /api/public/activities
router.get("/activities", async (req, res) => {
  console.log('📞 Requested all activities');
  
  // Собираем все занятия из всех центров
  const allActivities = [];
  Object.values(demoActivities).forEach(centerActivities => {
    allActivities.push(...centerActivities);
  });

  console.log('✅ Returning all activities:', allActivities.length);
  res.json(allActivities);
});

// GET /api/public/activities/:id
router.get("/activities/:id", async (req, res) => {
  const activityId = parseInt(req.params.id, 10);
  
  console.log('📞 Requested activity ID:', activityId);
  
  if (isNaN(activityId)) {
    return res.status(400).json({ error: "Invalid activity ID" });
  }

  // Ищем занятие во всех центрах
  let foundActivity = null;
  Object.values(demoActivities).forEach(centerActivities => {
    const activity = centerActivities.find(a => a.id === activityId);
    if (activity) foundActivity = activity;
  });

  if (!foundActivity) {
    console.log('❌ Activity not found:', activityId);
    return res.status(404).json({ error: "Activity not found" });
  }

  console.log('✅ Found activity:', foundActivity.title);
  res.json(foundActivity);
});

// GET /api/public/activities/:id/groups
router.get("/activities/:id/groups", async (req, res) => {
  const activityId = parseInt(req.params.id, 10);
  
  console.log('📞 Requested groups for activity ID:', activityId);
  
  if (isNaN(activityId)) {
    return res.status(400).json({ error: "Invalid activity ID" });
  }

  // Фиктивные группы
  const demoGroups = [
    {
      id: 1,
      name: "Младшая группа",
      min_age: 6,
      max_age: 8,
      weekday: 2, // Вторник
      start_time: "17:00:00",
      end_time: "18:00:00", 
      capacity: 12,
      price: 1800.00
    },
    {
      id: 2,
      name: "Старшая группа", 
      min_age: 8,
      max_age: 10,
      weekday: 6, // Суббота
      start_time: "11:00:00",
      end_time: "12:30:00",
      capacity: 10,
      price: 2000.00
    }
  ];

  // =============================================
// ВРЕМЕННЫЕ ENDPOINTS ДЛЯ ЦЕНТРА (чтобы не было 404)
// =============================================

// GET /api/center/dashboard
router.get("/dashboard", async (req, res) => {
  console.log('📞 Center dashboard requested');
  
  const demoDashboard = {
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
      },
      {
        id: 2, 
        status: "pending",
        created_at: "2025-02-14T15:30:00.000Z",
        kid_name: "Илья Л.",
        activity_title: "Гимнастика для детей"
      }
    ]
  };
  
  console.log('✅ Returning center dashboard');
  res.json(demoDashboard);
});

// GET /api/center/profile
router.get("/profile", async (req, res) => {
  console.log('📞 Center profile requested');
  
  const demoProfile = {
    name: "Демо Центр развития детей",
    description: "Творчество, спорт и развитие для детей 4–12 лет. Современные методики, опытные педагоги, уютная атмосфера.",
    city: "Симферополь",
    address: "ул. Пушкина, 10",
    phone: "+7 978 000-00-01",
    whatsapp: "+7 978 000-00-01",
    website: "https://demo-center1.ru", 
    instagram: "@demo_center1"
  };
  
  console.log('✅ Returning center profile');
  res.json(demoProfile);
});

// POST /api/center/profile  
router.post("/profile", async (req, res) => {
  console.log('📞 Center profile update requested');
  console.log('Data:', req.body);
  
  // Просто подтверждаем сохранение
  res.json({ success: true, message: "Профиль успешно обновлен" });
});

// GET /api/center/activities
router.get("/activities", async (req, res) => {
  console.log('📞 Center activities requested');
  
  const demoActivities = [
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
  ];
  
  console.log('✅ Returning center activities');
  res.json(demoActivities);
});

// GET /api/center/enrollments
router.get("/enrollments", async (req, res) => {
  console.log('📞 Center enrollments requested');
  
  const demoEnrollments = [
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
  ];
  
  console.log('✅ Returning center enrollments');
  res.json(demoEnrollments);
});

// POST /api/center/enrollments/:id/status
router.post("/enrollments/:id/status", async (req, res) => {
  const enrollmentId = parseInt(req.params.id, 10);
  console.log('📞 Update enrollment status:', enrollmentId, req.body);
  
  // Просто подтверждаем обновление
  res.json({ success: true, message: "Статус заявки обновлен" });
});

// POST /api/center/activities
router.post("/activities", async (req, res) => {
  console.log('📞 Create activity requested');
  console.log('Data:', req.body);
  
  // Возвращаем ID новой активности
  res.json({ success: true, id: 999 });
});

// PUT /api/center/activities/:id
router.put("/activities/:id", async (req, res) => {
  const activityId = parseInt(req.params.id, 10);
  console.log('📞 Update activity requested:', activityId);
  console.log('Data:', req.body);
  
  res.json({ success: true });
});

// DELETE /api/center/activities/:id  
router.delete("/activities/:id", async (req, res) => {
  const activityId = parseInt(req.params.id, 10);
  console.log('📞 Delete activity requested:', activityId);
  
  res.json({ success: true });
});

// =============================================
// ENDPOINTS ДЛЯ РОДИТЕЛЕЙ (чтобы не было 404)
// =============================================

// GET /api/parent/kids
router.get("/kids", async (req, res) => {
  console.log('📞 Parent kids requested');
  
  const demoKids = [
    {
      id: 1,
      full_name: "Аня Л.",
      birth_date: "2016-05-10",
      gender: "girl",
      photo_url: null
    },
    {
      id: 2,
      full_name: "Илья Л.", 
      birth_date: "2018-09-22",
      gender: "boy",
      photo_url: null
    }
  ];
  
  console.log('✅ Returning parent kids');
  res.json(demoKids);
});

// GET /api/parent/school-lessons
router.get("/school-lessons", async (req, res) => {
  console.log('📞 Parent school lessons requested');
  
  const demoSchedule = [
    {
      id: 1,
      kid_id: 1,
      kid_name: "Аня Л.",
      weekday: 1,
      lesson_number: 1,
      start_time: "08:30:00",
      end_time: "09:15:00", 
      subject: "Математика",
      item_type: "school"
    },
    {
      id: 2,
      kid_id: 1,
      kid_name: "Аня Л.",
      weekday: 2,
      lesson_number: 2,
      start_time: "16:00:00",
      end_time: "16:45:00",
      subject: "Английский",
      item_type: "activity",
      title: "Английский для школьников"
    }
  ];
  
  console.log('✅ Returning parent schedule');
  res.json(demoSchedule);
});

// POST /api/parent/enroll
router.post("/enroll", async (req, res) => {
  console.log('📞 Parent enroll requested');
  console.log('Data:', req.body);
  
  res.json({ success: true, message: "Заявка на запись отправлена" });
});

// GET /api/parent/dashboard
router.get("/dashboard", async (req, res) => {
  console.log('📞 Parent dashboard requested');
  
  const demoDashboard = {
    parent_name: "Демо Родитель",
    kids_count: 2,
    enrollments_count: 3,
    upcoming: [
      {
        kid_name: "Аня Л.",
        activity_title: "Творческая мастерская",
        center_name: "Демо Центр развития детей",
        weekday: 2,
        start_time: "17:00:00",
        end_time: "18:00:00"
      }
    ]
  };
  
  console.log('✅ Returning parent dashboard');
  res.json(demoDashboard);
});

// GET /api/parent/profile
router.get("/profile", async (req, res) => {
  console.log('📞 Parent profile requested');
  
  const demoProfile = {
    full_name: "Демо Родитель",
    city: "Симферополь",
    phone: "+7-999-000-00-00",
    telegram: "@demo_parent",
    whatsapp: "+7-999-000-00-00",
    extra_email: "parent_demo_alt@example.com",
    avatar_url: null,
    login_email: "parent_demo@example.com"
  };
  
  console.log('✅ Returning parent profile');
  res.json(demoProfile);
});

// POST /api/parent/profile
router.post("/profile", async (req, res) => {
  console.log('📞 Parent profile update requested');
  console.log('Data:', req.body);
  
  res.json({ success: true, message: "Профиль родителя обновлен" });
});

// GET /api/parent/search-activities
router.get("/search-activities", async (req, res) => {
  console.log('📞 Parent search activities requested');
  
  // Возвращаем те же данные что и /api/public/activities
  const allActivities = [];
  Object.values(demoActivities).forEach(centerActivities => {
    allActivities.push(...centerActivities);
  });

  console.log('✅ Returning search activities:', allActivities.length);
  res.json(allActivities);
});

  console.log('✅ Returning groups:', demoGroups.length);
  res.json(demoGroups);
});

module.exports = router;