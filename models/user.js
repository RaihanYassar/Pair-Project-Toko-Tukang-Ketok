'use strict';
const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.UserProfile, { foreignKey: 'UserProfilesId' })
      User.hasMany(models.Order, { foreignKey: 'UserId' })
    }

  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Username tidak boleh kosong!' },
        notNull: { msg: 'Username wajib diisi!' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password tidak boleh kosong!' },
        notNull: { msg: 'Password wajib diisi!' },
        len: { args: [8, 100], msg: 'Password minimal harus 8 karakter!' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email sudah terdaftar!' },
      validate: {
        notEmpty: { msg: 'Email tidak boleh kosong!' },
        notNull: { msg: 'Email wajib diisi!' },
        isEmail: { msg: 'Format email tidak valid!' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['buyer', 'seller']],
          msg: 'Role harus berupa buyer atau seller!'
        }
      }
    },
    UserProfilesId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(model => {
    model.password = bcrypt.hashSync(model.password, 10)
  })

  return User;
};