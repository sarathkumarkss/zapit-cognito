module.exports = (sequelize, DataTypes) => {
  return sequelize.define('setup_subtest', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    machine_id:               { type: DataTypes.INTEGER, allowNull: false },
    test_id:                  { type: DataTypes.INTEGER, allowNull: false },
    subtest_value_id:         { type: DataTypes.INTEGER, allowNull: false },
    enabled:                  { type: DataTypes.BOOLEAN, allowNull: false },
    ordinal:                  { type: DataTypes.INTEGER, allowNull: false }
  },{
    indexes: [
      {fields: ['machine_id']},
      {fields: ['subtest_value_id']},
      {fields: ['machine_id','test_id','ordinal'], unique: true},
      {fields: ['machine_id','test_id','subtest_value_id'], unique: true}
    ]
  })
}
