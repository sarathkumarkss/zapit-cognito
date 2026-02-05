module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_ready_group', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    test_version_id:    { type: DataTypes.INTEGER, allowNull: false },
    op:                 { type: DataTypes.ENUM(['and','or']), allowNull: false }
  })
}
