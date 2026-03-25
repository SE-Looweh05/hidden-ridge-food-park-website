const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Temporary database (array)
let reservations = [];

// TEST ROUTE (to check if server works)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// GET all reservations
app.get("/api/reservations", (req, res) => {
  res.json(reservations);
});

// POST new reservation
app.post("/api/reservations", (req, res) => {
  const { name, guests } = req.body;

  if (!name || !guests) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newReservation = {
    id: Date.now(),
    name,
    guests,
  };

  reservations.push(newReservation);

  res.json({
    message: "Reservation added!",
    data: newReservation,
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});