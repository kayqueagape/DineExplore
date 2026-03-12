import { Op } from "sequelize";
import { Review, Restaurant, User } from "../models/index.js";
import { uploadToR2, deleteFromR2 } from "../middleware/upload.js";

const MAX_IMAGES = 10;

class RestaurantController {
  static async getAllRestaurants(req, res) {
    try {
      const { latitude, longitude, radius = 10, cuisine, minRating, search } = req.query;
      let whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }
      if (cuisine) whereClause.cuisine = { [Op.iLike]: `%${cuisine}%` };
      if (minRating) whereClause.averageRating = { [Op.gte]: parseFloat(minRating) };

      let restaurants = await Restaurant.findAll({
        where: whereClause,
        order: [["averageRating", "DESC"]],
        include: [{
          model: Review, as: "reviews",
          include: [{ model: User, as: "user", attributes: ["id", "name", "avatar"] }],
          limit: 5, order: [["createdAt", "DESC"]],
        }],
      });

      if (latitude && longitude) {
        const userLat = parseFloat(latitude), userLon = parseFloat(longitude), radiusKm = parseFloat(radius);
        restaurants = restaurants.filter((r) => {
          const d = RestaurantController.calculateDistance(userLat, userLon, parseFloat(r.latitude), parseFloat(r.longitude));
          r.dataValues.distance = d;
          return d <= radiusKm;
        });
        restaurants.sort((a, b) => a.dataValues.distance - b.dataValues.distance);
      }
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Error fetching restaurants", error: error.message });
    }
  }

  static async getRestaurantById(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [{
          model: Review, as: "reviews",
          include: [{ model: User, as: "user", attributes: ["id", "name", "avatar"] }],
          order: [["createdAt", "DESC"]],
        }],
      });
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Error fetching restaurant", error: error.message });
    }
  }

  static async createRestaurant(req, res) {
    try {
      const restaurant = await Restaurant.create({ ...req.body });
      res.status(201).json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Error creating restaurant", error: error.message });
    }
  }

  static async updateRestaurant(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      await restaurant.update(req.body);
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Error updating restaurant", error: error.message });
    }
  }

  static async deleteRestaurant(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      const allImages = restaurant.images || [];
      if (restaurant.imageUrl && !allImages.includes(restaurant.imageUrl)) allImages.push(restaurant.imageUrl);
      await Promise.all(allImages.map(deleteFromR2));
      await restaurant.destroy();
      res.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting restaurant", error: error.message });
    }
  }

  static async uploadImages(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      if (!req.files || req.files.length === 0) return res.status(400).json({ message: "Nenhum arquivo enviado" });

      const current = restaurant.images || [];
      const slots = MAX_IMAGES - current.length;
      if (slots <= 0) return res.status(400).json({ message: `Limite de ${MAX_IMAGES} imagens atingido` });

      const toUpload = req.files.slice(0, slots);
      const newUrls = await Promise.all(toUpload.map((f) => uploadToR2(f.buffer, f.mimetype)));

      const updated = [...current, ...newUrls];
      await restaurant.update({ images: updated, imageUrl: updated[0] });

      res.json({ message: "Imagens enviadas", images: updated, imageUrl: updated[0] });
    } catch (error) {
      console.error("Upload images error:", error);
      res.status(500).json({ message: "Error uploading images", error: error.message });
    }
  }

  static async deleteImage(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

      const idx = parseInt(req.params.index);
      const images = restaurant.images || [];
      if (idx < 0 || idx >= images.length) return res.status(404).json({ message: "Imagem nao encontrada" });

      const [removed] = images.splice(idx, 1);
      await deleteFromR2(removed);
      await restaurant.update({ images, imageUrl: images[0] || null });

      res.json({ message: "Imagem deletada", images, imageUrl: images[0] || null });
    } catch (error) {
      res.status(500).json({ message: "Error deleting image", error: error.message });
    }
  }

  static async reorderImages(req, res) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      const { images } = req.body;
      if (!Array.isArray(images)) return res.status(400).json({ message: "images must be an array" });
      await restaurant.update({ images, imageUrl: images[0] || null });
      res.json({ message: "Reordenado", images, imageUrl: images[0] || null });
    } catch (error) {
      res.status(500).json({ message: "Error reordering images", error: error.message });
    }
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371, dLat = ((lat2 - lat1) * Math.PI) / 180, dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}

export default RestaurantController;