module.exports = (sequelize, DataTypes) => {
  return sequelize.define('analyze_result_data',{
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    upload_file_id:     { type: DataTypes.INTEGER, allowNull: false },
    analyze_field_id:   { type: DataTypes.INTEGER, allowNull: false },
    val:                { type: DataTypes.STRING, allowNull: true }
  },{
    indexes: [
      {fields: ['upload_file_id']},
      {fields: ['analyze_field_id']}
    ]
  })
}
