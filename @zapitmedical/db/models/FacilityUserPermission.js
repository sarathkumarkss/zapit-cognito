module.exports = (sequelize, DataTypes) => {
  return sequelize.define('facility_user_permission', {
    id:                               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    facility_user_id:                 { type: DataTypes.INTEGER, allowNull: false },
    machine_type_id:                  { type: DataTypes.INTEGER, allowNull: false }
  },{
    indexes: [
      {fields: ['facility_user_id','machine_type_id'], unique: true},
      {fields: ['facility_user_id']},
      {fields: ['machine_type_id']}
    ]
  })
}
