module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test',{
      id:                         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      machine_type_id:            { type: DataTypes.INTEGER, allowNull: false },
      active:                     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
      name:                       { type: DataTypes.STRING, allowNull: false }
    },{
      indexes: [
        {fields: ['machine_type_id']},
        {fields: ['name']}
      ]
    }
  )
}
