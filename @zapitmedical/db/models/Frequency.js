module.exports = (sequelize, DataTypes) => {
  return sequelize.define('frequency', {
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    name:             { type: DataTypes.STRING, allowNull: false },
    label:            { type: DataTypes.STRING, allowNull: false },
    val:              { type: DataTypes.INTEGER, allowNull: false }
  })
}
