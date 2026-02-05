module.exports = (sequelize, DataTypes) => {
  var Notification = sequelize.define('user_notification', Object.assign({},{
    id:                           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    active:                       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 1},
    user_id:                      { type: DataTypes.INTEGER, allowNull: false },
    notification_id:              { type: DataTypes.INTEGER, allowNull: true },

    org_id:                       { type: DataTypes.INTEGER, allowNull: true },
    facility_id:                  { type: DataTypes.INTEGER, allowNull: true },
    machine_id:                   { type: DataTypes.INTEGER, allowNull: true },

    // entity:                       { type: DataTypes.ENUM(
    //                                   'testrun',
    //                                   'testrun_note_file',
    //                                   'machinelog',
    //                                   'machinelog_note_file',
    //                                   'testrun_due',
    //                                   'test_due',
    //                                   'test_overdue',
    //                                   'zap2it_question',
    //                                   'zap2it_answer'
    //                                 ), allowNull: false},

    machine_type_id:              { type: DataTypes.INTEGER, allowNull: true },
    action:                       { type: DataTypes.ENUM('created','edited','deleted'), allowNull: true},
    machinelog_category_id:       { type: DataTypes.INTEGER, allowNull: true },

    testrun_status_filter:        { type: DataTypes.INTEGER, allowNull: true },
    // testrun_edited_filter:        { type: DataTypes.STRING, allowNull: true },

    delivery_frequency_id:        { type: DataTypes.INTEGER, allowNull: true },
    notification_time_id:         { type: DataTypes.INTEGER, allowNull: true },
    notification_day_of_week:     { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
    notification_day_of_month:    { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
    days_prior:                   { type: DataTypes.INTEGER, allowNull: true },

    email:                        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    mobile:                       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    report_id:                    { type: DataTypes.INTEGER, allowNull: true },
    report_format_id:             { type: DataTypes.INTEGER, allowNull: true }
  },user_columns),{
    indexes: [
      {fields: ['user_id']}
    ]
  })

  Notification.prototype.label = function(){
    var self = this
    if (this.notification_id) {
      return Promise.props({
        categories: db.model.MachineLogCategory.findAll(),
        notification: db.model.Notification.findByPk(this.notification_id)
      })
      .then(hash => {
        return hash.notification.email_subject +
          (self.testrun_status_filter ? (': ' + this.testrun_status_filter) : '') +
          (self.machinelog_category_id ? (': ' + _.findWhere(hash.categories,{id: this.machinelog_category_id}).label) : '')
      })
    }
    else {
      return Promise.resolve('Report notification')
    }
  }

  Notification.prototype.subject = function(){
    return 'subject'
    // var self = this
    // return entity_label[self.entity] +
    //   (self.action ? (' '  + action_label[self.action].toLowerCase()) : '') +
    //   (self.machinelog_category_id ? (': ' + machinelog_category_label[self.machinelog_category_id]) : '') +
    //   (self.testrun_created_filter ? (': ' + testrun_created_filter_label[self.testrun_created_filter]) : '') +
    //   (self.testrun_edited_filter ? (': ' + testrun_edited_filter_label[self.testrun_edited_filter]) : '')
  }

  return Notification
}
