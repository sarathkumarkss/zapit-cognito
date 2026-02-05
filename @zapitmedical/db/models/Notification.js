module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notification', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    email_subject:            { type: DataTypes.STRING, allowNull: false },
    table:                    { type: DataTypes.STRING, allowNull: false },
    // table_label:              { type: DataTypes.STRING, allowNull: false },
    // parent_relation:          { type: DataTypes.STRING, allowNull: true },
    action:                   { type: DataTypes.ENUM('create','edit','delete','due','overdue'), allowNull: false },
    frequency_immediate:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    frequency_daily:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    frequency_weekly:         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    frequency_monthly:        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    days_prior:               { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  })
}
