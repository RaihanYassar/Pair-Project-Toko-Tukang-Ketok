'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderItems', 'OrderId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Orders',
        key: 'id' 
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('OrderItems', 'OrderId', {})

  }
};
