module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_sample_field', {
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    sample_id:            { type: DataTypes.INTEGER, allowNull: false },
    test_field_id:        { type: DataTypes.INTEGER, allowNull: false },
    val:                  { type: DataTypes.STRING, allowNull: true }
  })
}
