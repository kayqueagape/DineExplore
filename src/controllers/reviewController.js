import Review from "../models/review.js";
import Restaurant from "../models/restaurant.js";
import User from "../models/user.js";
import { sequelize } from "../db/database.js";

class ReviewController {
  static async createReview(req, res) {
    try {
      const { restaurantId, rating, comment } = req.body;
      const userId = req.user.id;

      if (!restaurantId || !rating) {
        return res.status(400).json({ message: 'Restaurant ID and rating are required' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      }

      const restaurant = await Restaurant.findByPk(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      const existingReview = await Review.findOne({
        where: { userId, restaurantId }
      });

      if (existingReview) {
        return res.status(409).json({ message: 'You have already reviewed this restaurant' });
      }

      const review = await Review.create({
        userId,
        restaurantId,
        rating,
        comment
      });

      await ReviewController.updateRestaurantRating(restaurantId);

      const reviewWithDetails = await Review.findByPk(review.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          },
          {
            model: Restaurant,
            as: 'restaurant',
            attributes: ['id', 'name']
          }
        ]
      });

      res.status(201).json(reviewWithDetails);
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ message: 'Error creating review', error: error.message });
    }
  }

  static async updateReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ message: 'You can only update your own reviews' });
      }

      if (rating !== undefined) {
        if (rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        review.rating = rating;
      }
      if (comment !== undefined) {
        review.comment = comment;
      }

      await review.save();
      await ReviewController.updateRestaurantRating(review.restaurantId);

      const updatedReview = await Review.findByPk(review.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          },
          {
            model: Restaurant,
            as: 'restaurant',
            attributes: ['id', 'name']
          }
        ]
      });

      res.json(updatedReview);
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  }

  static async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.userId !== userId) {
        return res.status(403).json({ message: 'You can only delete your own reviews' });
      }

      const restaurantId = review.restaurantId;
      await review.destroy();
      await ReviewController.updateRestaurantRating(restaurantId);

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  }

  static async getReviewsByRestaurant(req, res) {
    try {
      const { restaurantId } = req.params;

      const reviews = await Review.findAll({
        where: { restaurantId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }],
        order: [['createdAt', 'DESC']]
      });

      res.json(reviews);
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
  }

  static async updateRestaurantRating(restaurantId) {
    try {
      const result = await Review.findAll({
        where: { restaurantId },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
        ],
        raw: true
      });

      if (result && result[0]) {
        const avgRating = parseFloat(result[0].avgRating) || 0;
        const totalReviews = parseInt(result[0].totalReviews) || 0;

        await Restaurant.update(
          {
            averageRating: avgRating.toFixed(2),
            totalReviews: totalReviews
          },
          { where: { id: restaurantId } }
        );
      }
    } catch (error) {
      console.error('Error updating restaurant rating:', error);
    }
  }
}

export default ReviewController;
