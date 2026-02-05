module.exports = (sequelize, DataTypes) => {
  return sequelize.define('file',Object.assign({},{
    id:           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    org_id:       { type: DataTypes.INTEGER, allowNull: true },
    old_id:       { type: DataTypes.STRING, allowNull: true },
    filename:     { type: DataTypes.STRING, allowNull: false },
    size:         { type: DataTypes.INTEGER, allowNull: false },
    type:         { type: DataTypes.STRING, allowNull: true }
  },user_columns))
}
