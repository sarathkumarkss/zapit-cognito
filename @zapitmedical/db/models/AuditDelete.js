module.exports = (sequelize, DataTypes) => {
  return sequelize.define('audit_delete', {
    id:             { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    table:          { type: DataTypes.STRING, allowNull: false },
    column:         { type: DataTypes.STRING, allowNull: false },
    row_id:         { type: DataTypes.INTEGER, allowNull: false },
    value:          { type: DataTypes.TEXT('long'), allowNull: true },
    date:           { type: DataTypes.DATE, allowNull: false },
    user_id:        { type: DataTypes.INTEGER, allowNull: true }
  })
}
