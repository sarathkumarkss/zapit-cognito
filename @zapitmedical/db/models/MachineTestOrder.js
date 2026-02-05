module.exports = (sequelize, DataTypes) => {
  return sequelize.define('machine_test_order', {
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    machine_id:           { type: DataTypes.INTEGER, allowNull: false },
    test_id:              { type: DataTypes.INTEGER, allowNull: false },
    ordinal:              { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },{
    paranoid: false,
    indexes: [
      {fields: ['machine_id','test_id'], unique: true},
      {fields: ['machine_id','ordinal'], unique: true}
    ]
  })
}
