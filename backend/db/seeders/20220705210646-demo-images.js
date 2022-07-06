'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Images', [
      {
        url: 'https://www.tripsavvy.com/thmb/be385qOsamD6q9y0hlG_v2BNKPU=/900x0/filters:no_upscale():max_bytes(150000):strip_icc():gifv():format(webp)/white-house-2-56a238715f9b58b7d0c8049f.jpg',
        reviewId: 1,
        spotId: 1
      },
      {
        url: 'https://static.wikia.nocookie.net/familyguy/images/f/f1/Griffin_Home.jpg/revision/latest?cb=20090614171921',
        reviewId: 2,
        spotId: 2
      },
      {
        url: 'https://images.squarespace-cdn.com/content/v1/58863daabf629a37e37ab32e/1486606898848-B5F90PKHXHGTFSNDWPQC/image-asset.jpeg?format=1000w',
        reviewId: 3,
        spotId: 3
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Images', {
      address: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};