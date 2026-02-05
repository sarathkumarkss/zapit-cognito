module.exports = (sequelize, DataTypes) => {
  return sequelize.define('analyze_log', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    upload_id:          { type: DataTypes.INTEGER, allowNull: true },
    upload_file_id:     { type: DataTypes.INTEGER, allowNull: true },
    level:              { type: DataTypes.STRING, allowNull: false },
    content:            { type: DataTypes.TEXT, allowNull: false }
  },{
    indexes: [
      {fields: ['upload_id']},
      {fields: ['upload_file_id']},
    ]
  })
}
