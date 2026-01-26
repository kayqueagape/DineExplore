## 🍽️ DineExplore

A sophisticated backend platform for discovering the best local dining experiences. This project leverages geolocation to filter restaurants, integrates real-time community feedback, and features a live chat for user interaction.

---

## 📖 Table of Contents
* [Features](#-features)
* [Technologies](#️-technologies)
* [Database Architecture](#-database-architecture)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Available Scripts](#-available-scripts)

---

## 🚀 Features

* **Location-Based Filtering:** Automatically identifies and suggests the best restaurants near the user's current coordinates.
* **Real-Time Reviews:** A dynamic community review system where foodies can share their experiences instantly.
* **Integrated Chat:** Real-time communication between users to discuss reservations, menus, or recommendations.
* **Relational Data Integrity:** Robust data management using PostgreSQL and Sequelize ORM.

---

## 🛠️ Technologies

* **Node.js** - JavaScript runtime environment.
* **Express.js** - Fast, unopinionated, minimalist web framework.
* **Sequelize** - Modern TypeScript and Node.js ORM for PostgreSQL.
* **PostgreSQL** - Powerful, open source object-relational database system.
* **Socket.io** (Optional/Suggested) - For real-time chat and review updates.
* **Dotenv** - For managing environment variables.

---

## 🗄️ Database Architecture

The project uses a relational structure to handle complex associations between users, restaurant locations, and real-time interactions.



---

## 🏁 Getting Started

### Prerequisites
* Node.js (v14 or higher)
* PostgreSQL installed and running
* NPM or Yarn

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/restaurant-discoveries.git](https://github.com/yourusername/restaurant-discoveries.git)
   cd restaurant-discoveries
   npm install

##🔑 Environment Variables

Create a .env file in the root directory and add the following:

PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=restaurant_db
DB_DIALECT=postgres
JWT_SECRET=your_super_secret_key


##📜 Available Scripts
npm run dev: Starts the server with Nodemon for development.

npm start: Starts the production server.

npx sequelize-cli db:migrate: Runs all pending database migrations.

npx sequelize-cli db:seed:all: Populates the database with initial sample data.



🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

Developed by [Kayque]
