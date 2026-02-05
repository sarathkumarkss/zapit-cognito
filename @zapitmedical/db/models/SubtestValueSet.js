module.exports = (sequelize, DataTypes) => {
  return sequelize.define('subtest_value_set', {
    id:                         { type: DataTypes.INTEGER,  autoIncrement: true, primaryKey: true },
    name:                       { type: DataTypes.STRING, unique: true, allowNull: false },
    version:                    { type: DataTypes.INTEGER, allowNull: false }
  })
}
