'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        userId: 1,
        spotId: 1,
        review: 'Too much talk about politics.',
        stars: 3
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Dog talks to you too much.',
        stars: 3
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Too many activities occurring.',
        stars: '3'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviews', {
      address: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
