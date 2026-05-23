const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// EMAIL TEMPLATE
const buildConfirmationEmail = (name, guests, date, time) => {
  const formatDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              
              <!-- HEADER -->
              <tr>
                <td style="background:#111;border-radius:12px 12px 0 0;padding:40px;text-align:center;border-bottom:3px solid #ffbd59;">
                  <h1 style="color:#ffbd59;margin:0;font-size:28px;letter-spacing:2px;">HIDDEN RIDGE</h1>
                  <p style="color:#888;margin:8px 0 0;font-size:13px;letter-spacing:1px;">FOOD PARK & CAFE</p>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="background:#1a1a1a;padding:40px;">
                  <h2 style="color:white;margin:0 0 8px;font-size:22px;">Reservation Confirmed! 🎉</h2>
                  <p style="color:#aaa;margin:0 0 30px;font-size:15px;">Hi <strong style="color:white;">${name}</strong>, your table has been reserved. We look forward to seeing you!</p>

                  <!-- DETAILS BOX -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:8px;overflow:hidden;margin-bottom:30px;">
                    <tr>
                      <td style="padding:16px 20px;border-bottom:1px solid #333;">
                        <span style="color:#888;font-size:13px;display:block;">Name</span>
                        <span style="color:white;font-size:15px;font-weight:bold;">${name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 20px;border-bottom:1px solid #333;">
                        <span style="color:#888;font-size:13px;display:block;">Guests</span>
                        <span style="color:white;font-size:15px;font-weight:bold;">${guests} ${guests == 1 ? "person" : "people"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 20px;border-bottom:1px solid #333;">
                        <span style="color:#888;font-size:13px;display:block;">Date</span>
                        <span style="color:white;font-size:15px;font-weight:bold;">${formatDate(date)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 20px;">
                        <span style="color:#888;font-size:13px;display:block;">Time</span>
                        <span style="color:white;font-size:15px;font-weight:bold;">${formatTime(time)}</span>
                      </td>
                    </tr>
                  </table>

                  <!-- LOCATION -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:8px;margin-bottom:30px;">
                    <tr>
                      <td style="padding:20px;">
                        <p style="color:#ffbd59;font-size:13px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;">📍 LOCATION</p>
                        <p style="color:white;margin:0;font-size:14px;">Hidden Ridge Food Park<br>Tolentino St, Silang, Cavite</p>
                      </td>
                    </tr>
                  </table>

                  <!-- HOURS -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:8px;margin-bottom:30px;">
                    <tr>
                      <td style="padding:20px;">
                        <p style="color:#ffbd59;font-size:13px;font-weight:bold;margin:0 0 8px;letter-spacing:1px;">🕒 BUSINESS HOURS</p>
                        <p style="color:white;margin:0;font-size:14px;">Tuesday to Saturday: 3:00 PM – 12:00 MN<br><span style="color:#e53935;">Monday: CLOSED</span></p>
                      </td>
                    </tr>
                  </table>

                  <p style="color:#ffbd59;text-align:center;font-size:16px;margin:0;">See you at Hidden Ridge! 🍽️</p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background:#111;border-radius:0 0 12px 12px;padding:20px;text-align:center;">
                  <p style="color:#555;font-size:12px;margin:0;">This is an automated confirmation email. Please do not reply.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
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
  const { name, guests, date, time, email } = req.body;
  const guestsNum = Number(guests);

  if (!name || !name.trim() || guestsNum <= 0 || !Number.isInteger(guestsNum)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  if (!date || !time) {
    return res.status(400).json({ message: "Date and time are required" });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO reservations (name, guests, date, time, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name.trim(), guestsNum, date, time, email.trim()]
    );

    // SEND CONFIRMATION EMAIL
    try {
      await resend.emails.send({
        from: "Hidden Ridge <onboarding@resend.dev>",
        to: email.trim(),
        subject: "Your Reservation is Confirmed — Hidden Ridge Food Park",
        html: buildConfirmationEmail(name, guests, date, time),
      });
      console.log("Confirmation email sent to:", email);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Don't fail the reservation if email fails
    }

    res.json({ message: "Reservation added!", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving reservation" });
  }
});

// PUT reservation
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

// DELETE reservation
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