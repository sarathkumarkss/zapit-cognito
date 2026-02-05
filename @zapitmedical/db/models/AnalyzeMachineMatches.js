module.exports = (sequelize, DataTypes) => {
  return sequelize.define('analyze_machine_matches', {
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    str:                  { type: DataTypes.STRING, allowNull: false },
    machine_id:           { type: DataTypes.STRING, allowNull: true }
  },{
    indexes: [
      {fields: ['machine_id']}
    ]
  })
}
