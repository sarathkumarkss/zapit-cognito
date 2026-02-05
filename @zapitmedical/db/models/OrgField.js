module.exports = (sequelize, DataTypes) => {
  var Org = sequelize.define('org_field', Object.assign({},{
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    org_id:                   { type: DataTypes.STRING, allowNull: false, audit: true },
    field_name:               { type: DataTypes.STRING, allowNull: false, audit: true },
    available:                { type: DataTypes.BOOLEAN, allowNull: false, audit: true, default: true },
    hidden:                   { type: DataTypes.BOOLEAN, allowNull: false, audit: true, default: false }
  },user_columns),{
    indexes: [
      {fields: ['org_id','field_name'], unique: true}
    ]
  })

  return Org
}
