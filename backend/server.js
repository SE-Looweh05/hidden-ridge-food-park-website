const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hidden-ridge-food-park-website.vercel.app"
  ]
}));
app.use(express.json());

// Supabase PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// RATE LIMITER — max 3 reservations per IP per hour
const reservationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Too many reservations from this device. Please try again later." }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend connected to Supabase 🚀");
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
  const { name, guests } = req.body;
  const guestsNum = Number(guests);

  if (!name || !name.trim() || guestsNum <= 0 || !Number.isInteger(guestsNum)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO reservations (name, guests) VALUES ($1, $2) RETURNING *",
      [name.trim(), guestsNum]
    );
    res.json({ message: "Reservation added!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving reservation" });
  }
});

// PUT reservation
app.put("/api/reservations/:id", async (req, res) => {
  const { id } = req.params;
  const { name, guests } = req.body;
  const guestsNum = Number(guests);

  if (!name || !name.trim() || guestsNum <= 0 || !Number.isInteger(guestsNum)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const result = await pool.query(
      "UPDATE reservations SET name = $1, guests = $2 WHERE id = $3 RETURNING *",
      [name.trim(), guestsNum, id]
    );
    res.json({ message: "Reservation updated!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating reservation" });
  }
});

// DELETE reservation
app.delete("/api/reservations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
    res.json({ message: "Reservation deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating reservation" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});