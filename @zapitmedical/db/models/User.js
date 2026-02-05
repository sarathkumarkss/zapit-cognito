var Promise = require('bluebird')
var aws = require('aws-sdk')
var lambda = new aws.Lambda({region: 'us-east-1'})

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user',{
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    email:                { type: DataTypes.STRING, allowNull: false,  unique: 'email'},
    avatar_file_id:       { type: DataTypes.INTEGER, allowNull: true },
    firstname:            { type: DataTypes.STRING, allowNull: true, audit: true },
    lastname:             { type: DataTypes.STRING, allowNull: true, audit: true },
    phone_number:         { type: DataTypes.STRING, allowNull: true, audit: true },
    phone_extension:      { type: DataTypes.STRING, allowNull: true, audit: true },
    testcom_user:         { type: DataTypes.STRING, allowNull: true, audit: true },
    testcom_password:     { type: DataTypes.STRING, allowNull: true, audit: true },

    user_created_id:      { type: DataTypes.INTEGER, allowNull: true },
    user_updated_id:      { type: DataTypes.INTEGER, allowNull: true },
    user_deleted_id:      { type: DataTypes.INTEGER, allowNull: true }
  },{
    indexes: [
      {fields: ['email']}
    ]
  })

  User.addHook('afterCreate','afterCreate',(user, options) => {
    // console.log('afterCreate')
    return Promise.all([
      lambda.invoke({
        FunctionName: 'TestCom',
        InvocationType: 'Event',
        Payload:      JSON.stringify({
          method:   'addUser',
          login:    user.testcom_user,
          password: user.testcom_password,
          email:    user.email,
          name:     (user.firstname && user.lastname) ? (user.firstname + ' ' + user.lastname) : user.email
        })
      })
      .promise()
      .catch(e => {
        // console.log(e)
      })
    ])
  })

  User.get = email => {
    return User.findOne({where: {email: email}})
  }

  User.prototype.initials = function(){
    return (this.firstname ? this.firstname.charAt(0) : '') + (this.lastname ? this.lastname.charAt(0) : '')
  }

  User.prototype.name = function() {
    return (this.firstname && this.lastname) ? (this.firstname + ' ' + this.lastname) : this.email
  }

  // User.prototype.enabledFacilityMachineTypes = function(){
  //   return db.model.FacilityUser.findAll({
  //     where: {user_id: this.id},
  //     include: [{association: 'machine_type_permissions'}]
  //   })
  //   .then(arr => {
  //     return _.flatten(_.map(arr,i => {
  //       return _.map(i.machine_type_permissions,t => {
  //         return {
  //           facility_id: i.facility_id,
  //           machine_type_id: t.machine_type_id
  //         }
  //       })
  //     }),1)
  //   })
  // }

  User.prototype.canAdminEquipmentFields = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canAdminEquipmentFields',self.id,i.org_id),'can_admin_equipment_fields']]
      })
    })
    .then(vals => {
      var tf = _.map(vals,i => {return i.get('can_admin_equipment_fields')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canAdminPasswordSettings = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canAdminPasswordSettings',self.id,i.org_id),'can_admin_password_settings']]
      })
    })
    .then(vals => {
      var tf = _.map(vals,i => {return i.get('can_admin_password_settings')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canAdminAutoLogout = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canAdminAutoLogout',self.id,i.org_id),'can_admin_auto_logout']]
      })
    })
    .then(vals => {
      var tf = _.map(vals,i => {return i.get('can_admin_auto_logout')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canAdminSettings = function(hash){
    var self = this
    console.log(hash)
    return Promise.props({
      password: self.canAdminPasswordSettings(hash),
      logout: self.canAdminAutoLogout(hash),
    })
    .then(hash => {
      return _.contains(_.values(hash),true)
    }).catch(e => console.log(e))
  }

  User.prototype.canDoTestAction = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canDoTestAction', self.id, i.facility_id, i.machine_type, i.frequency, i.action),'can_do_test_action']]
      })
    },{concurrency: 1})
    .then(vals => {
      var tf = _.map(vals,i => {return i.get('can_do_test_action')})
      return _.contains(tf,0) ? false : true
    })
  }

  User.prototype.canAdminGroups = function(hash){
    var self = this
    console.log('CAN ADMIN GROUPS:')
    console.log(hash)
    if (hash.data && hash.data.length === 0) {
      return Promise.resolve(false)
    }

    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canAdminGroups',self.id,i.org_id),'can_admin_groups']]
      })
    })
    .then(vals => {
      var tf = _.map(vals,i => {return i.get('can_admin_groups')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canAdminMachineType = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canAdminMachineType',self.id, i.facility_id),'can_admin_machine_type']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_admin_machine_type')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canAdminUsers = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[
          (i.facility_id ? sequelize.fn('canAdminUsers',self.id,i.facility_id,null) : sequelize.fn('canAdminUsers',self.id,null,i.org_id))
          ,'can_admin_users']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_admin_users')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canAdminProcedures = function(hash){
    return User.findOne({
      attributes: [[sequelize.fn('canAdminProcedures',this.id,hash.org_id),'can_admin_procedures']]
    })
    .then(out => {
      return out.get('can_admin_procedures') ? true : false
    })
  }

  User.prototype.canCreateSchedule = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canCreateSchedule',self.id,hash.facility_id),'can_create_schedule']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_create_schedule')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canEditSchedule = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canEditSchedule',self.id,hash.facility_id),'can_edit_schedule']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_edit_schedule')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canDeleteSchedule = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canDeleteSchedule',self.id,i.facility_id, i.machine_type),'can_delete_schedule']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_delete_schedule')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canCreateMachineLog = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canCreateMachineLog',self.id,hash.facility_id),'can_create_machine_log']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_create_machine_log')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canEditMachineLogCategory = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canEditMachineLogCategory',self.id,i.facility_id, i.machine_type),'can_edit_machine_log_category']]
      })
    })
    .then(arr => {
      console.log('ARR:')
      console.log(arr)
      var tf = _.map(arr,i => {return i.get('can_edit_machine_log_category')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canDeleteMachineLog = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canDeleteMachineLog',self.id,hash.facility_id, hash.machine_type),'can_delete_machine_log']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_delete_machine_log')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canDeleteMachineLogNoteFile = function(hash){
    return User.findOne({
      attributes: [[sequelize.fn('canDeleteMachineLogFilesNotes',this.id,hash.facility_id, hash.machine_type),'can_delete_machine_log_note_file']]
    })
    .then(out => {
      return out.get('can_delete_machine_log_note_file') ? true : false
    })
  }

  User.prototype.canEditMachineLogDowntime = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canEditMachineLogDowntime',this.id,hash.facility_id, hash.machine_type),'can_edit_machine_log_downtime']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_edit_machine_log_downtime')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canEditMachineLogStatus = function(hash){
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canEditMachineLogStatus',this.id,hash.facility_id, hash.machine_type),'can_edit_machine_log_status']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_edit_machine_log_status')})
      return _.contains(tf,1) ? true : false
    })
  }

  User.prototype.canAdminTest = function(hash){
    var self = this
    return Promise.map(hash.data || [hash],i => {
      return User.findOne({
        attributes: [[sequelize.fn('canAdminTest',self.id,hash.facility_id),'can_admin_test']]
      })
    })
    .then(arr => {
      var tf = _.map(arr,i => {return i.get('can_admin_test')})
      return _.contains(tf,1) ? true : false
    })
  }
  return User
}
