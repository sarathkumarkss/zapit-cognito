module.exports = (sequelize, DataTypes) => {
  return sequelize.define('org_file', {
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    org_id:       { type: DataTypes.INTEGER, allowNull: false },
    file_id:      { type: DataTypes.INTEGER, allowNull: false }
  },{
    indexes: [
      {fields: ['org_id']},
      {fields: ['file_id']}
    ]
  })
}
