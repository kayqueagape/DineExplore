<div align="center">

# 🍽️ DineExplore — Backend API

**A powerful REST API for restaurant discovery, reviews, and geolocation-based search.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Sequelize-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

---

### 🌐 [Live Demo →](https://templete-dinner.onrender.com/) &nbsp;|&nbsp; 💻 [Frontend Repository →](https://github.com/kayqueagape/templete-dinner)


</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Demo & Frontend](#-live-demo--frontend)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running with Docker](#-running-with-docker)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🗺️ Overview

DineExplore is a full-featured backend API that powers a restaurant discovery platform. It handles user authentication, restaurant management, reviews, and location-based filtering — giving users a seamless experience finding great places to eat.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register, login, and profile endpoints
- 🍴 **Restaurant Management** — Full CRUD operations for restaurant listings
- ⭐ **Reviews & Ratings** — Create and list reviews with aggregated rating scores
- 📍 **Geolocation Filtering** — Search restaurants by coordinates and radius
- 🔍 **Search & Filters** — Filter by cuisine type, minimum rating, and keyword
- 🐳 **Docker Ready** — Dockerfile and docker-compose for painless deployment

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| ORM | Sequelize |
| Database | PostgreSQL |
| Auth | JSON Web Tokens (JWT) |
| DevOps | Docker & Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (local or via container)
- [Docker & Docker Compose](https://www.docker.com/) *(optional, but recommended)*
- npm or yarn

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/dineexplore-backend.git
cd dineexplore-backend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Configure environment variables** *(see section below)*

**4. Start the development server:**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database connection string
DATABASE=postgres://USER:PASS@HOST:PORT/DBNAME

# JWT secret key (use a long, random string in production)
JWT_SECRET=your_super_secret_jwt_key

# Server port
PORT=3000

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_r2_public_url
```

> 💡 **Example:** `DATABASE=postgres://admin:password@localhost:5432/dineexplore`

> ☁️ **R2:** The Cloudflare R2 variables are required for file upload functionality (restaurant images, etc.). You can find these credentials in your [Cloudflare R2 dashboard](https://dash.cloudflare.com/).

---

## 🐳 Running with Docker

Docker Compose is the recommended way to run the full stack locally (app + database together).

**Start everything with one command:**

```bash
docker-compose up --build
```

**Or build and run the image manually:**

```bash
docker build -t dineexplore-backend .
docker run \
  -e DATABASE="postgres://user:pass@host:5432/dineexplore" \
  -e JWT_SECRET="your_secret" \
  -p 3000:3000 \
  dineexplore-backend
```

> ⚠️ On first startup, the app may need a few seconds to wait for the database to be ready. Check `docker-compose.yml` for Postgres credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).

---

## 📡 API Reference

**Base URL:** `/api`

### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive a JWT token | ❌ |
| `GET` | `/api/auth/profile` | Get the authenticated user's profile | ✅ |

### 🍴 Restaurants

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/restaurants` | List restaurants (with filters) | ❌ |
| `GET` | `/api/restaurants/:id` | Get restaurant details | ❌ |
| `POST` | `/api/restaurants` | Create a new restaurant | ✅ |
| `PUT` | `/api/restaurants/:id` | Update a restaurant | ✅ |
| `DELETE` | `/api/restaurants/:id` | Delete a restaurant | ✅ |

**Available query params for `GET /api/restaurants`:**

| Param | Type | Description |
|---|---|---|
| `latitude` | `number` | User's latitude for geo-filtering |
| `longitude` | `number` | User's longitude for geo-filtering |
| `radius` | `number` | Search radius (in km/miles) |
| `cuisine` | `string` | Filter by cuisine type |
| `minRating` | `number` | Minimum average rating (e.g. `4`) |
| `search` | `string` | Keyword search by name or description |

### ⭐ Reviews

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/restaurants/:id/reviews` | Create a review for a restaurant | ✅ |
| `GET` | `/api/restaurants/:id/reviews` | List all reviews for a restaurant | ❌ |

### 👤 Users

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users/:id` | Get user data by ID | ✅ |

---

## 📁 Project Structure

```
dineexplore-backend/
│
├── server.js                   # Entry point (production)
├── docker-compose.yml
├── Dockerfile
├── .env.example
│
└── src/
    ├── app.js                  # Express app setup
    ├── config/
    │   ├── database.js         # Sequelize / DB configuration
    │   └── r2client.js         # Cloud storage client (optional)
    ├── controllers/            # Route handlers per resource
    ├── middleware/
    │   ├── auth.js             # JWT authentication middleware
    │   └── upload.js           # File upload middleware
    ├── models/                 # Sequelize models (User, Restaurant, Review)
    └── routes/                 # Express route definitions
```

---

## 📄 License

This project is licensed under the terms found in the [LICENSE](./LICENSE) file.

---