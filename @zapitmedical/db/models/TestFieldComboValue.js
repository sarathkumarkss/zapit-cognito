module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_field_combo_value',{
    id:                         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_field_id:              { type: DataTypes.INTEGER, allowNull: false },
    label:                      { type: DataTypes.STRING, allowNull: false, defaultValue: true},
    value:                      { type: DataTypes.STRING, allowNull: false }
  },{
    indexes: [
      {fields: ['test_field_id']}
    ]
  })
}
