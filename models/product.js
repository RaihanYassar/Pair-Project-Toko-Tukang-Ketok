'use strict';
const formatRupiah = require('../helpers/formatRupiah')
const { Op } = require('sequelize')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'CategoryId' })
      Product.belongsToMany(models.Order, { through: models.OrderItem, foreignKey: 'ProductId' })
    }

    get changeToRupiah() {
      return formatRupiah(this.price)
    }

    static async getAvailableProducts(search) {
      try {
        const {Category} = require('../models')

        let options = {
          include: [Category],
          order: [['price', 'ASC']]
        }

        if (search) {
          options.where = {
            name: {
              [Op.iLike]: `%${search}%`
            }
          };
        }

        const products = await Product.findAll(options);
        return products;
      } catch (err) {
        throw err;
      }
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nama produk wajib diisi!" },
        notNull: { msg: "Nama produk wajib diisi!" }
      }
    },
    description: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description produk wajib diisi!" },
        notNull: { msg: "Description produk wajib diisi!" }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Stok tidak boleh bernilai minus!" },
        isZero(value) {
          if (value === 0) {
            throw new Error("Stok produk habis!")
          }
        }
      }
    },
    imageUrl: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });



  return Product;
};