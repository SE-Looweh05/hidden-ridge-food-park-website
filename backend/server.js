const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hidden-ridge-food-park-website.vercel.app"
  ]
}));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// KEEP SUPABASE AWAKE
const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
setInterval(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Supabase keep-alive ping sent");
  } catch (err) {
    console.error("Keep-alive ping failed:", err);
  }
}, FOUR_DAYS);

// RATE LIMITER
const reservationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Too many reservations from this device. Please try again later." }
});

// JWT MIDDLEWARE
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend connected to Supabase 🚀");
});

// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Incorrect password." });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
});

// GET reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reservations ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reservations" });
  }
});

// POST reservation
app.post("/api/reservations", reservationLimiter, async (req, res) => {
  const { name, guests, date, time } = req.body;
  const guestsNum = Number(guests);

  if (!name || !name.trim() || guestsNum <= 0 || !Number.isInteger(guestsNum)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  if (!date || !time) {
    return res.status(400).json({ message: "Date and time are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO reservations (name, guests, date, time) VALUES ($1, $2, $3, $4) RETURNING *",
      [name.trim(), guestsNum, date, time]
    );
    res.json({ message: "Reservation added!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving reservation" });
  }
});

// PUT reservation — protected
app.put("/api/reservations/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, guests, date, time } = req.body;
  const guestsNum = Number(guests);

  if (!name || !name.trim() || guestsNum <= 0 || !Number.isInteger(guestsNum)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await pool.query(
      "UPDATE reservations SET name = $1, guests = $2, date = $3, time = $4 WHERE id = $5 RETURNING *",
      [name.trim(), guestsNum, date || null, time || null, id]
    );
    res.json({ message: "Reservation updated!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating reservation" });
  }
});

// DELETE reservation — protected
app.delete("/api/reservations/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
    res.json({ message: "Reservation deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting reservation" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});