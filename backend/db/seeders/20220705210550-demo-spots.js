'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        ownerId: 1,
        address: '1600 Pennsylvania Avenue',
        city: 'Washington, D.C.',
        state: 'District of Columbia',
        country: 'USA',
        lat: 1,
        lng: 1,
        name: 'The White House',
        description: 'POTUS Residence',
        price: 123,
        previewImage: '',

      },
      {
        ownerId: 2,
        address: '31 Spooner St',
        city: 'Quahog',
        state: 'Rhode Island',
        country: 'USA',
        lat: 1,
        lng: 1,
        name: 'The Griffin Family',
        description: 'Giggitty Gigitty',
        price: 123,
        previewImage: '',

      },
      {
        ownerId: 3,
        address: '177a Bleecker St',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 1,
        lng: 1,
        name: 'Sanctum Santorum',
        description: 'Visit everywhere and anytime with the Eye of Agamotto',
        price: 123,
        previewImage: '',

      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      address: { [Op.in]: ['1600 Pennsylvania Avenue', '31 Spooner St', '177a Bleecker St'] }
    }, {});
  }
};