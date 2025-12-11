// server.js - альтернативный вариант
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const tempRoutes = require('./routes/temp');

// Используем tempRoutes для всех API путей
app.use('/api/parent', tempRoutes);    // /api/parent/... -> temp.js
app.use('/api/center', tempRoutes);    // /api/center/... -> temp.js  
app.use('/api/public', tempRoutes);    // /api/public/... -> temp.js
app.use('/api', tempRoutes);           // /api/test -> temp.js

// ИЛИ просто (если все эндпоинты в temp.js начинаются с /api)
// app.use('/api', tempRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
  console.log("📞 Parent API: http://localhost:" + PORT + "/api/parent/kids");
  console.log("📞 Center API: http://localhost:" + PORT + "/api/center/dashboard");
  console.log("📞 Public API: http://localhost:" + PORT + "/api/public/activities");
});

//npx nodemon server.js