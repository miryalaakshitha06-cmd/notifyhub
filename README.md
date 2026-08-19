# NotifyHub — Campus Announcement & Event Notification Platform

**Connect. Inform. Engage.**

NotifyHub is a modern full-stack web application designed for educational institutions to manage campus announcements, upcoming events, notifications, and student query tickets.

---

## 📸 Overview & Features

### Student Portal (Public — No Login Required)
- **Campus Announcements**: Browse notices with real-time search and multi-filtering (Category, Priority, Department, Year).
- **Urgent Notice Banner**: Prominent visual highlight for critical alerts (e.g. End Semester Exam timetable releases).
- **Campus Events & Calendar**: View upcoming hackathons, workshops, and sports meets with interactive monthly calendar.
- **Student Query Desk**: Submit queries with roll number/student ID, category, description, and track official administration responses.
- **Notification Hub**: Real-time notification feed with unread counter and polling.

### Administration Portal (Role-Based Access Control)
- **3 Role Logins**: Visual role selection for **Admin**, **HOD**, and **Faculty**.
- **Admin Dashboard**: Overview cards, activity logs, quick action shortcuts.
- **Announcement Management**: Full CRUD (Create, Edit, Delete, Save Draft, Publish, Archive, Priority, Department/Year target, Attachments).
- **Event Management**: Create and manage events, set registration deadlines, venues, organizers.
- **Query Ticket Inbox**: Review student inquiries, reply with official answers, and mark status (`OPEN`, `IN_PROGRESS`, `RESOLVED`).
- **Activity Audit Trail**: Automatic audit logging for staff actions across the platform.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, React Router DOM v7, Lucide Icons, Vanilla CSS with CSS Variables.
- **Backend**: Node.js, Express.js, JWT in HTTP-Only Cookies, bcryptjs, Multer, Cookie Parser, CORS.
- **Database & ORM**: PostgreSQL / SQLite, Prisma ORM.

---

## 🔑 Demo Credentials

- **Admin**: `admin@notifyhub.com` / `admin123`
- **HOD**: `hod@notifyhub.com` / `hod123`
- **Faculty**: `faculty@notifyhub.com` / `faculty123`

---

## 🚀 Getting Started

### 1. Backend Setup (`server/`)
```bash
cd server
npm install
npm run db:push
npm run db:seed
npm run dev
```

### 2. Frontend Setup (Root)
```bash
npm install
npm run dev
```

Visit [`http://localhost:5173`](http://localhost:5173) in your browser.
