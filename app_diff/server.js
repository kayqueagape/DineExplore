import app from "./src/app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import 'dotenv/config';

const port = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-restaurant", (restaurantId) => {
    socket.join(`restaurant-${restaurantId}`);
    console.log(`User ${socket.id} joined restaurant ${restaurantId}`);
  });

  socket.on("leave-restaurant", (restaurantId) => {
    socket.leave(`restaurant-${restaurantId}`);
    console.log(`User ${socket.id} left restaurant ${restaurantId}`);
  });

  socket.on("new-review", (data) => {
    socket.to(`restaurant-${data.restaurantId}`).emit("review-added", data);
  });

  socket.on("chat-message", (data) => {
    io.to(`restaurant-${data.restaurantId}`).emit("chat-message", {
      ...data,
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io available to routes if needed
app.set("io", io);

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Socket.io server ready for real-time connections`);
});
