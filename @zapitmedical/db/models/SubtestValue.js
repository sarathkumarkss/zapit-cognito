module.exports = (sequelize, DataTypes) => {
  return sequelize.define('subtest_value', {
    id:                         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    set_id:                     { type: DataTypes.INTEGER, allowNull: false },
    name:                       { type: DataTypes.STRING, allowNull: false },
    label:                      { type: DataTypes.STRING, allowNull: false },
    units:                      { type: DataTypes.STRING, allowNull: true },
    value:                      { type: DataTypes.STRING, allowNull: true }
  },{
    indexes: [
      {fields: ['set_id']}
    ]
  })
}
