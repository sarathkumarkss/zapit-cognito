module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification_field', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    notification_id:          { type: DataTypes.INTEGER, allowNull: false },
    field_name:               { type: DataTypes.STRING, allowNull: false }
  })
}
