module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_log_category', {
    id:         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:       { type: DataTypes.STRING, allowNull: false },
    label:      { type: DataTypes.STRING, allowNull: false }
  })
}
