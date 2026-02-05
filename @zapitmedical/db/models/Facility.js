module.exports = (sequelize, DataTypes) => {
  return sequelize.define('facility', Object.assign({},{
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:             { type: DataTypes.STRING, allowNull: true },
    org_id:             { type: DataTypes.INTEGER, allowNull: false },
    name:               { type: DataTypes.STRING, allowNull: false, audit: true },
    address1:           { type: DataTypes.STRING, allowNull: true, audit: true },
    address2:           { type: DataTypes.STRING, allowNull: true, audit: true },
    city:               { type: DataTypes.STRING, allowNull: true, audit: true },
    state:              { type: DataTypes.STRING, allowNull: true, audit: true },
    zip:                { type: DataTypes.STRING, allowNull: true, audit: true },
    country:            { type: DataTypes.STRING, allowNull: true, audit: true },
    state_reg_num:      { type: DataTypes.STRING, allowNull: true, audit: true },
    timezone:           { type: DataTypes.STRING, allowNull: true, audit: true }
  },user_columns)
  ,{
    indexes: [
      {unique: true, fields: ['org_id','name']},
      {fields: ['old_id']},
      {fields: ['org_id']}
    ]
  })
}
