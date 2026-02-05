module.exports = (sequelize, DataTypes) => {
  return sequelize.define('analyze_agent', {
    id:                       { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    current_version:          { type: DataTypes.STRING, allowNull: true },
    free_disk_space_bytes:    { type: DataTypes.STRING, allowNull: true },
    host_name:                { type: DataTypes.STRING, allowNull: true },
    installed_ram_bytes:      { type: DataTypes.STRING, allowNull: true },
    ip_addresses:             { type: DataTypes.STRING, allowNull: true },
    license_key:              { type: DataTypes.STRING, allowNull: true },
    machine_name:             { type: DataTypes.STRING, allowNull: true },
    operating_system_name:    { type: DataTypes.STRING, allowNull: true },
    user_domain_name:         { type: DataTypes.STRING, allowNull: true },
    opex_machine_id:          { type: DataTypes.STRING, allowNull: true },
    last_heartbeat:           { type: DataTypes.DATE,   allowNull: true },
    org_id:                   { type: DataTypes.INTEGER, allowNull: true }
  })
}
