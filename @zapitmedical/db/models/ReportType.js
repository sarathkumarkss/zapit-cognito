module.exports = (sequelize, DataTypes) => {
  return sequelize.define('report_type', {
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:             { type: DataTypes.TEXT, allowNull: false }
  })
}
