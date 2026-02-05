module.exports = (sequelize, DataTypes) => {
  return sequelize.define('zap2it_answer', {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    user_id:      { type: DataTypes.INTEGER, allowNull: false },
    question_id:  { type: DataTypes.INTEGER, allowNull: false },
    content:      { type: DataTypes.TEXT, allowNull: false }
  })
}
