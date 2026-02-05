const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var MachineTestSetup = sequelize.define('machine_test_setup', Object.assign({},{
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:                   { type: DataTypes.STRING, allowNull: true },
    machine_id:               { type: DataTypes.INTEGER, allowNull: false },
    test_version_id:          { type: DataTypes.INTEGER, allowNull: false },
    alias:                    { type: DataTypes.STRING, allowNull: true },
    start_date:               { type: DataTypes.DATE, allowNull: true },
    frequency:                { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    procedure_id:             { type: DataTypes.INTEGER, allowNull: true }
  },user_columns),{
    indexes: [
      {fields: ['old_id']},
      {fields: ['machine_id']},
      {fields: ['test_version_id']},
      {fields: ['start_date']},
      {fields: ['frequency']},
      {fields: ['procedure_id']},
      {fields: ['created_at']},
      {fields: ['machine_id','test_version_id']}
    ]
  })

  MachineTestSetup.addHook('afterCreate','afterCreate',(rec, options) => {
    return SendNotifications({type: 'machine_test_setup', ids: [rec.id], action: 'create'})
  })

  return MachineTestSetup
}
