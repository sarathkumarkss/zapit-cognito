const Sequelize = require('sequelize')
const Op = Sequelize.Op
const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var TestRunFile = sequelize.define('test_run_file', {
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    test_run_id:          { type: DataTypes.INTEGER, allowNull: false },
    file_id:              { type: DataTypes.INTEGER, allowNull: false },
    user_created_id:      { type: DataTypes.INTEGER, allowNull: true },
    user_updated_id:      { type: DataTypes.INTEGER, allowNull: true },
    user_deleted_id:      { type: DataTypes.INTEGER, allowNull: true }
  },{
    indexes: [
      {fields: ['test_run_id']},
      {fields: ['file_id']},
      {unique: true, fields: ['test_run_id','file_id']}
    ]
  })

  TestRunFile.prototype.notifications = function(action, time) {
    return db.model.TestRunFile.findByPk(this.id,{
      paranoid: false,
      include: [
        {association: 'user_created'},
        {association: 'user_updated'},
        {association: 'user_deleted'},
        {association: 'test_run', include: [{association: 'machine', include: [{association: 'facility', include: [{association: 'org'}]}]}]},
        {association: 'file'},
      ]
    })
    .then(test_run_file => {
      var where = {
        [Op.and]: _.compact([
          {[Op.or]: [
            {machine_id:  test_run_file.test_run.machine.id},
            {facility_id: test_run_file.test_run.machine.facility.id},
            {org_id:      test_run_file.test_run.machine.facility.org.id}
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
        rec: Promise.resolve(test_run_file)
      })
    })
  }

  TestRunFile.addHook('afterCreate','afterCreate',(rec, options) => {
    console.log('testrun_file - afterCreate - ' + rec.id)
    return SendNotifications({type: 'test_run_file', ids: [rec.id], action: 'create'})
  })

  TestRunFile.addHook('beforeDestroy','beforeDestroy',(rec, options) => {
    return SendNotifications({type: 'test_run_file', ids: [rec.id], action: 'delete'})
  })

  return TestRunFile
}
