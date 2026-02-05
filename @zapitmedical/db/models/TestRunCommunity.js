module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_run_community', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_run_date:      { type: DataTypes.DATEONLY, allowNull: false },
    field_id:           { type: DataTypes.INTEGER, allowNull: false },
    val:                { type: DataTypes.STRING, allowNull: true }
  },{
    indexes: [
      {fields: ['test_run_date']},
      {fields: ['field_id']}
    ]
  })
}
