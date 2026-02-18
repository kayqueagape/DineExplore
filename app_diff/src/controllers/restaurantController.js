import { Op } from "sequelize";
import Restaurant from "../models/restaurant.js";
import Review from "../models/review.js";
import User from "../models/user.js";

class RestaurantController {
  static async getAllRestaurants(req, res) {
    try {
      const { latitude, longitude, radius = 10, cuisine, minRating, search } = req.query;

      let whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (cuisine) {
        whereClause.cuisine = { [Op.iLike]: `%${cuisine}%` };
      }

      if (minRating) {
        whereClause.averageRating = { [Op.gte]: parseFloat(minRating) };
      }

      let restaurants = await Restaurant.findAll({
        where: whereClause,
        order: [['averageRating', 'DESC']],
        include: [{
          model: Review,
          as: 'reviews',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }],
          limit: 5,
          order: [['createdAt', 'DESC']]
        }]
      });

      if (latitude && longitude) {
        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);
        const radiusKm = parseFloat(radius);

        restaurants = restaurants.filter(restaurant => {
          const distance = RestaurantController.calculateDistance(
            userLat,
            userLon,
            parseFloat(restaurant.latitude),
            parseFloat(restaurant.longitude)
          );
          restaurant.dataValues.distance = distance;
          return distance <= radiusKm;
        });

        restaurants.sort((a, b) => a.dataValues.distance - b.dataValues.distance);
      }

      res.json(restaurants);
    } catch (error) {
      console.error('Get restaurants error:', error);
      res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
  }

  static async getRestaurantById(req, res) {
    try {
      const { id } = req.params;

      const restaurant = await Restaurant.findByPk(id, {
        include: [{
          model: Review,
          as: 'reviews',
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'avatar']
          }],
          order: [['createdAt', 'DESC']]
        }]
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      res.json(restaurant);
    } catch (error) {
      console.error('Get restaurant error:', error);
      res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
    }
  }

  static async createRestaurant(req, res) {
    try {
      const restaurantData = req.body;
      const restaurant = await Restaurant.create(restaurantData);
      res.status(201).json(restaurant);
    } catch (error) {
      console.error('Create restaurant error:', error);
      res.status(500).json({ message: 'Error creating restaurant', error: error.message });
    }
  }

  static async updateRestaurant(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      await restaurant.update(updateData);
      res.json(restaurant);
    } catch (error) {
      console.error('Update restaurant error:', error);
      res.status(500).json({ message: 'Error updating restaurant', error: error.message });
    }
  }

  static async deleteRestaurant(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      await restaurant.destroy();
      res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
      console.error('Delete restaurant error:', error);
      res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
    }
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export default RestaurantController;
