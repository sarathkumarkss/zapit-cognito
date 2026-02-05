module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ack', Object.assign({},{
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    procedure_id:       { type: DataTypes.INTEGER, allowNull: true },
    announcement_id:    { type: DataTypes.INTEGER, allowNull: true },
  },user_columns))
}
