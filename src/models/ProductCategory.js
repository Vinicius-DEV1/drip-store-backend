const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ProductCategory extends Model {}

ProductCategory.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'product_categories',
    timestamps: false,
  }
);

module.exports = ProductCategory;
