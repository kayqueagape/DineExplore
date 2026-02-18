import User from "./user.js";
import Restaurant from "./restaurant.js";
import Review from "./review.js";

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Restaurant.hasMany(Review, { foreignKey: 'restaurantId', as: 'reviews' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

export { User, Restaurant, Review };
