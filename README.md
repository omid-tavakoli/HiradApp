# 🛠️ Construction Project Dashboard – PWA for Supervisors & Contractors

A powerful Progressive Web App (PWA) dashboard for managing construction projects, designed for both **supervisors** and **contractors**. The platform supports project creation, user role assignment, interactive calendars, real-time notifications, offline exam submissions, and geolocation-based task validation.

---

## 📝 Overview

This dashboard is built to streamline communication and task management between project **supervisors** and **contractors**. Each project can be assigned to specific users, and tasks, exams, and activities are organized and displayed in a calendar view. The application supports **offline usage** and utilizes **PWA technology**, allowing users to submit exams even without an internet connection. Once back online, data is automatically synced with the server.

---

## 🎯 Purpose

- Facilitate transparent collaboration between supervisors and contractors  
- Ensure accountability through location-based exam validation  
- Enable users to access and complete tasks in the field, even offline  
- Deliver a modern, reliable, and mobile-friendly experience for on-site operations  

---

## ⚙️ Technologies Used

- **React** – Component-based frontend  
- **TypeScript** – Strong typing  
- **Vite** – Lightning-fast build tool  
- **React Router** – Client-side routing  
- **TailwindCSS** – Styling framework  
- **Service Workers** – Offline caching & sync (PWA)  
- **Geolocation API** – Location-based task validation  
- **IndexedDB / localStorage** – Offline data persistence  
- **Push Notifications API** – Real-time alerts  
- **React Calendar / Scheduler** – Visual task calendar  
- **React Query** – API state management and caching

---

## 🌟 Features

- 🔐 Role-based access: Supervisors & Contractors  
- 📁 Project management: Create projects, assign users  
- 📆 Calendar integration: Tasks and exams shown in calendar view  
- 📝 Exams assigned to supervisors with deadlines  
- 📍 Location enforcement: Supervisors must be on-site to submit exams  
- 📶 Full offline support with automatic sync  
- 📲 Installable PWA on mobile and desktop  
- 🔔 Real-time push notifications  
- 🌐 Fully responsive and mobile-first design  
- 🛠 Many other advanced features...

---

## 🚀 Getting Started

```bash
git clone https://github.com/omid-tavakoli/construction-dashboard-pwa.git
cd construction-dashboard-pwa
npm install
npm run dev
