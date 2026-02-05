const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('date_range', {
    date:      { type: DataTypes.DATEONLY, allowNull: false, primaryKey: true}
  }, {timestamps: false}
)
}
