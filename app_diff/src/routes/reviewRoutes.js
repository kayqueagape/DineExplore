import express from "express";
import ReviewController from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, ReviewController.createReview);
router.put("/:id", authenticateToken, ReviewController.updateReview);
router.delete("/:id", authenticateToken, ReviewController.deleteReview);
router.get("/restaurant/:restaurantId", ReviewController.getReviewsByRestaurant);

export default router;
