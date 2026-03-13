import express from "express";
import cors from "cors";
import dbfiles from "./db/database.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/reviews", reviewRoutes);
app.use("/users", userRoutes);


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "DineExplore API is running" });
});

const startServer = async () => {
  await dbfiles();
};

startServer();

export default app;
