<div align="center">

# 🌍 Traveloop

### Personalized Travel Planning Made Easy

*Plan smarter. Travel better. Share your journey.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=flat&logo=postgresql)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Screens & Pages](#-screens--pages)
- [Build Timeline](#-build-timeline)
- [Deployment](#-deployment)
- [Team](#-team)

---

## 🧭 Overview

**Traveloop** is a full-stack, personalized travel planning platform built for the Odoo Hackathon. It transforms the way individuals plan and experience travel by offering an end-to-end tool that combines flexibility, interactivity, and community.

Users can dream, design, and organize multi-city trips — with automatic budget estimation, day-wise itinerary building, packing checklists, trip notes, and the ability to share plans with a community of travelers.

> **Problem Statement:** Design and develop a complete travel planning application backed by a relational database, with dynamic UIs that adapt to each user's trip flow.

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Multi-city Itinerary Builder** | Add city stops, dates, and activities dynamically |
| 2 | **Auto Budget Estimation** | Cost breakdown by transport, stay, meals, and activities |
| 3 | **City & Activity Search** | Discover destinations and experiences |
| 4 | **Visual Itinerary View** | Day-wise timeline with activity blocks and costs |
| 5 | **Community Sharing** | Share trip plans publicly or copy others' itineraries |
| 6 | **Packing Checklist** | Categorized checklist with packed/unpacked toggle |
| 7 | **Trip Notes / Journal** | Per-stop notes for hotel info, reminders, contacts |
| 8 | **Expense Invoice** | Downloadable PDF invoice with GST breakdown |
| 9 | **Admin Analytics** | Charts for top cities, trip trends, user stats |
| 10 | **User Profiles** | Editable profile with trip history |

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| **React 18 + Vite** | UI framework with fast HMR dev server |
| **React Router DOM v6** | Client-side routing and navigation |
| **Tailwind CSS** | Utility-first responsive styling |
| **Axios** | HTTP client for API calls |
| **Recharts** | Budget pie, bar, and line charts |
| **React Hook Form** | Form state management and validation |
| **jsPDF + html2canvas** | PDF invoice generation and export |
| **Zustand** | Lightweight global state management |

### Backend

| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | REST API server |
| **Prisma ORM** | Type-safe database queries and migrations |
| **PostgreSQL** | Relational database (required by problem statement) |
| **bcryptjs** | Secure password hashing |
| **jsonwebtoken** | JWT-based authentication |
| **cors + dotenv** | Cross-origin support and environment config |
| **multer** | File and image uploads |

### DevOps

| Technology | Purpose |
|-----------|---------|
| **Vercel** | Frontend deployment |
| **Railway** | Backend + PostgreSQL deployment |
| **GitHub** | Version control and collaboration |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User (Browser / Mobile)                   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP Requests
┌───────────────────────────▼─────────────────────────────────┐
│              Frontend  —  React + Vite + Tailwind            │
│                                                              │
│   Pages          Components        State        API Layer    │
│   (14 screens)   (TripCard,        (Zustand /   (Axios +    │
│                   BudgetChart,      Context)     interceptor) │
│                   SearchBar…)                                │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────▼─────────────────────────────────┐
│              Backend  —  Node.js + Express                   │
│                                                              │
│   Routes            Auth Middleware    Controllers           │
│   /auth /trips      JWT verify         Business logic        │
│   /stops /budget    bcrypt passwords   Budget calc           │
│   /activities       Role checks        Prisma queries        │
└───────────────────────────┬─────────────────────────────────┘
                            │ SQL via Prisma
┌───────────────────────────▼─────────────────────────────────┐
│              Database  —  PostgreSQL                         │
│                                                              │
│   users · trips · stops · activities · budgets               │
│   notes · checklist_items                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  firstName String
  lastName  String
  email     String   @unique
  phone     String?
  city      String?
  country   String?
  password  String
  photo     String?
  isAdmin   Boolean  @default(false)
  createdAt DateTime @default(now())

  trips          Trip[]
  checklistItems ChecklistItem[]
}

model Trip {
  id          String   @id @default(uuid())
  name        String
  description String?
  coverPhoto  String?
  startDate   DateTime
  endDate     DateTime
  isPublic    Boolean  @default(false)
  status      String   @default("upcoming")
  createdAt   DateTime @default(now())

  userId  String
  user    User     @relation(fields: [userId], references: [id])
  stops   Stop[]
  notes   Note[]
  budgets Budget[]
}

model Stop {
  id         String   @id @default(uuid())
  cityName   String
  country    String?
  startDate  DateTime
  endDate    DateTime
  orderIndex Int      @default(0)

  tripId     String
  trip       Trip       @relation(fields: [tripId], references: [id], onDelete: Cascade)
  activities Activity[]
  notes      Note[]
}

model Activity {
  id          String  @id @default(uuid())
  name        String
  description String?
  type        String?
  cost        Float   @default(0)
  duration    String?
  timeSlot    String?

  stopId String
  stop   Stop   @relation(fields: [stopId], references: [id], onDelete: Cascade)
}

model Budget {
  id          String  @id @default(uuid())
  category    String
  amount      Float
  description String?

  tripId String
  trip   Trip   @relation(fields: [tripId], references: [id], onDelete: Cascade)
}

model Note {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())

  tripId String?
  trip   Trip?   @relation(fields: [tripId], references: [id])
  stopId String?
  stop   Stop?   @relation(fields: [stopId], references: [id])
}

model ChecklistItem {
  id       String  @id @default(uuid())
  name     String
  category String
  isPacked Boolean @default(false)
  tripId   String

  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

**Relationships summary:**
- One `User` → many `Trip`s
- One `Trip` → many `Stop`s (cities)
- One `Stop` → many `Activity` records
- One `Trip` → many `Budget` items and `Note`s
- One `User` → many `ChecklistItem`s per trip

---

## 📁 Project Structure

```
traveloop/
│
├── client/                             # React frontend
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx               # Screen 1
│       │   ├── Register.jsx            # Screen 2
│       │   ├── Dashboard.jsx           # Screen 3
│       │   ├── PlanTrip.jsx            # Screen 4
│       │   ├── ItineraryBuilder.jsx    # Screen 5 ⭐
│       │   ├── MyTrips.jsx             # Screen 6
│       │   ├── Profile.jsx             # Screen 7
│       │   ├── Search.jsx              # Screen 8 (city + activity)
│       │   ├── ItineraryView.jsx       # Screen 9
│       │   ├── Community.jsx           # Screen 10
│       │   ├── Checklist.jsx           # Screen 11
│       │   ├── AdminDashboard.jsx      # Screen 12
│       │   ├── Notes.jsx               # Screen 13
│       │   └── Invoice.jsx             # Screen 14
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── TripCard.jsx
│       │   ├── BudgetChart.jsx
│       │   ├── SearchBar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── api/
│       │   ├── index.js                # Axios instance + interceptor
│       │   ├── auth.js
│       │   ├── trips.js
│       │   ├── stops.js
│       │   └── activities.js
│       ├── App.jsx
│       └── main.jsx
│
├── server/                             # Express backend
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── trips.routes.js
│   │   │   ├── stops.routes.js
│   │   │   ├── activities.routes.js
│   │   │   ├── budget.routes.js
│   │   │   ├── checklist.routes.js
│   │   │   ├── notes.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── trips.controller.js
│   │   │   ├── stops.controller.js
│   │   │   └── activities.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   └── app.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed locally (or use Railway cloud DB)
- Git

---

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-team/traveloop.git
cd traveloop/server

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# 4. Push schema to database
npx prisma db push
npx prisma generate

# 5. (Optional) Seed the database
npx prisma db seed

# 6. Start the development server
npm run dev
# Server runs on http://localhost:5000
```

**`server/src/app.js`**
```js
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/trips',      require('./routes/trips.routes'));
app.use('/api/stops',      require('./routes/stops.routes'));
app.use('/api/activities', require('./routes/activities.routes'));
app.use('/api/budget',     require('./routes/budget.routes'));
app.use('/api/checklist',  require('./routes/checklist.routes'));
app.use('/api/notes',      require('./routes/notes.routes'));
app.use('/api/admin',      require('./routes/admin.routes'));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
```

**`server/src/middleware/auth.middleware.js`**
```js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

---

### Frontend Setup

```bash
cd ../client

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Set VITE_API_URL to your backend URL

# 3. Start development server
npm run dev
# App runs on http://localhost:5173
```

**`client/src/api/index.js`**
```js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('traveloop_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

**`client/src/context/AuthContext.jsx`**
```jsx
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('traveloop_user')) || null
  );

  const login = (userData, token) => {
    localStorage.setItem('traveloop_user', JSON.stringify(userData));
    localStorage.setItem('traveloop_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**`client/src/components/ProtectedRoute.jsx`**
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}
```

---

## 🔐 Environment Variables

### `server/.env`
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/traveloop"
JWT_SECRET="your_super_secret_key_change_this"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### `client/.env`
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Body | Auth | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/register` | `{firstName, lastName, email, password, phone?, city?, country?}` | ❌ | Register new user |
| `POST` | `/api/auth/login` | `{email, password}` | ❌ | Login, returns JWT |
| `GET` | `/api/auth/me` | — | ✅ | Get current user profile |
| `PUT` | `/api/auth/me` | `{firstName, lastName, phone, city, country}` | ✅ | Update profile |

### Trips

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/trips` | Get all trips for logged-in user | ✅ |
| `POST` | `/api/trips` | Create new trip | ✅ |
| `GET` | `/api/trips/public` | Get all public/community trips | ❌ |
| `GET` | `/api/trips/:id` | Get single trip with all stops & activities | ✅ |
| `PUT` | `/api/trips/:id` | Update trip details | ✅ |
| `DELETE` | `/api/trips/:id` | Delete trip and all related data | ✅ |
| `PATCH` | `/api/trips/:id/share` | Toggle `isPublic` flag | ✅ |

### Stops

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/stops` | Add city stop to a trip | ✅ |
| `PUT` | `/api/stops/:id` | Update stop city/dates | ✅ |
| `DELETE` | `/api/stops/:id` | Remove stop | ✅ |

### Activities

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/activities?stopId=X` | Get activities for a stop | ✅ |
| `POST` | `/api/activities` | Add activity to a stop | ✅ |
| `PUT` | `/api/activities/:id` | Update activity | ✅ |
| `DELETE` | `/api/activities/:id` | Delete activity | ✅ |

### Budget

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/budget/:tripId` | Get full budget breakdown for a trip | ✅ |
| `POST` | `/api/budget` | Add budget item | ✅ |
| `DELETE` | `/api/budget/:id` | Remove budget item | ✅ |

### Checklist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/checklist/:tripId` | Get all checklist items for a trip | ✅ |
| `POST` | `/api/checklist` | Add item | ✅ |
| `PATCH` | `/api/checklist/:id/toggle` | Toggle `isPacked` status | ✅ |
| `DELETE` | `/api/checklist/:id` | Delete item | ✅ |

### Notes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/notes/:tripId` | Get all notes for a trip | ✅ |
| `POST` | `/api/notes` | Add note (linked to trip or stop) | ✅ |
| `DELETE` | `/api/notes/:id` | Delete note | ✅ |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/stats` | Total users, trips, top cities, activity trends | ✅ Admin |

**Standard response format:**
```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Error description" }
```

---

## 🖥 Screens & Pages

### Screen 1 — Login
**Route:** `/`
Allows existing users to sign in with email and password. Validates credentials against the database, returns a JWT token stored in localStorage, and redirects to the dashboard.

**Key elements:** Email field, password field, login button, link to register, forgot password link.

---

### Screen 2 — Registration
**Route:** `/register`
New user sign-up with full profile info. Uses React Hook Form for validation (required fields, email format, password minimum length).

**Key elements:** First name, last name, email, phone, city, country, optional photo upload, register button.

---

### Screen 3 — Dashboard / Home
**Route:** `/dashboard`
The central hub after login. Shows a personalized welcome banner, regional destination cards for discovery, and the user's recent trips.

**Key elements:** Welcome message, 5 regional selection cards (Asia / Europe / Americas / Africa / Oceania), previous trips grid, "Plan a Trip" CTA.

---

### Screen 4 — Plan New Trip
**Route:** `/plan`
Form to create a new trip. The left side collects trip details; the right side shows suggested destinations the user can click to auto-fill the place field.

**Key elements:** Trip name, start date, destination search, end date, destination suggestion cards (2×3 grid), save button.

---

### Screen 5 — Itinerary Builder ⭐
**Route:** `/trips/:id/build`
The most important screen. Users build their trip stop by stop. Each section represents one city with a date range, budget, and activity description. Sections can be added dynamically and reordered.

```jsx
// Dynamic section state pattern
const [sections, setSections] = useState([
  { id: 1, city: '', startDate: '', endDate: '', budget: '', activities: '' }
]);

const addSection = () =>
  setSections([...sections, { id: Date.now(), city: '', startDate: '',
    endDate: '', budget: '', activities: '' }]);
```

**Key elements:** Section blocks with city, date range, budget, activity textarea; "+ Add another Section" button; save/publish button.

---

### Screen 6 — My Trips
**Route:** `/trips`
Lists all trips owned by the logged-in user, grouped by status.

**Key elements:** Three sections — Ongoing, Upcoming, Completed. Trip cards showing name, date range, destination count, and View / Edit / Delete actions.

---

### Screen 7 — User Profile
**Route:** `/profile`
View and edit personal account information. Also shows a history of past trips.

**Key elements:** Avatar with initials, editable name/email/phone/city/country fields, save button, previous trips list with View buttons.

---

### Screen 8 — Search (City + Activity)
**Route:** `/search`
A single reusable search page used for both city discovery and activity search. Pass a `type` prop to switch modes.

**Key elements:** Search bar with debounce, filter and sort controls, result rows with name + details + "Add to Trip" button.

---

### Screen 9 — Itinerary View
**Route:** `/trips/:id/view`
Read-only, structured view of the complete trip plan. Grouped by day with two columns per row.

**Key elements:** Day labels (Day 1, Day 2…), Activity Name column, Cost/Expense column, budget summary panel, toggle between List and Calendar view.

---

### Screen 10 — Community
**Route:** `/community`
Discover trips shared publicly by other travelers. Enables copying a trip into your own account.

**Key elements:** List of public trips with author name, destinations, and dates. "Copy Trip" button to duplicate to user's account. Social share button for link copying.

---

### Screen 11 — Packing Checklist
**Route:** `/trips/:id/checklist`
Per-trip checklist organized by category. Items persist in the database so users can check things off on the go.

**Key elements:** Category sections (Clothing, Documents, Electronics, Medicines, Misc). Checkbox per item toggling `isPacked`. Add item input. "Reset Checklist" button.

---

### Screen 12 — Admin Analytics Dashboard
**Route:** `/admin`
Admin-only screen showing platform-wide usage statistics with interactive charts.

**Key elements (using Recharts):**
- `PieChart` — budget breakdown by category
- `LineChart` — trips created per month
- `BarChart` — top 10 most visited cities
- Data tables: Popular Trips, Popular Activities, User Engagement

---

### Screen 13 — Trip Notes / Journal
**Route:** `/trips/:id/notes`
Simple note-taking per trip stop. Useful for hotel check-in info, local contacts, and day-specific reminders.

**Key elements:** Note cards with stop name header, content, and timestamp. "Add Note" button. Delete per card. Sorted newest first.

---

### Screen 14 — Expense Invoice
**Route:** `/trips/:id/invoice`
A formatted expense invoice for the full trip, downloadable as a PDF.

```js
// PDF export
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportPDF = async () => {
  const canvas = await html2canvas(document.getElementById('invoice'));
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
  pdf.save(`traveloop-invoice-${tripId}.pdf`);
};
```

**Key elements:** Trip thumbnail and summary, invoice table (Category / Description / Qty / Unit Cost / Amount), subtotal + 18% GST + grand total, Download Invoice button, Export as PDF button.

---

## 📅 Build Timeline

| Day | Focus | Screens |
|-----|-------|---------|
| **Day 1** | Project setup, database schema, auth API, login/register UI | 1, 2 |
| **Day 2** | Trip CRUD API, dashboard, plan new trip, my trips | 3, 4, 6 |
| **Day 3** | Stops + activities API, itinerary builder, itinerary view | 5, 9 |
| **Day 4** | Profile, search, community sharing, checklist, notes | 7, 8, 10, 11, 13 |
| **Day 5** | Admin dashboard, invoice/PDF, polish, deploy, demo | 12, 14 |

### Day-wise checklist

**Day 1**
- [ ] Initialize backend — `npm init`, install packages, configure Prisma
- [ ] Write full database schema and run `npx prisma db push`
- [ ] Build `/api/auth/register` and `/api/auth/login` with JWT
- [ ] Initialize frontend — Vite + React + Tailwind
- [ ] Build Screen 1: Login
- [ ] Build Screen 2: Register
- [ ] Set up AuthContext, ProtectedRoute, Axios instance
- [ ] Test full auth flow end-to-end ✓

**Day 2**
- [ ] Build full trips CRUD API routes
- [ ] Build Screen 3: Dashboard with regional cards
- [ ] Build Screen 4: Plan New Trip form
- [ ] Build Screen 6: My Trips with status grouping
- [ ] Connect frontend ↔ backend via Axios ✓

**Day 3**
- [ ] Build stops and activities API routes
- [ ] Build Screen 5: Itinerary Builder (dynamic sections — most time here)
- [ ] Build Screen 9: Itinerary View (day-wise layout)
- [ ] Test: create trip → add stops → view itinerary ✓

**Day 4**
- [ ] Build Screen 7: User Profile with edit
- [ ] Build Screen 8: Search (reuse for city + activity)
- [ ] Build Screen 10: Community public feed + copy trip
- [ ] Build Screen 11: Packing Checklist
- [ ] Build Screen 13: Trip Notes ✓

**Day 5**
- [ ] Build Screen 12: Admin Dashboard (Recharts)
- [ ] Build Screen 14: Invoice with PDF export
- [ ] Add loading spinners and error messages throughout
- [ ] Mobile responsive testing and fixes
- [ ] Deploy backend to Railway, frontend to Vercel
- [ ] Full demo run-through ✓

---

## ☁️ Deployment

### Backend — Railway

```bash
# Install CLI
npm install -g @railway/cli

# Login and initialize
railway login
cd server
railway init

# Add PostgreSQL plugin from Railway dashboard
# Copy the DATABASE_URL into your environment variables

# Deploy
railway up
```

Set these environment variables in the Railway dashboard:
- `DATABASE_URL` — auto-provided by Railway PostgreSQL plugin
- `JWT_SECRET` — your secret key
- `CLIENT_URL` — your Vercel frontend URL
- `PORT` — `5000`

### Frontend — Vercel

```bash
npm install -g vercel
cd client
vercel --prod
```

Set in Vercel dashboard under Environment Variables:
- `VITE_API_URL` — your Railway backend URL (e.g. `https://traveloop-api.railway.app/api`)

### Update CORS for production

```js
// server/src/app.js
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

---

## 👥 Team

| Name | Role |
|------|------|
| — | Full Stack Lead |
| — | Frontend Developer |
| — | Backend Developer |
| — | UI/UX & Database Design |

---

<div align="center">

Built with ❤️ for the **Odoo Hackathon**

*Traveloop — Making travel planning as exciting as the trip itself.*

</div>
