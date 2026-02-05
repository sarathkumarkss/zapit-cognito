const glob = require('glob')
const path = require('path')
global['_'] = require('underscore')
const Promise = require('bluebird')
global.Promise = Promise
const yaml = require('yamljs')
const Sequelize = require('sequelize')
const fs = require('fs')

var config = {
  local: {
    db: 'zapit',
    username: 'pete',
    password: '365dity',
    replication: {
      read: [
        { host: '192.168.0.17', username: 'pete', password: '365dity' }
      ],
      write: { host: '192.168.0.17', username: 'pete', password: '365dity' }
    }
  },
  dev: {
    db: 'zapit',
    username: 'KimpTu2NACrCBoar',
    password: '8rW672ANcj4r',
    replication: {
      read: [
        { host: 'dev.cykdlsurxzfo.us-east-1.rds.amazonaws.com', username: 'KimpTu2NACrCBoar', password: '8rW672ANcj4r' }
      ],
      write: { host: 'dev.cykdlsurxzfo.us-east-1.rds.amazonaws.com', username: 'KimpTu2NACrCBoar', password: '8rW672ANcj4r' }
    }
  },
  test: {
    db: 'zapit',
    username: 'KimpTu2NACrCBoar',
    password: '8rW672ANcj4r',
    replication: {
      read: [
        { host: 'test-read1.cykdlsurxzfo.us-east-1.rds.amazonaws.com', username: 'KimpTu2NACrCBoar', password: '8rW672ANcj4r' },
        { host: 'test-read2.cykdlsurxzfo.us-east-1.rds.amazonaws.com', username: 'KimpTu2NACrCBoar', password: '8rW672ANcj4r' },
      ],
      write: { host: 'test.cykdlsurxzfo.us-east-1.rds.amazonaws.com', username: 'KimpTu2NACrCBoar', password: '8rW672ANcj4r' }
    }
  },
  prod: {
    db: 'zapit',
    username: 'KimpTu2NACrCBoar',
    password: 'AwY7BxCFt9zrA3viy',
    replication: {
      read: [
        { host: 'prod.cluster-cykdlsurxzfo.us-east-1.rds.amazonaws.com', username: 'KimpTu2NACrCBoar', password: 'AwY7BxCFt9zrA3viy' }
      ],
      write: { host: 'prod.cluster-cykdlsurxzfo.us-east-1.rds.amazonaws.com', username: 'KimpTu2NACrCBoar', password: 'AwY7BxCFt9zrA3viy' }
    }
  }
}

// console.log(process.env)
var env = process.env.ZAPIT_DB
var params_db = config[env]

var machine_test_query = fs.readFileSync(`${__dirname}/queries/machine_tests.sql`, { encoding: 'utf8' })
// var machine_test_query_new = fs.readFileSync(`${__dirname}/queries/machine_tests_new.sql`,{encoding: 'utf8'})
var scratch = fs.readFileSync(`${__dirname}/queries/scratch.sql`, { encoding: 'utf8' })
var scratch2 = fs.readFileSync(`${__dirname}/queries/scratch2.sql`, { encoding: 'utf8' })


// console.log('db stuff:')
// console.log(params_db)

global.user_columns = {
  user_created_id: { type: Sequelize.INTEGER, allowNull: false },
  user_updated_id: { type: Sequelize.INTEGER, allowNull: false },
  user_deleted_id: { type: Sequelize.INTEGER, allowNull: true }
}

