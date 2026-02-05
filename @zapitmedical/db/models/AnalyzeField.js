module.exports = (sequelize, DataTypes) => {
  return sequelize.define('analyze_field',{
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    machine_type_id:    { type: DataTypes.INTEGER, allowNull: false },
    slice_name:         { type: DataTypes.STRING, allowNull: true },
    name:               { type: DataTypes.STRING, allowNull: false },
    label:              { type: DataTypes.STRING, allowNull: false }
  },{
    indexes: [
      {fields: ['machine_type_id']}
    ]
  })
}
