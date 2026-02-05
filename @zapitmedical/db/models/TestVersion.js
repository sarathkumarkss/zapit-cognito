module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_version', {
    id:                         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_id:                    { type: DataTypes.INTEGER, allowNull: false },
    version:                    { type: DataTypes.INTEGER, allowNull: false },
    name:                       { type: DataTypes.STRING, allowNull: true },
    label:                      { type: DataTypes.STRING, allowNull: false },
    default_frequency:          { type: DataTypes.STRING, allowNull: false },
    parent_id:                  { type: DataTypes.INTEGER, allowNull: true },
    subtest_value_id:           { type: DataTypes.INTEGER, allowNull: true }
  },{
    indexes: [
      {fields: ['test_id']},
      {fields: ['version']},
      {fields: ['parent_id']},
      {fields: ['subtest_value_id']}
    ]
  })
}
