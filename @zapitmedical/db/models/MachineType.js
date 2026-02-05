module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_type', {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:         { type: DataTypes.STRING, allowNull: false, unique: true },
    label:        { type: DataTypes.STRING, allowNull: false, unique: true },
    is_device:    { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },{
    indexes: [
      {fields: ['name']},
      {fields: ['is_device']}
    ]
  })
}
