module.exports = (sequelize, DataTypes) => {
  return sequelize.define('procedure', Object.assign({},{
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:       { type: DataTypes.STRING, allowNull: true },
    org_id:       { type: DataTypes.INTEGER, allowNull: true },
    name:         { type: DataTypes.STRING, allowNull: false, audit: true },
    html:         { type: DataTypes.TEXT('long'), allowNull: false, audit: true},
    test_id:      { type: DataTypes.INTEGER, allowNull: false }
  },user_columns))
}
