module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_test_setup_field', {
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    test_field_id:    { type: DataTypes.INTEGER, allowNull: false },
    val:              { type: DataTypes.STRING, allowNull: false },
    setup_id:         { type: DataTypes.INTEGER, allowNull: false }
  },{
    indexes: [
      {fields: ['test_field_id']},
      {fields: ['setup_id']},
      // {unique: true, fields: ['test_field_id','setup_id']}
    ]
  })
}
