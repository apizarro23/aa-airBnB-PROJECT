'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Spots', [
      {
        ownerId: 1,
        address: '1600 Pennsylvania Avenue',
        city: 'Washington, D.C.',
        state: 'District of Columbia',
        country: 'USA',
        lat: -21.02155,
        lng: -55.13209,
        name: 'The White House',
        description: 'POTUS Residence',
        price: 123,
        previewImage: 'https://i.natgeofe.com/k/ef90348b-94f1-450e-9bab-5006a387395b/bo-white-house_4x3.jpg'
      },
      {
        ownerId: 2,
        address: '31 Spooner St',
        city: 'Quahog',
        state: 'Rhode Island',
        country: 'USA',
        lat: 40.15489,
        lng: 8.61536,
        name: 'The Griffin Family',
        description: 'Giggitty Gigitty',
        price: 123,
        previewImage: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2017/04/Family-Guy-the-Griffin-House.jpg?q=50&fit=crop&w=963&h=481&dpr=1.5'
      },
      {
        ownerId: 3,
        address: '177a Bleecker St',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 68.03786,
        lng: -160.66581,
        name: 'Sanctum Santorum',
        description: 'Visit everywhere and anytime with the Eye of Agamotto',
        price: 123,
        previewImage: 'https://i.pinimg.com/originals/6a/67/38/6a673839d59ea4ebbc88ee03107f582b.png'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};