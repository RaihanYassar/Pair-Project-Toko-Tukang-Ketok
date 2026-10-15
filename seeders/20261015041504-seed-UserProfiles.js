'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = require('../data/userProfiles.json')
    data = data.map(el => {
      delete el.id
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('UserProfiles', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserProfiles', null, {});
  }
};
