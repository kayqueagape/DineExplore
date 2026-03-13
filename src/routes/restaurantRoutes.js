import express from "express";
import RestaurantController from "../controllers/restaurantController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", RestaurantController.getAllRestaurants);
router.get("/:id", RestaurantController.getRestaurantById);
router.post("/", authenticateToken, RestaurantController.createRestaurant);
router.put("/:id", authenticateToken, RestaurantController.updateRestaurant);
router.delete("/:id", authenticateToken, RestaurantController.deleteRestaurant);

export default router;
