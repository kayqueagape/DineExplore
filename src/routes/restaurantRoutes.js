import express from "express";
import RestaurantController from "../controllers/restaurantController.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload, handleUploadError } from "../middleware/upload.js";

const router = express.Router();

router.get("/", RestaurantController.getAllRestaurants);
router.get("/:id", RestaurantController.getRestaurantById);
router.post("/", authenticateToken, RestaurantController.createRestaurant);
router.post("/:id/images", authenticateToken, upload.array("images", 10), handleUploadError, RestaurantController.uploadImages);
router.put("/:id", authenticateToken, RestaurantController.updateRestaurant);
router.put("/:id/images/reorder", authenticateToken, RestaurantController.reorderImages);
router.delete("/:id", authenticateToken, RestaurantController.deleteRestaurant);
router.delete("/:id/images/:index", authenticateToken, RestaurantController.deleteImage);


export default router;