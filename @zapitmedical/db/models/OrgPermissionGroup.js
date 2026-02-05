const checkUnique = (rec) => {
  return db.model.OrgPermissionGroup.count({
    where: {id: {[Op.ne]: rec.attributes ? rec.attributes.id : rec.id}, name: rec.name || rec.attributes.name, org_id: rec.org_id || rec.attributes.org_id, deleted_at: null}
  }).then(cnt => {
    if(cnt){
      return Promise.reject('NOT_UNIQUE')
    } else {
      return Promise.resolve(rec)
    }
  })
}

module.exports = (sequelize, DataTypes) => {
  var OrgPermissionGroup = sequelize.define('org_permission_group', Object.assign({},{
    id:                                     { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:                                 { type: DataTypes.STRING,  allowNull: true },
    org_id:                                 { type: DataTypes.INTEGER, allowNull: false },
    name:                                   { type: DataTypes.STRING,  allowNull: false, audit: true },
    machinelog_create:                      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    machinelog_edit_status:                 { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    machinelog_edit_category:               { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    machinelog_edit_downtime:               { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    machinelog_delete_note_file:            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    machinelog_delete:                      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    schedule_create:                        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    schedule_edit:                          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    schedule_delete:                        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    admin_assign_users:                     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    admin_edit_procedures:                  { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    admin_edit_tests:                       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    admin_manage_machines:                  { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    daily_perform:                          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    daily_edit:                             { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    daily_signoff:                          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    daily_approve:                          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    monthly_perform:                        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    monthly_edit:                           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    monthly_signoff:                        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    monthly_approve:                        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    quarterly_perform:                      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    quarterly_edit:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    quarterly_signoff:                      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    quarterly_approve:                      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    weekly_perform:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    weekly_edit:                            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    weekly_signoff:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    weekly_approve:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    yearly_perform:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    yearly_edit:                            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    yearly_signoff:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    yearly_approve:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    org_admin_equipment_fields:             { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    org_admin_view_hidden_fields:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    org_admin_manage_permission_groups:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    org_admin_manage_password_settings:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    org_admin_manage_auto_logout:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true }
  },user_columns)
  ,{
    indexes: [
      {fields: ['org_id']}
    ]
  })

  OrgPermissionGroup.addHook('beforeCreate','beforeCreate', checkUnique)
  OrgPermissionGroup.addHook('beforeBulkUpdate','beforeBulkUpdate', checkUnique)

  return OrgPermissionGroup
}
