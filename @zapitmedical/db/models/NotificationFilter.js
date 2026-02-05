module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification_filter', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    notification_id:          { type: DataTypes.INTEGER, allowNull: false },
    allow_all:                { type: DataTypes.BOOLEAN, allowNull: false },
    label:                    { type: DataTypes.STRING, allowNull: false },
    table_name:               { type: DataTypes.STRING, allowNull: false },
    label_field:              { type: DataTypes.STRING, allowNull: false },
    value_field:              { type: DataTypes.STRING, allowNull: false }
  })
}
