'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Spot.init({
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    previewImage: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    //address: DataTypes.STRING,
    //city: DataTypes.STRING,
    //state: DataTypes.STRING,
    //country: DataTypes.STRING,
    //lat: DataTypes.DECIMAL,
    //lng: DataTypes.DECIMAL,
    //name: DataTypes.STRING,
    //description: DataTypes.STRING,
    //price: DataTypes.DECIMAL,
    //previewImage: DataTypes.STRING,
    //ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};