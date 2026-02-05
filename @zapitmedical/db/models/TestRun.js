const Sequelize = require('sequelize')
const Op = Sequelize.Op
const SendNotifications = require('@zapitmedical/send_notifications')

module.exports = (sequelize, DataTypes) => {
  var TestRun = sequelize.define('test_run', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:             { type: DataTypes.STRING, allowNull: true },
    machine_id:         { type: DataTypes.INTEGER, allowNull: false },
    test_version_id:    { type: DataTypes.INTEGER, allowNull: false },
    setup_id:           { type: DataTypes.INTEGER, allowNull: true },
    analyze_upload_id:  { type: DataTypes.INTEGER, allowNull: true },
    location:           { type: DataTypes.STRING, allowNull: true },
    test_date:          { type: DataTypes.DATE, allowNull: false, audit: true },
    exclude:            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    resolved:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    status:             { type: DataTypes.ENUM('pass','fail','not_run'), allowNull: false},
    approve_date:       { type: DataTypes.DATE, allowNull: true, audit: true },
    approve_user_id:    { type: DataTypes.INTEGER, allowNull: true, audit: true },
    signoff_date:       { type: DataTypes.DATE, allowNull: true, audit: true },
    signoff_user_id:    { type: DataTypes.INTEGER, allowNull: true, audit: true },
    reject_date:        { type: DataTypes.DATE, allowNull: true },
    reject_user_id:     { type: DataTypes.INTEGER, allowNull: true },
    user_created_id:    { type: Sequelize.INTEGER, allowNull: false, audit: true },
    user_updated_id:    { type: Sequelize.INTEGER, allowNull: false },
    user_deleted_id:    { type: Sequelize.INTEGER, allowNull: true }
  },{
    indexes: [
      {fields: ['machine_id','test_version_id','approve_user_id','exclude']},
      {fields: ['old_id'] },
      {fields: ['machine_id']},
      {fields: ['test_version_id']},
      {fields: ['setup_id']},
      {fields: ['analyze_upload_id']},
      {fields: ['test_date']},
      {fields: ['exclude']},
      {fields: ['resolved']},
      {fields: ['approve_date']},
      {fields: ['approve_user_id']},
      {fields: ['signoff_date']},
      {fields: ['signoff_user_id']},
      {fields: ['reject_date']},
      {fields: ['reject_user_id']},
      {fields: ['created_at']},
      {fields: ['updated_at']},
      {fields: ['deleted_at']}
    ]
  })

  TestRun.prototype.notifications = function(action, time) {
    return db.model.TestRun.findByPk(this.id,{
      include: [
        {association: 'user_created'},
        {association: 'user_updated'},
        {association: 'approve_user'},
        {association: 'signoff_user'},
        {association: 'reject_user'},
        {association: 'test_version'},
        {association: 'machine', include: [{association: 'facility', include: [{association: 'org'}]}]}
      ]
    })
    .then(testrun => {
      var where = {
        [Op.and]: _.compact([
          {[Op.or]: [
            {machine_id:  testrun.machine.id},
            {facility_id: testrun.machine.facility.id},
            {org_id:      testrun.machine.facility.org.id}
          ]},
          {entity: 'testrun'},
          {action: action},
          {notification_time_id: time === 'immediate' ? 1 : time},
          // action === 'created' ? db.sequelize.fn('IF',{testrun_created_filter: {[Op.ne]: null}}, {'testrun_created_filter': this.status},true) : null
        ])
      }

      return Promise.props({
        notifications: db.model.UserNotification.findAll({
          where: where,
          include: [{association: 'user'}]
        }),
        rec: Promise.resolve(testrun)
      })
    })
  }

  //called on updating single record
  TestRun.addHook('afterUpdate','afterUpdate',(rec, options) => {
    return SendNotifications({type: 'test_run', action: 'edit', ids: [rec.id], changed_fields: options.fields})
  })

  //called on doAction
  TestRun.addHook('afterBulkUpdate','afterBulkUpdate',options => {
    console.log('HOOK!')
    console.log(options)
    return db.model.TestRun.findAll({where: options.where})
    .then(arr => {
      return SendNotifications({type: 'test_run', action: 'edit', ids: _.pluck(arr,'id'), changed_fields: options.fields})
    })
  })

  return TestRun
}
