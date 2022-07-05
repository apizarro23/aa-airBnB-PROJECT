'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      )
      Image.belongsTo(
        models.Review,
        {foreignKey: 'reviewId'}
      )
    }
  }
  Image.init({
    url: {
      type: DataTypes.STRING
    },
    reviewId: {
      type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER
    }
    // url: DataTypes.STRING,
    // reviewId: DataTypes.INTEGER,
    // spotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};