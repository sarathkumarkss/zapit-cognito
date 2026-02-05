module.exports = (sequelize, DataTypes) => {
  return sequelize.define('zap2it_question', {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    user_id:      { type: DataTypes.INTEGER, allowNull: false },
    title:        { type: DataTypes.STRING, allowNull: false },
    content:      { type: DataTypes.TEXT, allowNull: false }
  })
}
