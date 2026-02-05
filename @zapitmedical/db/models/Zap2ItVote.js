module.exports = (sequelize, DataTypes) => {
  return sequelize.define('zap2it_vote', {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    answer_id:    { type: DataTypes.INTEGER, allowNull: false },
    user_id:      { type: DataTypes.INTEGER, allowNull: false },
    score:        { type: DataTypes.INTEGER, allowNull: false }
  },{indexes: [
    {unique: true, fields: ['answer_id','user_id']}
  ]})
}
