module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ion_chamber', {
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    manufacturer:         { type: DataTypes.STRING, allowNull: false },
    model:                { type: DataTypes.STRING, allowNull: false },
    comment:              { type: DataTypes.STRING, allowNull: false },
    a:                    { type: DataTypes.FLOAT, allowNull: true },
    b:                    { type: DataTypes.FLOAT, allowNull: true },
    c:                    { type: DataTypes.FLOAT, allowNull: true },
    kq63:                 { type: DataTypes.FLOAT, allowNull: true },
    kq67:                 { type: DataTypes.FLOAT, allowNull: true },
    kq73:                 { type: DataTypes.FLOAT, allowNull: true },
    kq77:                 { type: DataTypes.FLOAT, allowNull: true },
    kq81:                 { type: DataTypes.FLOAT, allowNull: true },
    kecal:                { type: DataTypes.FLOAT, allowNull: true },
    rcav:                 { type: DataTypes.FLOAT, allowNull: true },
    name:                 { type: DataTypes.STRING, allowNull: true }
  })
}
