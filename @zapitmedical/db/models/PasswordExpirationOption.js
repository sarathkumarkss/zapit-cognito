module.exports = (sequelize, DataTypes) => {
  return sequelize.define('password_expiration_option',{
    id:         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    name:       { type: DataTypes.STRING, allowNull: true },
    label:      { type: DataTypes.STRING, allowNull: true },
  })
}
