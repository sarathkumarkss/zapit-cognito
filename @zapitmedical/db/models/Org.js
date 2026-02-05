const Op = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Org = sequelize.define('org', Object.assign({},{
    id:                             { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    active:                         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 1},
    name:                           { type: DataTypes.STRING, allowNull: false, audit: true },
    address1:                       { type: DataTypes.STRING, allowNull: true, audit: true },
    address2:                       { type: DataTypes.STRING, allowNull: true, audit: true },
    city:                           { type: DataTypes.STRING, allowNull: true, audit: true },
    state:                          { type: DataTypes.STRING, allowNull: true, audit: true },
    zip:                            { type: DataTypes.STRING, allowNull: true, audit: true },
    country:                        { type: DataTypes.STRING, allowNull: true, audit: true },
    machine_count_limit:            { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10000 },
    password_expiration_period:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    user_logout_period:             { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },user_columns))

  //assumes all machines in hash.rows come from same org
  Org.prototype.getInactiveFields = function() {
    return db.model.OrgField.findAll({where: {org_id: this.id, available: 0}})
    .then(arr => {
      return _.pluck(arr,'field_name')
    })
  }

  Org.prototype.machine_counts = function(){
    return db.model.Org.findByPk(this.id,{
      attributes: {
        include: [[db.sequelize.fn('COUNT','facilities->machines.id'), 'machine_count']]
      },
      include: [
        {association: 'facilities', attributes: [], include: [
          {association: 'machines', attributes: [], where: {active: 1}, include: [
            {association: 'machine_type', where: {is_device: 1}}]}]}],
      group: ['org.id']
    })
    .then(rec => {
      return {active: rec.get('machine_count'), limit: rec.machine_count_limit}
    })
  }

  Org.addHook('afterUpdate', 'afterUpdate', (rec, options, fn) => {
    if (_.contains(options.fields,'active') && rec.active === false) {
      return db.model.OrgPermissionGroup.findOne({where: {org_id: rec.id, name: 'Reviewer'}})
      .then(group => {
        if (!group) {
          console.log('no reviewer group')
          return Promise.resolve()
        }
        else {
          return db.model.Org.findByPk(rec.id,{
            include: [{
              association: 'facilities',
              include: [
                {association: 'machines'},
                {association: 'facility_users'}
              ]}]
          })
          .then(org => {
            var facility_users = _.flatten(_.map(org.facilities,f => {return f.facility_users}),true)
            var machines = _.flatten(_.map(org.facilities,f => {return f.machines}),true)

            var facility_user_ids = _.pluck(facility_users,'id')
            var machine_ids = _.pluck(machines,'id')
            var facility_ids = _.pluck(org.facilities,'id')

            return Promise.all([
              db.model.FacilityUser.update({group_id: group.id},{where: {id: {[Op.in]: facility_user_ids}}}),
              db.model.Machine.update({active: 0},{where: {id: {[Op.in]: machine_ids}}}),
              org.update({machine_count_limit: 0}),
              db.model.UserNotification.update({active: 0},{where: {org_id: org.id}}),
              db.model.UserNotification.update({active: 0},{where: {facility_id: {[Op.in]: facility_ids}}}),
              db.model.UserNotification.update({active: 0},{where: {machine_id: {[Op.in]: machine_ids}}})
            ])
          })
        }
      })
    }
  })

  return Org
}
