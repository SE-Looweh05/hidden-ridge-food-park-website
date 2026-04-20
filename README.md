# 🍽️ Hidden Ridge Food Park (Full-Stack Web App)

Originally built as a static HTML/CSS/JS website, this project has been 
progressively upgraded into a full-stack web application with a live 
PostgreSQL database, deployed on Vercel (frontend) and Render (backend).

---

## 🚀 Live Demo

- **Website:** [hidden-ridge-food-park-website.vercel.app](https://hidden-ridge-food-park-website.vercel.app)
- **Admin Panel:** [hidden-ridge-food-park-website.vercel.app/admin](https://hidden-ridge-food-park-website.vercel.app/admin)

---

## 🔧 Features

- Modern React frontend powered by Vite
- Dynamic food stall rendering with reusable components
- Table reservation system with modal form and loading state
- Full CRUD reservation system (Create, Read, Update, Delete)
- Rate limiting (max 3 reservations per IP/hour)
- Admin panel with protected login and edit/delete access
- Live sync with Supabase PostgreSQL database
- REST API with input validation and error handling
- Responsive UI for desktop, tablet, and mobile
- Parallax scroll and smooth page transitions
- UI animations (hover effects, staggered loading)
- Deployed frontend (Vercel) and backend (Render)

---

## ⚙️ Tech Stack

- **Frontend:** React.js (Vite), CSS, React Router DOM
- **Backend:** Node.js, Express.js, express-rate-limit
- **Database:** Supabase (PostgreSQL)
- **API:** RESTful API (GET, POST, PUT, DELETE)
- **Deployment:** Vercel (frontend), Render (backend)
- **Tools:** Git, GitHub

---

## 📌 Key Learnings

- Transitioned from static website to full-stack architecture
- Built REST API with full CRUD functionality
- Integrated Supabase PostgreSQL for cloud database management
- Managed frontend state using React hooks
- Implemented client-server communication using Fetch API
- Built protected admin system with authentication logic
- Learned deployment workflows using Vercel and Render
- Improved UI/UX with animations and responsive design principles

---

## 🎬 Demo

### 📋 Reservation System (User Flow & API Interaction)
![Reservation system demo](gifs/reservation.gif)

### 🛠️ Admin Panel (Protected CRUD Operations)
![Admin panel CRUD demo](gifs/admin.gif)

### 🗄️ Live Database Sync (Supabase PostgreSQL)
![Live database sync demo](gifs/db-sync.gif)

### 🎨 UI/UX Experience (Animations & Responsiveness)
![UI/UX animations and responsiveness demo](gifs/uiux.gif)

---

## 🚧 Future Plans

- Clickable food stall cards with full menu modal
- Form validation with visible inline error messages
- Improved mobile layout for food stalls section
- Toast notifications instead of browser alerts
- Add date and time selection for reservations to support scheduled bookings

---

## 🖥️ How to Run

### Clone the repository
```bash
git clone https://github.com/SE-Looweh05/Hidden-Ridge-Food-Park-Website.git
cd Hidden-Ridge-Food-Park-Website
```

### ▶️ Frontend
```bash
npm install
npm run dev
```
Opens at: `http://localhost:5173`

### ⚙️ Backend
```bash
cd backend
npm install
node server.js
```
Runs at: `http://localhost:5000`

### 🔑 Environment Variables
Create a `.env` file inside `frontend/`:
```
VITE_BACKEND_URL=http://localhost:5000
VITE_ADMIN_PIN=your_admin_password
```
Create a `.env` file inside your `backend/` folder:
```
DATABASE_URL=your_supabase_connection_string
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reservations | Fetch all reservations |
| POST | /api/reservations | Add a new reservation (rate limited) |
| PUT | /api/reservations/:id | Edit a reservation |
| DELETE | /api/reservations/:id | Delete a reservation |

---

## 📁 Project Structure

```
Hidden-Ridge-Food-Park-Website/
├── gifs/
├── screenshots/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── vercel.json
│   └── .env
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

---

## 🎨 Design & Development Process

- Layout prototyped in **Canva** and **Adobe Photoshop** for spacing and visual hierarchy
- Cafe section uses CSS text overlay on a full-background image
- Transitioned from static HTML/CSS/JS → React (Vite) + Node.js
- Database upgraded from in-memory storage → live Supabase PostgreSQL
- Scroll system rebuilt from standard scrolling → custom parallax fade using
  `window.scrollY` and fixed CSS layers
- Admin panel separated into its own route via React Router DOM
- Deployed to Vercel + Render for full production availability
- AI-assisted tools used for debugging and workflow efficiency
