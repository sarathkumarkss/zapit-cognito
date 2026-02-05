module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user_notification_item',Object.assign({},{
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    user_id:          { type: DataTypes.INTEGER, allowNull: false },
    equipment_name:   { type: DataTypes.STRING, allowNull: false },
    schedule_title:   { type: DataTypes.STRING, allowNull: false },
    due_date:         { type: DataTypes.DATEONLY, allowNull: false }
  },user_columns),{
    indexes: [
      {fields: ['user_id']}
    ]
  })
}
