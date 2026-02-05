module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification_time', {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:         { type: DataTypes.STRING, allowNull: false },
    label:        { type: DataTypes.STRING, allowNull: false }
  })
}
