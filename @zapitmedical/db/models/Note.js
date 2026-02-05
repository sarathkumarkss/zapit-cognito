module.exports = (sequelize, DataTypes) => {
  return sequelize.define('note', Object.assign({},{
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:               { type: DataTypes.STRING, allowNull: true },
    content:              { type: DataTypes.TEXT, allowNull: false, audit: true }
  },user_columns)
  )
}
