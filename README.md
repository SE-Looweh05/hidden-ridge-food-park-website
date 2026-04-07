# 🍽️ Hidden Ridge Food Park (Full-Stack Web App)

Originally built as a static HTML/CSS/JS website, this project has been 
progressively upgraded into a full-stack web application with a live 
PostgreSQL database.

---

## 🔧 Features

- Modern React frontend powered by Vite
- Dynamic rendering of food stalls using mapped data
- Table reservation system with modal form
- Full **CRUD** reservation system (Create, Read, Update, Delete)
- Admin panel to view, edit, and delete reservations
- All changes sync live to a **Supabase PostgreSQL** database
- Confirmation modals for edit and delete actions
- REST API with input validation on all routes
- Smooth scrolling and hover effects on food stall cards

---

## ⚙️ Tech Stack

- **Frontend:** React.js (Vite), CSS
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **API:** RESTful API (GET, POST, PUT, DELETE)
- **Tools:** Git, GitHub

---

## 📌 Key Learnings

- Transitioned from static website → full-stack architecture
- Implemented client-server communication using the Fetch API
- Managed state and user input using React hooks
- Built and consumed a REST API with full CRUD operations
- Integrated a live cloud PostgreSQL database via Supabase
- Structured a scalable project with separate frontend and backend

---

## 🎬 Demo

### 🌐 Site Overview
![Site Overview](gifs/1-site-overview.gif)

### 📋 Reservation Flow
![Reservation Flow](gifs/2-reservation-flow.gif)

### 🛠️ Admin Panel — Edit & Delete
![Admin CRUD](gifs/3-admin-crud.gif)

### 🗄️ Live Database Sync (Supabase)
![Database Sync](gifs/4-database-sync.gif)

---

## 🚧 Future Plans

- Clickable food stall cards with full menu modal
- Animations and transitions for modals and page sections
- Form validation with visible error messages
- Improved responsiveness across devices
- Full deployment (frontend + backend)

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
Create a `.env` file inside your `backend/` folder:
```
DATABASE_URL=your_supabase_connection_string
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reservations | Fetch all reservations |
| POST | /api/reservations | Add a new reservation |
| PUT | /api/reservations/:id | Edit a reservation |
| DELETE | /api/reservations/:id | Delete a reservation |

---

## 📁 Project Structure

```
Hidden-Ridge-Food-Park-Website/
├── gifs/
├── screenshots/
├── frontend/
├── backend/
├── .gitignore
└── README.md
```

---

## 🎨 Design & Development Process

- Layout prototyped in **Canva** for spacing and visual hierarchy
- Cafe section uses CSS text overlay on a full-background image
- Transitioned from static HTML/CSS/JS → React (Vite) + Node.js
- Database upgraded from in-memory storage → live Supabase PostgreSQL
- AI-assisted tools used for debugging and workflow efficiency
