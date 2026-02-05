module.exports = (sequelize, DataTypes) => {
  return sequelize.define('graph_series',{
    id:                         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_id:                    { type: DataTypes.INTEGER, allowNull: false },
    name:                       { type: DataTypes.STRING, allowNull: false }
  },{
    indexes: [
      {fields: ['test_id']}
    ]
  })
}
