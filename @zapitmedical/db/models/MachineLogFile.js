const Sequelize = require('sequelize')
const Op = Sequelize.Op
const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var MachineLogFile = sequelize.define('machine_log_file', Object.assign({},{
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    machine_log_id:       { type: DataTypes.INTEGER, allowNull: false },
    file_id:              { type: DataTypes.INTEGER, allowNull: false }
  },user_columns),{
    indexes: [
      {unique: true, fields: ['machine_log_id','file_id']},
      {fields: ['machine_log_id']},
      {fields: ['file_id']}
    ]
  })

  MachineLogFile.prototype.notifications = function(action, time) {
    return db.model.MachineLogFile.findByPk(this.id,{
      paranoid: false,
      include: [
        {association: 'user_created'},
        {association: 'user_updated'},
        {association: 'user_deleted'},
        {association: 'machine_log', include: [{association: 'machine', include: [{association: 'facility', include: [{association: 'org'}]}]}]},
        {association: 'file'},
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

  MachineLogFile.addHook('afterCreate','afterCreate',(rec, options) => {
    return SendNotifications({type: 'machine_log_file', ids: [rec.id], action: 'create'})
  })

  // MachineLogFile.addHook('afterUpdate','afterUpdate',(rec, options) => {
  //   return SendNotifications({type: 'machine_log_file', ids: [rec.id], action: 'edit'})
  // })

  MachineLogFile.addHook('beforeDestroy','beforeDestroy',(rec, options) => {
    return SendNotifications({type: 'machine_log_file', ids: [rec.id], action: 'delete'})
  })

  return MachineLogFile
}
