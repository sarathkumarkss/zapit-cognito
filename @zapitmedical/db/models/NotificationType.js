module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification_type', {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:         { type: DataTypes.STRING, allowNull: false },
    label:        { type: DataTypes.STRING, allowNull: false },
    subject:      { type: DataTypes.STRING, allowNull: true }
  })
}
