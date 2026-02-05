module.exports = (sequelize, DataTypes) => {
  return sequelize.define('report_setting_field', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    report_setting_id:        { type: DataTypes.INTEGER, allowNull: false },
    field_id:                 { type: DataTypes.INTEGER, allowNull: false }
  })
}
