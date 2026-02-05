module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_ready_item', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_ready_group_id:      { type: DataTypes.INTEGER, allowNull: false },
    test_field_id:            { type: DataTypes.INTEGER, allowNull: false },
    val:                      { type: DataTypes.STRING, allowNull: false }
  },{
    indexes: [
      {unique: true, fields: ['test_ready_group_id','test_field_id']}
    ]
  })
}
