# DineExplore Backend API

Backend API for the DineExplore platform built with Node.js, Express, Sequelize, and PostgreSQL.

## 🚀 Features

- **JWT Authentication**: Secure authentication system with JWT tokens
- **Restaurant CRUD**: Complete restaurant management
- **Review System**: User ratings and comments
- **Smart Filters**: Search by location, cuisine, rating
- **Real-Time Chat**: Real-time communication using Socket.io
- **Geolocation**: Search for nearby restaurants using coordinates

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (or compatible database)
- npm or yarn

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in the `.env` file:
```env
DATABASE=“your-postgresql-connection-string”
JWT_SECRET="your-super-secure-jwt-secret"
PORT=3000
```

3. Run the server:
```bash
npm run dev
```

The server will be running at `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Log in
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Restaurants
- `GET /api/restaurants` - List restaurants (with optional filters)
  - Query params: `latitude`, `longitude`, `radius`, `cuisine`, `minRating`, `search`
- `GET /api/restaurants/:id` - Get details of a restaurant
- `POST /api/restaurants` - Create restaurant
