DineExplore 🍽️
DineExplore is a robust restaurant discovery platform designed to help users find the best dining spots near their current location. By combining real-time community feedback with location-based filtering, it ensures you never have a bad meal again.

🚀 Features
Smart Filtering: Find the best places to eat based on your current geographical location.

Community Reviews: Read and write real-time reviews to share experiences with other foodies.

Real-time Chat: Integrated chat functionality to discuss reservations or ask the community questions in real-time.

Secure Authentication: User profiles and data protection (JWT/Bcrypt).

🛠️ Tech Stack
This project is built using the PERN stack (PostgreSQL, Express, Node) for the backend:

Node.js: JavaScript runtime environment.

Express.js: Web framework for building the API.

Sequelize: Promise-based Node.js ORM for Postgres.

PostgreSQL: Relational database for storing user, restaurant, and review data.

Socket.io (Recommended): For real-time chat and review updates.

📥 Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install dependencies:

Bash
npm install
Environment Variables: Create a .env file in the root directory and add your credentials:

Snippet de código
PORT=3000
DB_NAME=your_db_name
DB_USER=your_username
DB_PASS=your_password
DB_HOST=localhost
JWT_SECRET=your_secret_key
Database Migration: Run Sequelize migrations to set up your tables:

Bash
npx sequelize-db:migrate
Run the application:

Bash
npm run dev
🗺️ Database Schema
The database is structured to handle complex relationships between users, restaurants, and their interactions:

Users: Handles authentication and profiles.

Restaurants: Stores location data (Latitude/Longitude), descriptions, and categories.

Reviews: Connects users to restaurants with ratings and comments.

Messages: Stores real-time chat history.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

