'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'UserId' })
      Order.belongsToMany(models.Product, { through: models.OrderItem, foreignKey: 'OrderId' })
    }
  }
  Order.init({
    officialStore: DataTypes.STRING,
    orderDate: DataTypes.DATE,
    quantity: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};