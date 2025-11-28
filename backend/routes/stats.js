// backend/routes/stats.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [parents]   = await db.query("SELECT COUNT(*) AS total FROM parents");
    const [kids]      = await db.query("SELECT COUNT(*) AS total FROM kids");
    const [centers]   = await db.query("SELECT COUNT(*) AS total FROM centers WHERE is_active = 1");
    const [activities]= await db.query("SELECT COUNT(*) AS total FROM activities WHERE is_active = 1");

    res.json({
      parents:    parents[0].total,
      kids:       kids[0].total,
      centers:    centers[0].total,
      activities: activities[0].total
    });
  } catch (error) {
    console.error("stats error", error);
    res.status(500).json({ error: "Ошибка получения статистики" });
  }
});

module.exports = router;