const doRelationships = model => {
  // console.log('model:')
  // console.log(model)
  _.each(model, (m, name) => {
    if (name === 'File') {
      return
    }
    _.each(m.rawAttributes, (val, key) => {
      if (key === 'user_created_id') {
        m.belongsTo(model.User, { as: 'user_created', foreignKey: 'user_created_id', sourceKey: 'id' })
      }
      if (key === 'user_updated_id') {
        m.belongsTo(model.User, { as: 'user_updated', foreignKey: 'user_updated_id', sourceKey: 'id' })
      }
      if (key === 'user_updated_id') {
        m.belongsTo(model.User, { as: 'user_deleted', foreignKey: 'user_deleted_id', sourceKey: 'id' })
      }
    })
  })

  model.AnalyzeAgent.belongsTo(model.Org, { as: 'org', foreignKey: 'org_id', sourceKey: 'id' })
  model.AnalyzeAgent.hasMany(model.AnalyzeUpload, { foreignKey: 'agent_id', sourceKey: 'id' })
  model.AnalyzeField.belongsTo(model.MachineType, { as: 'machine_type' })
  model.AnalyzeResultData.belongsTo(model.AnalyzeUploadFile, { foreignKey: 'id', sourceKey: 'upload_file_id' })
  model.AnalyzeLog.belongsTo(model.AnalyzeUpload, { as: 'upload' })
  model.AnalyzeLog.belongsTo(model.AnalyzeUploadFile, { as: 'upload_file' })
  model.AnalyzeResultData.belongsTo(model.AnalyzeField, { as: 'field', foreignKey: 'analyze_field_id', sourceKey: 'id' })
  model.AnalyzeUpload.hasMany(model.AnalyzeLog, { as: 'logs', foreignKey: 'upload_id', sourceKey: 'id' })
  model.AnalyzeUpload.hasMany(model.AnalyzeUploadFile, { as: 'files', foreignKey: 'upload_id', sourceKey: 'id' })
  model.AnalyzeUpload.belongsTo(model.AnalyzeAgent, { as: 'agent', foreignKey: 'agent_id', sourceKey: 'id' })
  model.AnalyzeUpload.belongsTo(model.Machine, { as: 'machine', foreignKey: 'machine_id', sourceKey: 'id' })
  model.AnalyzeUploadFile.belongsTo(model.Machine, { as: 'machine', foreignKey: 'machine_id', sourceKey: 'id' })
  model.AnalyzeUpload.hasMany(model.TestRun, { as: 'test_runs', foreignKey: 'analyze_upload_id', sourceKey: 'id' })
  model.AnalyzeUploadFile.hasMany(model.AnalyzeResultData, { as: 'data', foreignKey: 'upload_file_id', sourceKey: 'id' })
  model.AnalyzeUploadFile.hasMany(model.AnalyzeLog, { as: 'logs', foreignKey: 'upload_file_id', sourceKey: 'id' })
  // model.Ack.belongsTo(model.Procedure,{as: 'procedure'})

  model.AuditUpdate.belongsTo(model.User, { as: 'user_created', foreignKey: 'user_id', sourceKey: 'id' })
  model.Facility.belongsTo(model.Org, { as: 'org', foreignKey: 'org_id', targetKey: 'id' })
  model.Facility.hasMany(model.Machine, { foreignKey: 'facility_id', sourceKey: 'id' })
  model.Facility.hasMany(model.FacilityUser, { foreignKey: 'facility_id', sourceKey: 'id', as: 'facility_users' })
  model.FacilityUser.Facility = model.FacilityUser.belongsTo(model.Facility, { as: 'facility' })
  model.FacilityUser.User = model.FacilityUser.belongsTo(model.User, { as: 'user' })
  model.FacilityUser.belongsTo(model.OrgPermissionGroup, { as: 'group', foreignKey: 'group_id', sourceKey: 'id' })
  model.FacilityUser.hasMany(model.FacilityUserPermission, { foreignKey: 'facility_user_id', sourceKey: 'id', as: 'machine_type_permissions' })
  model.FacilityUserPermission.belongsTo(model.FacilityUser, { as: 'facility_user' })
  model.FacilityUserPermission.belongsTo(model.MachineType, { as: 'machine_type' })
  model.Facility.belongsToMany(model.User, { through: model.FacilityUser })
  model.GraphSeries.hasMany(model.GraphLine, { as: 'lines', foreignKey: 'series_id', sourceKey: 'id' })
  model.Machine.hasMany(model.AnalyzeUpload, { foreignKey: 'machine_id', sourceKey: 'id' })
  model.Machine.belongsTo(model.Facility, { as: 'facility', foreignKey: 'facility_id', sourceKey: 'id' })
  model.Machine.belongsTo(model.MachineType, { as: 'machine_type' })
  model.Machine.belongsTo(model.IonChamber, { as: 'chamber', foreignKey: 'chamber_id', sourceKey: 'id' })
  model.Machine.hasMany(model.MachineTestOrder, { as: 'test_order', foreignKey: 'machine_id', sourceKey: 'id' })
  model.Machine.hasMany(model.MachineLog, { as: 'logs', foreignKey: 'machine_id', sourceKey: 'id' })
  model.Machine.hasMany(model.ScheduleItem, { as: 'schedule_items', foreignKey: 'machine_id', sourceKey: 'id' })
  model.MachineLog.belongsTo(model.Machine, { as: 'machine', foreignKey: 'machine_id', sourceKey: 'id' })
  model.MachineLog.belongsTo(model.MachineLogStatus, { as: 'status', foreignKey: 'status_id', sourceKey: 'id' })
  model.MachineLog.belongsTo(model.MachineLogCategory, { as: 'category', foreignKey: 'category_id', sourceKey: 'id' })
  model.MachineLog.hasMany(model.MachineLogScheduleItem, { as: 'schedule_items', foreignKey: 'machine_log_id', sourceKey: 'id' })
  model.MachineLog.hasMany(model.MachineLogFile, { foreignKey: 'machine_log_id', sourceKey: 'id', as: 'files' })
  model.MachineLog.hasMany(model.MachineLogNote, { foreignKey: 'machine_log_id', sourceKey: 'id', as: 'notes' })
  model.MachineLog.belongsTo(model.User, { as: 'user_created_3', foreignKey: 'user_created_id', sourceKey: 'id' })
  model.MachineLog.belongsTo(model.User, { as: 'user_updated_3', foreignKey: 'user_updated_id', sourceKey: 'id' })
  model.MachineLogFile.belongsTo(model.MachineLog, { as: 'machine_log' })
  model.MachineLogFile.belongsTo(model.File, { as: 'file' })
  model.MachineLogNote.belongsTo(model.MachineLog, { as: 'machine_log' })
  model.MachineLogNote.belongsTo(model.Note, { as: 'note' })
  model.MachineLogScheduleItem.belongsTo(model.MachineLog, { as: 'machine_log' })
  model.MachineLogScheduleItem.belongsTo(model.ScheduleItem, { as: 'schedule_item' })
  model.MachineTestSetup.belongsTo(model.Machine, { as: 'machine' })
  model.MachineTestSetup.belongsTo(model.Frequency, { as: 'frequency_rec', foreignKey: 'frequency', targetKey: 'val' })
  model.MachineTestSetup.hasMany(model.MachineTestSetupField, { as: 'data', foreignKey: 'setup_id', sourceKey: 'id' })
  model.MachineTestSetup.belongsTo(model.Procedure, { as: 'procedure', foreignKey: 'procedure_id', sourceKey: 'id' })
  model.MachineTestSetup.belongsTo(model.TestVersion, { as: 'test_version' })
  model.MachineTestSetupField.belongsTo(model.MachineTestSetup, { as: 'setup', foreignKey: 'setup_id', sourceKey: 'id' })
  model.MachineTestSetupField.belongsTo(model.TestField, { as: 'test_field', foreignKey: 'test_field_id', sourceKey: 'id' })
  model.Note.belongsTo(model.User, { as: 'user_created_2', foreignKey: 'user_created_id', sourceKey: 'id' })

  model.Notification.hasMany(model.NotificationFilter, { as: 'filters', foreignKey: 'notification_id', sourceKey: 'id' })
  model.Notification.hasMany(model.NotificationField, { as: 'fields', foreignKey: 'notification_id', sourceKey: 'id' })
  model.Notification.hasMany(model.UserNotification, { as: 'user_notifications', foreignKey: 'notification_id', sourceKey: 'id' })

  model.NotificationFilter.belongsTo(model.Notification, { as: 'notification', foreignKey: 'notification_id', sourceKey: 'id' })
  model.NotificationField.belongsTo(model.Notification, { as: 'notification', foreignKey: 'notification_id', sourceKey: 'id' })
  // model.Notification.belongsTo(model.UserNotification,{as: 'notification_4', foreignKey: 'notification_id', sourceKey: 'id'})

  model.File.belongsTo(model.User, { as: 'user_created_2', foreignKey: 'user_created_id', sourceKey: 'id' })
  model.Org.hasMany(model.Facility, { as: 'facilities', foreignKey: 'org_id', sourceKey: 'id' })
  model.Org.hasMany(model.OrgPermissionGroup, { as: 'permission_groups', foreignKey: 'org_id', sourceKey: 'id' })
  model.Org.hasMany(model.OrgField, { as: 'org_field', foreignKey: 'org_id', sourceKey: 'id' })
  model.OrgFile.belongsTo(model.Org, { as: 'org' })
  model.OrgFile.belongsTo(model.File, { as: 'file', foreignKey: 'org_id', sourceKey: 'id' })
  model.OrgPermissionGroup.belongsTo(model.Org, { as: 'org' })
  model.OrgPermissionGroup.hasMany(model.FacilityUser, { as: 'facility_users', foreignKey: 'group_id', sourceKey: 'id' })
  model.Procedure.belongsTo(model.Org, { as: 'org' })
  model.Procedure.belongsTo(model.Test, { as: 'test' })
  model.Procedure.belongsTo(model.User, { as: 'procedure_user_updated', foreignKey: 'user_updated_id', sourceKey: 'id' })
  model.Procedure.hasMany(model.MachineTestSetup, { as: 'setups', foreignKey: 'procedure_id', sourceKey: 'id' })
  model.ReportSetting.hasMany(model.UserNotification, { as: 'notifications', foreignKey: 'report_id', sourceKey: 'id' })
  model.ScheduleItem.belongsTo(model.Machine, { as: 'machine' })
  model.ScheduleItem.hasMany(model.MachineLogScheduleItem, { as: 'machine_log_schedule_item', foreignKey: 'schedule_item_id', sourceKey: 'id' })
  model.SetupSubtest.belongsTo(model.SubtestValue, { as: 'subtest_value', foreignKey: 'subtest_value_id', sourceKey: 'id' })
  model.SubtestValue.Set = model.SubtestValue.belongsTo(model.SubtestValueSet, { as: 'set' })
  model.TestVersion.belongsTo(model.Test, { as: 'test' })
  model.TestVersion.belongsTo(model.TestVersion, { as: 'parent' })
  model.TestField.belongsTo(model.TestVersion, { as: 'test_version' })
  model.Test.hasMany(model.TestVersion, { as: 'versions', foreignKey: 'test_id', sourceKey: 'id' })
  model.Test.hasMany(model.GraphSeries, { as: 'graphs', foreignKey: 'test_id', sourceKey: 'id' })
  model.Test.belongsTo(model.MachineType, { as: 'machine_type', foreignKey: 'machine_type_id', sourceKey: 'id' })
  model.TestFieldActive.belongsTo(model.TestField, { as: 'affected_field' })
  model.TestFieldActive.belongsTo(model.TestField, { as: 'criteria_field' })
  model.TestField.hasMany(model.TestFieldActive, { as: 'test_field_active', foreignKey: 'affected_field_id', sourceKey: 'id' })
  model.TestField.hasMany(model.TestFieldComboValue, { as: 'combo_values', foreignKey: 'test_field_id', sourceKey: 'id' })
  model.TestReadyGroup.hasMany(model.TestReadyItem, { as: 'items', foreignKey: 'test_ready_group_id', sourceKey: 'id' })
  model.TestVersion.hasMany(model.TestField, { as: 'test_fields', foreignKey: 'test_version_id', sourceKey: 'id' })
  model.TestVersion.hasMany(model.TestReadyGroup, { as: 'test_ready_groups', foreignKey: 'test_version_id', sourceKey: 'id' })
  model.TestVersion.belongsTo(model.SubtestValue, { as: 'subtest_value', foreignKey: 'subtest_value_id', sourceKey: 'id' })
  model.TestRun.belongsTo(model.Machine, { as: 'machine', foreignKey: 'machine_id', sourceKey: 'id' })
  model.TestRun.belongsTo(model.DateRange, { foreignKey: 'test_date', constraints: false })
  model.TestRun.belongsTo(model.TestVersion, { as: 'test_version' })
  model.TestRun.belongsTo(model.User, { as: 'approve_user' })
  model.TestRun.belongsTo(model.User, { as: 'signoff_user' })
  model.TestRun.belongsTo(model.User, { as: 'reject_user' })
  model.TestRun.belongsTo(model.User, { as: 'performed_by_user', foreignKey: 'user_created_id', sourceKey: 'id' })
  model.TestRun.belongsTo(model.MachineTestSetup, { as: 'setup', foreignKey: 'setup_id', sourceKey: 'id' })
  model.TestRun.hasMany(model.TestRunField, { as: 'test_run_data', foreignKey: 'test_run_id', sourceKey: 'id' })
  model.TestRun.belongsTo(model.AnalyzeUpload)
  model.TestRun.hasMany(model.TestRunNote, { as: 'notes', foreignKey: 'test_run_id', sourceKey: 'id' })
  model.TestRun.hasMany(model.TestRunFile, { as: 'files', foreignKey: 'test_run_id', sourceKey: 'id' })
  model.TestRunField.belongsTo(model.TestRun, { as: 'test_run' })
  model.TestRunField.belongsTo(model.TestField, { as: 'field' })
  model.TestRunFile.belongsTo(model.TestRun, { as: 'test_run', foreignKey: 'test_run_id', sourceKey: 'id' })
  model.TestRunFile.belongsTo(model.File, { as: 'file', foreignKey: 'file_id', sourceKey: 'id' })
  model.TestRunNote.belongsTo(model.TestRun, { as: 'test_run', foreignKey: 'test_run_id', sourceKey: 'id' })
  model.TestRunNote.belongsTo(model.Note, { as: 'note', foreignKey: 'note_id', sourceKey: 'id' })
  model.User.hasMany(model.FacilityUser, { as: 'facility_users', foreignKey: 'user_id', sourceKey: 'id' })
  model.User.hasMany(model.UserPurchase, { as: 'purchases', foreignKey: 'user_id', sourceKey: 'id' })
  model.User.belongsToMany(model.Facility, { through: model.FacilityUser })
  model.User.belongsTo(model.File, { as: 'avatar_file', foreignKey: 'avatar_file_id', sourceKey: 'id', constraints: false, allowNull: true })
  // model.User.hasMany(model.Ack,{as: 'acks', foreignKey: 'user_created_id', sourceKey: 'id'})
  model.User.hasMany(model.UserNotification, { as: 'notifications', foreignKey: 'user_id', sourceKey: 'id' })
  model.User.hasMany(model.UserNotificationItem, { as: 'notification_items', foreignKey: 'user_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.User, { as: 'user', foreignKey: 'user_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.Notification, { as: 'notification', foreignKey: 'notification_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.Org, { as: 'org', foreignKey: 'org_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.Facility, { as: 'facility', foreignKey: 'facility_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.Machine, { as: 'machine', foreignKey: 'machine_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.NotificationType, { as: 'notification_type', foreignKey: 'notification_type_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.NotificationTime, { as: 'notification_time', foreignKey: 'notification_time_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.ReportSetting, { as: 'report', foreignKey: 'report_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.MachineLogCategory, { as: 'machinelog_category', foreignKey: 'machinelog_category_id', sourceKey: 'id' })
  model.UserNotification.belongsTo(model.Frequency, { as: 'frequency', foreignKey: 'delivery_frequency_id', sourceKey: 'id' })
  model.UserPurchase.belongsTo(model.User, { as: 'user', foreignKey: 'user_id', sourceKey: 'id' })
  model.Zap2ItAnswer.belongsTo(model.Zap2ItQuestion, { as: 'question' })
  model.Zap2ItAnswer.belongsTo(model.User, { as: 'user' })
  model.Zap2ItAnswer.hasMany(model.Zap2ItVote, { as: 'votes', foreignKey: 'answer_id', sourceKey: 'id' })
  model.Zap2ItQuestion.belongsTo(model.User, { as: 'user' })
  model.Zap2ItQuestion.hasMany(model.Zap2ItAnswer, { as: 'answers', foreignKey: 'question_id', sourceKey: 'id' })
  model.Zap2ItVote.belongsTo(model.Zap2ItAnswer, { as: 'answer' })
  model.Zap2ItVote.belongsTo(model.User, { as: 'user' })

  return model
}


const init = setup_params => {
  console.log('setup params:')
  console.log(setup_params)
  // console.log(params_db.replication)
  const sequelize = new Sequelize(setup_params.db || params_db.db, params_db.username, params_db.password, {
    logging: false,
    replication: setup_params ? setup_params.replication : (params_db.replication || null),
    host: setup_params ? setup_params.host : (params_db.host || 'localhost'),
    dialect: 'mysql',
    benchmark: true,
    define: {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // charset: 'utf8',
      // collate: 'utf8_general_ci',

      //turn off foreign key constraints to build mock db
      constraints: (setup_params && setup_params.db) ? !setup_params.db.includes('test_') : true
    },
    dialectOptions: {
      connectTimeout: 30000
    },
    pool: {
      max: 20,
      min: 1,
      acquire: 60000,
      idle: 10000
    },
  })

  var files = glob.sync(__dirname + '/models/*.js')
  files = _.compact(_.map(files, f => {
    // console.log(f)
    return [path.basename(f).replace('.js', ''), sequelize.import(f)]
  }))

  // console.log(files)

  var model = _.object(files)
  model = doRelationships(model)

  return {
    sequelize: sequelize,
    model: model,
    queries: {
      machine_test: machine_test_query,
      // machine_test_new: machine_test_query_new,
      scratch: scratch,
      scratch2: scratch2
    }
  }
}


module.exports = params => {
  if (process.env.ZAPIT_IGNORE_DB) {
    return {}
  }

  return init(params_db);
}
