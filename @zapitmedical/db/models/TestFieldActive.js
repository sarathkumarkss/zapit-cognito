module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_field_active', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    affected_field_id:        { type: DataTypes.INTEGER, allowNull: false },
    criteria_field_id:        { type: DataTypes.INTEGER, allowNull: false },
    val:                      { type: DataTypes.STRING, allowNull: true }
  },{
    indexes: [
      {fields: ['affected_field_id']},
      {fields: ['criteria_field_id']}
    ]
  }
)}
