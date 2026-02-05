const Sequelize = require('sequelize')
const Op = Sequelize.Op
const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var MachineLogNote = sequelize.define('machine_log_note', Object.assign({},{
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    machine_log_id:   { type: DataTypes.INTEGER, allowNull: false },
    note_id:          { type: DataTypes.INTEGER, allowNull: false }
  },user_columns),{
    indexes: [
      {unique: true, fields: ['machine_log_id','note_id']}
    ]
  })

  MachineLogNote.prototype.notifications = function(action, time) {
    return db.model.MachineLogNote.findByPk(this.id,{
      paranoid: false,
      include: [
        {association: 'user_created'},
        {association: 'user_updated'},
        {association: 'user_deleted'},
        {association: 'machine_log', include: [{association: 'machine', include: [{association: 'facility', include: [{association: 'org'}]}]}]},
        {association: 'note'},
      ]
    })
    .then(machine_log_file => {
      var where = {
        [Op.and]: _.compact([
          {[Op.or]: [
            {machine_id:  machine_log_file.machine_log.machine.id},
            {facility_id: machine_log_file.machine_log.machine.facility.id},
            {org_id:      machine_log_file.machine_log.machine.facility.org.id}
          ]},
          {entity: 'machinelog_note_file'},
          {action: action},
          {notification_time_id: time === 'immediate' ? 1 : time}
        ])
      }

      return Promise.props({
        notifications: db.model.UserNotification.findAll({
          where: where,
          include: [{association: 'user'}]
        }),
        rec: Promise.resolve(machine_log_file)
      })
    })
  }

  MachineLogNote.addHook('afterCreate','afterCreate',(rec, options) => {
    return SendNotifications({type: 'machine_log_note', ids: [rec.id], action: 'create'})
  })

  // MachineLogNote.addHook('afterUpdate','afterUpdate',(rec, options) => {
  //   return SendNotifications({type: 'machine_log_note', ids: [rec.id], action: 'edit'})
  // })

  MachineLogNote.addHook('beforeDestroy','beforeDestroy',(rec, options) => {
    return SendNotifications({type: 'machine_log_note', ids: [rec.id], action: 'delete'})
  })

  return MachineLogNote
}
