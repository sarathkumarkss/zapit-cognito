module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_sample', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_id:            { type: DataTypes.INTEGER, allowNull: false },
    status:             { type: DataTypes.ENUM('pass','fail'), defaultValue: 'pass' }
  })
}
