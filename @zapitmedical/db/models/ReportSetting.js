module.exports = (sequelize, DataTypes) => {
  return sequelize.define('report_setting', Object.assign({},{
    id:                           { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    user_id:                      { type: DataTypes.INTEGER, allowNull: true },
    report_type_id:               { type: DataTypes.INTEGER, allowNull: false },
    title:                        { type: DataTypes.STRING, allowNull: false },
    org_id:                       { type: DataTypes.INTEGER, allowNull: true },
    facility_id:                  { type: DataTypes.INTEGER, allowNull: true },
    machine_id:                   { type: DataTypes.INTEGER, allowNull: true },
    machine_type_id:              { type: DataTypes.INTEGER, allowNull: true },
    time:                         { type: DataTypes.STRING, allowNull: true },
    start_date:                   { type: DataTypes.DATE, allowNull: true },
    end_date:                     { type: DataTypes.DATE, allowNull: true },
    include_weekends:             { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    ignore_no_data:               { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    report_template_id:           { type: DataTypes.INTEGER, allowNull: true },
    frequency:                    { type: DataTypes.INTEGER, allowNull: true },

    qc_approved:                  { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_notapproved:               { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_signedoff:                { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_notsignedoff:                { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_status_pass:               { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_status_fail:               { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_status_not_performed:      { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_excluded:                  { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_notexcluded:                  { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_resolved:                  { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    qc_notresolved:                  { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },

    equipment_log_status_id:      { type: DataTypes.INTEGER, allowNull: true, defaultValue: false },
    equipment_log_category_id:    { type: DataTypes.INTEGER, allowNull: true, defaultValue: false },
    equipment_log_search:         { type: DataTypes.TEXT, allowNull: true },

    schedule_title:               { type: DataTypes.TEXT, allowNull: true },
    schedule_active:              { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    schedule_due:                 { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },

    equipment_active:             { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    equipment_not_active:         { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    institution_name:             { type: DataTypes.STRING, allowNull: true },
    downtime_include_inactive:    { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },

    fields_setup:                 { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    fields_input:                 { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
    fields_calc:                  { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },

    change_record_type:           { type: DataTypes.TEXT, allowNull: true },
    change_action:                { type: DataTypes.TEXT, allowNull: true }

  },user_columns),{underscored: true})
}
