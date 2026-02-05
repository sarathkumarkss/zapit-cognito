const SendEmail = require('@zapitmedical/send_email')
const Op = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var FacilityUser = sequelize.define('facility_user', {
    id:                               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    user_id:                          { type: DataTypes.INTEGER, allowNull: false },
    facility_id:                      { type: DataTypes.INTEGER, allowNull: false },
    group_id:                         { type: DataTypes.INTEGER, allowNull: false }
  },{
    indexes: [
      {fields: ['user_id']},
      {fields: ['facility_id']},
      {fields: ['group_id']},
      {fields: ['facility_id','user_id'], unique: true}
    ]
  })

  // FacilityUser.addHook('beforeBulkDestroy','beforeBulkDestroy',(rec, options) => {
  //   console.log('BEFORE BULK DESTROY')
  // })

  FacilityUser.addHook('afterDestroy', 'afterDestroy', (rec, options) => {
    // var Op = db.sequelize.Op
    //get all machines for facility
    return db.model.Machine.findAll({where: {facility_id: rec.facility_id}, attributes: ['id']})
    .then(machines => {
      var machine_ids = _.pluck(machines,'id')
      return db.model.ReportSetting.update({facility_id: null, machine_id: null},
        {where: {[Op.and]: [
          {user_id: rec.user_id},
          {[Op.or]: [
            {facility_id: rec.facility_id},
            {machine_id: {[Op.in]: machine_ids}}
          ]}
        ]}
      })
    })
  })

//facilityId below: https://github.com/sequelize/sequelize/issues/11225
  FacilityUser.addHook('afterBulkCreate','afterBulkCreate',(arr, options) => {
    console.log('AFTER BULK CREATE:')
    console.log(arr)
    console.log(arr[0].facility_id || arr[0].facilityId)
    return Promise.props({
      user: db.model.User.findByPk(arr[0].user_id || arr[0].userId),
      organization_name: db.model.Facility.findByPk(arr[0].facility_id || arr[0].facilityId).then(facility => {
        return db.model.Org.findByPk(facility.org_id).then(org => {
          return org.name
        })
      }),
      facility_names: Promise.map(arr,i => {
        return db.model.Facility.findByPk(i.facility_id || i.facilityId).then(f => {
          return f.name
        })
      })
    })
    .then(hash => {
      return SendEmail.send({
        subject: 'You\'ve been added to a ZapIT! facility',
        template: 'new_user',
        organization_name: hash.organization_name,
        facility_names: hash.facility_names,
        to: hash.user.email
      })
    })
  })

  return FacilityUser
}
