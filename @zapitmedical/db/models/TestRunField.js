module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_run_field', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_run_id:        { type: DataTypes.INTEGER, allowNull: false },
    field_id:           { type: DataTypes.INTEGER, allowNull: false },
    val:                { type: DataTypes.STRING, allowNull: true },
    analyze_field_id:   { type: DataTypes.INTEGER, allowNull: true }
  },{
    indexes: [
      {fields: ['test_run_id']},
      {fields: ['field_id']},
      {fields: ['analyze_field_id']}
    ]
  })
}
