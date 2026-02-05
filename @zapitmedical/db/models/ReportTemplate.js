module.exports = (sequelize, DataTypes) => {
  return sequelize.define('report_template', {
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:             { type: DataTypes.TEXT, allowNull: true },
    report_type_id:   { type: DataTypes.INTEGER, allowNull: false }
  })
}
