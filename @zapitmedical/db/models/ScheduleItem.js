const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var ScheduleItem = sequelize.define('schedule_item', Object.assign({
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:           { type: DataTypes.STRING, allowNull: true },
    machine_id:       { type: DataTypes.INTEGER, allowNull: false },
    title:            { type: DataTypes.STRING, allowNull: false, audit: true },
    active:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, audit: true },
    due_date:         { type: DataTypes.DATE, allowNull: true, audit: true },
    recurring:        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    repeat_period:    { type: DataTypes.INTEGER, allowNull: true, audit: true }
  },user_columns),{
    indexes: [
      {fields: ['old_id']},
      {fields: ['machine_id']}
    ]
  })

  ScheduleItem.addHook('afterCreate','afterCreate',(rec, options) => {
    return SendNotifications({type: 'schedule_item', ids: [rec.id], action: 'create'})
  })

  ScheduleItem.addHook('beforeUpdate','beforeUpdate',(rec, options) => {
    return SendNotifications({type: 'schedule_item', ids: [rec.id], action: 'edit'})
  })

  ScheduleItem.addHook('beforeDestroy','beforeDestroy',(rec, options) => {
    return SendNotifications({type: 'schedule_item', ids: [rec.id], action: 'delete'})
  })

  return ScheduleItem
}
