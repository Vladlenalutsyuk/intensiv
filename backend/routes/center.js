const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/public/centers/:id - информация о центре
router.get("/centers/:id", async (req, res) => {
  const centerId = parseInt(req.params.id, 10);
  
  if (isNaN(centerId)) {
    return res.status(400).json({ error: "Invalid center ID" });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
          id, name, description, city, address, 
          phone, whatsapp, website, instagram, is_active
       FROM centers 
       WHERE id = ? AND is_active = TRUE`,
      [centerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Center not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Public center info error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/centers/:id/activities - занятия центра
router.get("/centers/:id/activities", async (req, res) => {
  const centerId = parseInt(req.params.id, 10);
  
  if (isNaN(centerId)) {
    return res.status(400).json({ error: "Invalid center ID" });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
          id, title, category, description, 
          min_age, max_age, level, is_active
       FROM activities 
       WHERE center_id = ? AND is_active = TRUE
       ORDER BY title`,
      [centerId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Public center activities error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/public/activities - поиск занятий (для search.html)
router.get("/activities", async (req, res) => {
  const { category, city, age } = req.query;
  
  let query = `
    SELECT 
      a.id, a.title, a.category, a.description,
      a.min_age, a.max_age, a.level,
      c.name as center_name, c.city, c.address
    FROM activities a
    JOIN centers c ON a.center_id = c.id
    WHERE a.is_active = TRUE AND c.is_active = TRUE
  `;
  
  const params = [];
  
  if (category) {
    query += " AND a.category = ?";
    params.push(category);
  }
  
  if (city) {
    query += " AND c.city = ?";
    params.push(city);
  }
  
  if (age) {
    const ageNum = parseInt(age, 10);
    query += " AND (a.min_age <= ? AND a.max_age >= ?)";
    params.push(ageNum, ageNum);
  }
  
  query += " ORDER BY a.title";
  
  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Public activities search error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;