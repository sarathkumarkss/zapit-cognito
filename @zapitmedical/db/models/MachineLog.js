const Sequelize = require('sequelize')
const Op = Sequelize.Op
const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var MachineLog = sequelize.define('machine_log', Object.assign({},{
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:               { type: DataTypes.STRING, allowNull: true },
    machine_id:           { type: DataTypes.INTEGER, allowNull: false },
    date:                 { type: DataTypes.DATE, allowNull: false, audit: true },
    category_id:          { type: DataTypes.INTEGER, allowNull: false, audit: true },
    outage_time:          { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0, audit: true },
    outage_units_id:      { type: DataTypes.INTEGER, allowNull: false, audit: true },
    status_id:            { type: DataTypes.INTEGER, allowNull: false, audit: true },
    title:                { type: DataTypes.STRING, allowNull: false, audit: true },
    close_date:           { type: DataTypes.DATE, allowNull: true, audit: true },
    service_ticket_num:   { type: DataTypes.STRING, allowNull: true, audit: true }
  },user_columns))

  MachineLog.prototype.notifications = function(action, time) {
    return db.model.MachineLog.findByPk(this.id,{
      include: [
        {association: 'user_created'},
        {association: 'user_updated'},
        {association: 'machine', include: [{association: 'facility', include: [{association: 'org'}]}]},
        {association: 'files',include: ['file']},
        {association: 'notes',include: ['note']}
      ]
    })
    .then(logitem => {
      var where = {
        [Op.and]: _.compact([
          {[Op.or]: [
            {machine_id:  logitem.machine.id},
            {facility_id: logitem.machine.facility.id},
            {org_id:      logitem.machine.facility.org.id}
          ]},
          {entity: 'machinelog'},
          {action: action},
          {notification_time_id: time === 'immediate' ? 1 : time}
        ])
      }

      return Promise.props({
        notifications: db.model.UserNotification.findAll({
          where: where,
          include: [{association: 'user'}]
        }),
        rec: Promise.resolve(logitem)
      })
    })
  }

  MachineLog.addHook('afterCreate','afterCreate',(rec, options) => {
    return SendNotifications({type: 'machine_log', ids: [rec.id], action: 'create'})
  })

  MachineLog.addHook('afterUpdate','afterUpdate',(rec, options) => {
    return SendNotifications({type: 'machine_log', ids: [rec.id], action: 'edit'})
  })

  MachineLog.addHook('afterDestroy','afterDestroy',rec => {
    return SendNotifications({type: 'machine_log', ids: [rec.id], action: 'delete'})
  })

  return MachineLog
}
