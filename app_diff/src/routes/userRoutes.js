import express from "express";
import UserController from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, UserController.getAllUsers);
router.get("/:id", authenticateToken, UserController.getUserById);

export default router;
