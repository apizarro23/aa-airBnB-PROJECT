'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [
      {
        userId: 1,
        spotId: 1,
        startDate: new Date('2022-10-01'),
        endDate: new Date('2022-10-05')
      },
      {
        userId: 2,
        spotId: 2,
        startDate: new Date ('2022-10-06'),
        endDate: new Date ('2022-10-10')
      },
      {
        userId: 3,
        spotId: 3,
        startDate: new Date ('2022-10-11'),
        endDate: new Date ('2022-10-15')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      startDate: { [Op.in]: ['2022-10-01', '2022-10-06', '2022-10-11'] }
    }, {});
  }
};