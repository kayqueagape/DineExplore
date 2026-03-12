import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Restaurant = sequelize.define('Restaurant', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  cuisine: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: true },
  zipCode: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: false, defaultValue: 'USA' },
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  website: { type: DataTypes.STRING, allowNull: true },
  priceRange: { type: DataTypes.ENUM('$', '$$', '$$$', '$$$$'), allowNull: true },
  imageUrl: { type: DataTypes.STRING, allowNull: true },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('images');
      if (!raw) return [];
      try { return JSON.parse(raw); } catch { return []; }
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(Array.isArray(val) ? val : []));
    }
  },
  averageRating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0, allowNull: false },
  totalReviews: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false }
}, { timestamps: true, tableName: 'restaurants' });

export default Restaurant;