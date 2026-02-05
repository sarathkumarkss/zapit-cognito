const Sequelize = require('sequelize')
const Op = Sequelize.Op
const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var TestRunNote = sequelize.define('test_run_note', {
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    test_run_id:          { type: DataTypes.INTEGER, allowNull: false },
    note_id:              { type: DataTypes.INTEGER, allowNull: false },
    user_created_id:      { type: DataTypes.INTEGER, allowNull: true },
    user_updated_id:      { type: DataTypes.INTEGER, allowNull: true },
    user_deleted_id:      { type: DataTypes.INTEGER, allowNull: true }
  },{
    indexes: [
      {fields: ['test_run_id']},
      {fields: ['note_id']},
      {unique: true, fields: ['test_run_id','note_id']}
    ]
  })

  TestRunNote.prototype.notifications = function(action, time) {
    return db.model.TestRunNote.findByPk(this.id,{
      paranoid: false,
      include: [
        {association: 'user_created'},
        {association: 'user_updated'},
        {association: 'user_deleted'},
        {association: 'test_run', include: [{association: 'machine', include: [{association: 'facility', include: [{association: 'org'}]}]}]},
        {association: 'note'},
      ]
    })
    .then(testrun_note => {
      var where = {
        [Op.and]: _.compact([
          {[Op.or]: [
            {machine_id:  testrun_note.test_run.machine.id},
            {facility_id: testrun_note.test_run.machine.facility.id},
            {org_id:      testrun_note.test_run.machine.facility.org.id}
          ]},
          {entity: 'testrun_note_file'},
          {action: action},
          {notification_time_id: time === 'immediate' ? 1 : time}
        ])
      }

      return Promise.props({
        notifications: db.model.UserNotification.findAll({
          where: where,
          include: [{association: 'user'}]
        }),
        rec: Promise.resolve(testrun_note)
      })
    })
  }

  TestRunNote.addHook('afterCreate','afterCreate',(rec, options) => {
    console.log('testrun_note - afterCreate - ' + rec.id)
    return SendNotifications({type: 'test_run_note', ids: [rec.id], action: 'create'})
  })

  TestRunNote.addHook('beforeDestroy','beforeDestroy',(rec, options) => {
    console.log('testrun_note - beforeDestroy - TestRunNote')
    return SendNotifications({type: 'test_run_note', ids: [rec.id], action: 'delete'})
  })

  return TestRunNote
}
