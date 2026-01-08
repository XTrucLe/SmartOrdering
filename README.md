# Smart Digital Menu 🍔

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)

**Smart Digital Menu** is a comprehensive F&B solution that transforms how customers order food. It features a context-aware QR system that seamlessly switches between **Dine-in** and **Delivery** modes without requiring user login, powered by advanced device fingerprinting and real-time socket communication.

---

## 🚀 Key Features

### 🌟 For Customers (No Login Required)
- **Context-Aware Scanning:** Automatically detects if the customer is at a specific table (Dine-in) or ordering from home (Delivery) based on the QR code.
- **Smart Fraud Protection:** Uses **Device Fingerprinting** to prevent spam orders and strictly enforces rate limiting (e.g., max 3 orders/hour) without annoying CAPTCHAs.
- **Real-time Availability:** Menu items update instantly (Out of stock/Available) without refreshing the page.

### 💼 For Operations (Admin Dashboard)
- **Live Order Stream:** WebSocket-powered dashboard for kitchen/staff to receive orders instantly with sound alerts.
- **QR Asset Generator:** Auto-generate and export print-ready PDF QR codes for tables.
- **Telegram Integration:** Get notified of new orders directly via Telegram Bot.

---

## 🛠 Tech Stack

This project is organized as a **Monorepo** using `npm workspaces`.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 15** | App Router, Server Components, SEO optimized. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework. |
| **UI Library** | **Shadcn/UI** | Accessible and customizable components. |
| **Backend** | **NestJS** | Scalable Node.js framework (Modular architecture). |
| **Database** | **PostgreSQL** | Relational database for structured order data. |
| **ORM** | **Prisma** | Type-safe database client. |
| **Real-time** | **Socket.io** | Bi-directional event-based communication. |
| **Caching** | **Redis** | Rate limiting and temporary session storage. |

---

## 📂 Project Structure

```text
smart-menu/
├── package.json              # Root scripts (npm workspaces)
├── client/                   # FRONTEND (Next.js)
│   ├── src/app/              # App Router (Pages)
│   ├── src/components/       # UI Components
│   └── ...
└── server/                   # BACKEND (NestJS)
    ├── prisma/               # Database Schema
    ├── src/modules/          # Feature Modules (Orders, Products...)
    └── ...