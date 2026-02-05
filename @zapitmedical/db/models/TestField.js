module.exports = (sequelize, DataTypes) => {
  return sequelize.define('test_field', {
    id:                   { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    is_active:            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    test_version_id:      { type: DataTypes.INTEGER, allowNull: false},
    type:                 { type: DataTypes.ENUM('org_param', 'input', 'calc', 'pass_fail_calc'), allowNull: false },
    label:                { type: DataTypes.STRING, allowNull: true},
    post_run_label:       { type: DataTypes.STRING, allowNull: true },
    eval_label:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    name:                 { type: DataTypes.STRING, allowNull: false},
    units:                { type: DataTypes.STRING, allowNull: true},
    eval_units:           { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    default_value:        { type: DataTypes.STRING, allowNull: true },
    active_if_old:        { type: DataTypes.STRING, allowNull: true },
    xtype:                { type: DataTypes.ENUM('checkbox','radio','combo','displayfield','textfield','ordered_list','numberfield'), allowNull: true},
    formula:              { type: DataTypes.TEXT, allowNull: true},
    optional:             { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    parent_test_only:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    analyze_path:         { type: DataTypes.STRING, allowNull: true },
    group_label:          { type: DataTypes.STRING, allowNull: true },
    orderby:              { type: DataTypes.INTEGER, allowNull: true }
  },{
    indexes: [
      {fields: ['test_version_id']},
      {fields: ['type']},
      {fields: ['name']}
  ]})
}
