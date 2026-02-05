module.exports = (sequelize, DataTypes) => {
  return sequelize.define('analyze_slice_type', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:               { type: DataTypes.INTEGER, allowNull: false }
  })
}
