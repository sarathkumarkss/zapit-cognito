const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var MachineLogScheduleItem = sequelize.define('machine_log_schedule_item', Object.assign({},{
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    machine_log_id:       { type: DataTypes.INTEGER, allowNull: false },
    schedule_item_id:     { type: DataTypes.INTEGER, allowNull: false }
  },user_columns))

  MachineLogScheduleItem.addHook('afterCreate','afterCreate',(rec, options) => {
    return SendNotifications({type: 'machine_log_schedule_item', ids: [rec.id], action: 'create'})
  })

  MachineLogScheduleItem.addHook('afterDestroy','afterDestroy',(rec, options) => {
    return SendNotifications({type: 'machine_log_schedule_item', ids: [rec.id], action: 'delete'})
  })

  return MachineLogScheduleItem
}
