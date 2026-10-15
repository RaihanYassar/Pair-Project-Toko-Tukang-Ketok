'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'UserProfilesId', {
      type: Sequelize.INTEGER,
      references: { 
        model: 'UserProfiles', 
        key: 'id' 
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'UserProfilesId', {})
  }
};
