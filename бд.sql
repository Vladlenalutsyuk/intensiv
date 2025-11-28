-- ПОЛНОЕ ПЕРЕСОЗДАНИЕ БАЗЫ РАЗВИТАЙМ
-- ВНИМАНИЕ: УДАЛИТ СТАРУЮ БАЗУ razvitime ЦЕЛИКОМ

DROP DATABASE IF EXISTS razvitime;

CREATE DATABASE razvitime
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE razvitime;

-- =========================
-- 1. Пользователи (аккаунты)
-- =========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('parent','center_admin','admin') NOT NULL DEFAULT 'parent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME NULL
) ENGINE=InnoDB;

-- =========================
-- 2. Профиль родителя
-- =========================
CREATE TABLE parents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 3. Профиль детского центра
-- =========================
CREATE TABLE centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,          -- админ центра (аккаунт)
    name VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100),
    address VARCHAR(255),
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    website VARCHAR(255),
    instagram VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 4. Комнаты / залы центра
-- =========================
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,          -- "Зал хореографии", "Кабинет 101"
    capacity INT,
    FOREIGN KEY (center_id) REFERENCES centers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 5. Дети
-- =========================
CREATE TABLE kids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    birth_date DATE,
    gender ENUM('girl','boy','other') NULL,
    special_needs TEXT,
    FOREIGN KEY (parent_id) REFERENCES parents(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 6. Направления / кружки (внутри центра)
-- =========================
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,          -- "Робототехника", "Хореография"
    category VARCHAR(100),                -- спорт, творчество, IT и т.п.
    description TEXT,
    min_age TINYINT,
    max_age TINYINT,
    level VARCHAR(50),                    -- начальный, продвинутый
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (center_id) REFERENCES centers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 7. Группы внутри занятия
-- =========================
CREATE TABLE activity_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,           -- "Группа 8–10 лет (вечер)"
    max_kids INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (activity_id) REFERENCES activities(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 8. Слоты расписания (конкретные дни/время)
-- =========================
CREATE TABLE schedule_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    weekday TINYINT NOT NULL,             -- 1=Пн ... 7=Вс
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_id INT NULL,
    FOREIGN KEY (group_id) REFERENCES activity_groups(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 9. Запись ребёнка в группу
-- =========================
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kid_id INT NOT NULL,
    group_id INT NOT NULL,
    status ENUM('pending','approved','rejected','waitlist','left')
        DEFAULT 'pending',
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (kid_id, group_id),
    FOREIGN KEY (kid_id) REFERENCES kids(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (group_id) REFERENCES activity_groups(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 10. Избранные центры у родителя
-- =========================
CREATE TABLE favorite_centers (
    parent_id INT NOT NULL,
    center_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_id, center_id),
    FOREIGN KEY (parent_id) REFERENCES parents(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (center_id) REFERENCES centers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 11. Напоминания о занятиях
-- =========================
CREATE TABLE reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    kid_id INT NULL,
    schedule_slot_id INT NOT NULL,
    remind_before_minutes INT NOT NULL DEFAULT 60,
    channel ENUM('email','sms','telegram','push') DEFAULT 'email',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (kid_id) REFERENCES kids(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (schedule_slot_id) REFERENCES schedule_slots(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 12. Тарифы и подписки центров
-- =========================
CREATE TABLE tariff_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,     -- BASIC, PRO и т.п.
    name VARCHAR(100) NOT NULL,
    max_activities INT,
    max_kids INT,
    price_month DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE center_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    center_id INT NOT NULL,
    tariff_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (center_id) REFERENCES centers(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (tariff_id) REFERENCES tariff_plans(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- 13. Немного тестовых данных (для проверки)
-- =========================

-- Пользователи
INSERT INTO users (email, password_hash, role) VALUES
('parent_demo@example.com', 'hashed_parent', 'parent'),
('center_demo@example.com', 'hashed_center', 'center_admin'),
('admin@example.com', 'hashed_admin', 'admin');

-- Родитель
INSERT INTO parents (user_id, full_name, phone, city)
VALUES (1, 'Демо Родитель', '+7-999-000-00-00', 'Симферополь');

-- Ребёнок
INSERT INTO kids (parent_id, full_name, birth_date, gender)
VALUES (1, 'Аня Л.', '2016-05-10', 'girl');

-- Центр
INSERT INTO centers (user_id, name, description, city, address, phone, website)
VALUES (
    2,
    'Демо Центр развития детей',
    'Кружки по творчеству, спорту и IT для детей от 4 до 14 лет.',
    'Симферополь',
    'ул. Примерная, д. 10',
    '+7-978-111-11-11',
    'https://demo-center.example.com'
);

-- Зал
INSERT INTO rooms (center_id, name, capacity)
VALUES (1, 'Кабинет 101', 12);

-- Занятие
INSERT INTO activities (center_id, title, category, description, min_age, max_age, level)
VALUES (
    1,
    'Робототехника для детей',
    'IT',
    'Изучение основ робототехники и программирования в игровой форме.',
    8,
    12,
    'beginner'
);

-- Группа
INSERT INTO activity_groups (activity_id, name, max_kids, start_date)
VALUES (1, 'Группа 8–10 лет (вечер)', 10, '2025-09-01');

-- Слоты расписания (Пн и Ср 17:00–18:30)
INSERT INTO schedule_slots (group_id, weekday, start_time, end_time, room_id)
VALUES
(1, 1, '17:00:00', '18:30:00', 1),
(1, 3, '17:00:00', '18:30:00', 1);

-- Запись ребёнка на группу
INSERT INTO enrollments (kid_id, group_id, status, comment)
VALUES (1, 1, 'approved', 'Подтверждено администратором центра');

-- Тарифы
INSERT INTO tariff_plans (code, name, max_activities, max_kids, price_month)
VALUES
('BASIC', 'Базовый', 5, 100, 1990.00),
('PRO', 'Продвинутый', 20, 500, 4990.00);

-- Подписка центра
INSERT INTO center_subscriptions (center_id, tariff_id, start_date, end_date, is_active)
VALUES (1, 2, '2025-01-01', '2025-12-31', TRUE);
