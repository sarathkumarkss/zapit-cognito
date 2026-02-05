const Op = require('sequelize').Op
const moment = require('moment-timezone')

function checkFailures(arr) {
  if (arr.length < 3) {
    return false
  }

  var top = _.pluck(arr.slice(0,3),'status')

  if (_.contains(top,'pass') === false) {
    return true
  }

  var start = moment().subtract(7,'days')
  console.log('START: ' + start)
  var recent = _.filter(arr,i => {return moment(i.test_date).isAfter(start)})
  console.log('RECENT: ' + recent.length)
  var statuses = _.pluck(recent,'status')
  var counts = _.countBy(statuses)
  console.log(counts)
  if (counts.fail >= 3) {
    return true
  }

  return false
}

const checkAllOrderRecs = (machine, options) => {
  return db.model.Test.findAll({
    where: {machine_type_id: machine.machine_type_id},
    order: [['name']]
  })
  .then(tests => {
    return db.model.MachineTestOrder.max('ordinal',{where: {machine_id: machine.id}})
    .then(max => {
      return Promise.mapSeries(tests,(t, index) => {
        var start = (max || 0) + 1
        return db.model.MachineTestOrder.findOrCreate({where: {machine_id: machine.id, test_id: t.id}, defaults: {ordinal: start + index}})
      },{concurrency: 1})
    })
  })
}

const checkUnique = (rec) => {
  return db.model.Machine.count({
    where: {id: {[Op.ne]: rec.id}, name: rec.name, facility_id: rec.facility_id, deleted_at: null}
  }).then(cnt => {
    if(cnt){
      return Promise.reject('NOT_UNIQUE')
    }
    else {
      return Promise.resolve(rec)
    }
  })
}

const checkMachineLimit = (rec) => {
  return db.model.Facility.findByPk(rec.facility_id)
  .then(fac => {
    return db.model.Org.findByPk(fac.org_id)
  })
  .then(org => {
    return db.model.Facility.findAll({where: {org_id: org.id}})
    .then(facs => {
      var ids = _.pluck(facs,'id')
      return db.model.Machine.count({
        where: {facility_id: {[Op.in]: ids}, active: 1},
        include: [{association: 'machine_type', where: {is_device: 1}}]
      })
    })
    .then(cnt => {
      return db.model.MachineType.findByPk(rec.machine_type_id)
      .then(machine_type_rec => {
        if (rec.active && machine_type_rec.is_device == 1 && cnt >= org.machine_count_limit) {
          return Promise.reject('OVER_MACHINE_COUNT_LIMIT')
        }
        else {
          return Promise.resolve(rec)
        }
      })
    })
  })
}

module.exports = (sequelize, DataTypes) => {
  var Machine = sequelize.define('machine', Object.assign({},{
    id:                                     { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    old_id:                                 { type: DataTypes.STRING, allowNull: true },
    facility_id:                            { type: DataTypes.INTEGER, allowNull: false },
    name:                                   { type: DataTypes.STRING, allowNull: false, audit: true },
    active:                                 { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, audit: true },
    mobile:                                 { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, audit: true },
    machine_type_id:                        { type: DataTypes.INTEGER, allowNull: false, audit: true },
    serial_number:                          { type: DataTypes.STRING, allowNull: true, audit: true },
    manufacturer:                           { type: DataTypes.STRING, allowNull: true, audit: true },
    model:                                  { type: DataTypes.STRING, allowNull: true, audit: true },
    tube_serial_number:                     { type: DataTypes.STRING, allowNull: true, audit: true },
    state_reg_num:                          { type: DataTypes.STRING, allowNull: true, audit: true },
    facility_id_number:                     { type: DataTypes.STRING, allowNull: true, audit: true },
    building_location:                      { type: DataTypes.STRING, allowNull: true, audit: true },
    room_location:                          { type: DataTypes.STRING, allowNull: true, audit: true },
    station_id:                             { type: DataTypes.STRING, allowNull: true, audit: true },
    manufacturer_system_id:                 { type: DataTypes.STRING, allowNull: true, audit: true },
    generator_serial_number:                { type: DataTypes.STRING, allowNull: true, audit: true },
    serial_number_other:                    { type: DataTypes.STRING, allowNull: true, audit: true },
    serial_number_other_description:        { type: DataTypes.STRING, allowNull: true, audit: true },
    control_serial_number:                  { type: DataTypes.STRING, allowNull: true, audit: true },
    physics_id_number:                      { type: DataTypes.STRING, allowNull: true, audit: true },
    manufacture_date:                       { type: DataTypes.DATE, allowNull: true, audit: true },
    install_date:                           { type: DataTypes.DATE, allowNull: true, audit: true },
    ip_address:                             { type: DataTypes.STRING, allowNull: true, audit: true },
    ae_title:                               { type: DataTypes.STRING, allowNull: true, audit: true },
    port:                                   { type: DataTypes.STRING, allowNull: true, audit: true },
    cost_center:                            { type: DataTypes.STRING, allowNull: true, audit: true },
    department_name:                        { type: DataTypes.STRING, allowNull: true, audit: true },
    department_section:                     { type: DataTypes.STRING, allowNull: true, audit: true },
    department_code:                        { type: DataTypes.STRING, allowNull: true, audit: true },
    con_info:                               { type: DataTypes.STRING, allowNull: true, audit: true },
    cer_number:                             { type: DataTypes.STRING, allowNull: true, audit: true },
    asset_number:                           { type: DataTypes.STRING, allowNull: true, audit: true },
    clinical_or_research_use:               { type: DataTypes.ENUM('clinical','research'), allowNull: true, audit: true },
    initial_equipment_cost:                 { type: DataTypes.STRING, allowNull: true, audit: true },
    annual_service_cost:                    { type: DataTypes.STRING, allowNull: true, audit: true },
    service_contract_expiration_date:       { type: DataTypes.DATE, allowNull: true, audit: true },
    warranty_expiration_date:               { type: DataTypes.DATE, allowNull: true, audit: true },
    manufacturer_support_number:            { type: DataTypes.STRING, allowNull: true, audit: true },
    area_contact_name:                      { type: DataTypes.STRING, allowNull: true, audit: true },
    area_contact_phone:                     { type: DataTypes.STRING, allowNull: true, audit: true },
    area_contact_email:                     { type: DataTypes.STRING, allowNull: true, audit: true },
    manager_contact_name:                   { type: DataTypes.STRING, allowNull: true, audit: true },
    manager_contact_phone:                  { type: DataTypes.STRING, allowNull: true, audit: true },
    manager_contact_email:                  { type: DataTypes.STRING, allowNull: true, audit: true },
    engineer_contact_name:                  { type: DataTypes.STRING, allowNull: true, audit: true },
    engineer_contact_phone:                 { type: DataTypes.STRING, allowNull: true, audit: true },
    engineer_contact_email:                 { type: DataTypes.STRING, allowNull: true, audit: true },
    physicist_contact_name:                 { type: DataTypes.STRING, allowNull: true, audit: true },
    physicist_contact_phone:                { type: DataTypes.STRING, allowNull: true, audit: true },
    physicist_contact_email:                { type: DataTypes.STRING, allowNull: true, audit: true },
    service_provider_name:                  { type: DataTypes.STRING, allowNull: true, audit: true },
    magnet_strength:                        { type: DataTypes.STRING, allowNull: true, audit: true },
    pelec:                                  { type: DataTypes.STRING, allowNull: true, audit: true },
    chamber_id:                             { type: DataTypes.INTEGER, allowNull: true, audit: true },
    ndw60co:                                { type: DataTypes.STRING, allowNull: true, audit: true },
    manual_kecal:                           { type: DataTypes.STRING, allowNull: true, audit: true },

    calibration_date:                       { type: DataTypes.DATE, allowNull: true, audit: true},
    calibration_expiration_period:          { type: DataTypes.INTEGER, allowNull: true, audit: true, defaultValue: 24 }
  },user_columns)
  ,{
    engine: 'MYISAM',
    indexes: [
      {fields: ['old_id']},
      {fields: ['facility_id']},
      {fields: ['machine_type_id']}
    ]
  }
)

Machine.addHook('afterCreate','afterCreate',checkAllOrderRecs)
Machine.addHook('afterUpdate','afterUpdate',checkAllOrderRecs)

//assumes all machines in hash.rows come from same org
Machine.hideFields = function(hash) {
  if (hash.rows.length > 0) {
    return db.model.Facility.findByPk(hash.rows[0].facility_id)
    .then(fac => {
      return db.model.Org.findByPk(fac.org_id).then(org => {
        return org.getInactiveFields()
        .then(fields => {
          hash.rows = _.each(hash.rows,r => {
            _.each(fields,f => {
              r.setDataValue(f,null)
            })
          })
          return Object.assign({},hash,{hidden_fields: fields})
        })
      })
    })
  }
  else {
    return Promise.resolve()
  }
}

Machine.prototype.getMostRecentSetup = function(test_name) {
  return db.model.MachineTestSetup.findAll({
    subQuery: false,
    where: {
      machine_id: this.id,
    },
    include: [
      {separate: true, association: 'data', include: [{association: 'test_field'}]},
      {association: 'test_version', include: [{association: 'test', where: {name: test_name}}]}
    ],
    order: [['created_at','DESC']],
    limit: 1
  })
}

//has there been a failure for noise_and_uniformity or noise_and_uniformity_additional - 3 or more in a row or 3 or more over last 7 days
//true = warn, false = no warn
Machine.prototype.checkNUFailures = function() {
  var self = this

  //get setups for both tests
  return Promise.props({
    nu: self.getMostRecentSetup('noise_and_uniformity'),
    nu_additional: self.getMostRecentSetup('noise_and_uniformity_additional')
  })
  .then(hash => {
    var doCheck = false

    console.log(_.object(_.map(hash.nu[0].data,i => {return [i.test_field.name, i.val]})))

    var nu_setup = _.object(_.map(hash.nu[0].data,i => {return [i.test_field.name, i.val]}))
    var nu_setup_additional = _.object(_.map(hash.nu_additional[0].data,i => {return [i.test_field.name, i.val]}))

    if (
      (hash.nu.length > 0 && (typeof nu_setup.do_show_warning === 'undefined' || nu_setup.do_show_warning == 1)) ||
      (hash.nu_additional.length > 0 && (typeof nu_setup_additional.do_show_warning === 'undefined' || nu_setup.do_show_warning == 1))
    ) {
      doCheck = true
    }

    console.log('DO CHECK: ' + doCheck)
    // process.exit()

    if (doCheck) {
      return Promise.props({
        nu: db.model.TestRun.findAll({
          useMaster: true,
          attributes: ['id','test_date','status'],
          where: {machine_id: this.id, exclude: 0},
          order: [['test_date','DESC']],
          include: [
            {association: 'test_version', required: true, include: [{association: 'test', required: true, where: {name: 'noise_and_uniformity'}}]}]})
            .then(checkFailures),

            nu_additional: db.model.TestRun.findAll({
              useMaster: true,
              attributes: ['id','test_date','status'],
              where: {machine_id: this.id, exclude: 0},
              order: [['test_date','DESC']],
              include: [{association: 'test_version', required: true, include: [{association: 'test', required: true, where: {name: 'noise_and_uniformity_additional'}}]}]})
              .then(checkFailures)
            })
            .then(hash => {
              return _.contains(_.values(hash),true)
            })
          }
          else {
            return false
          }
        })
      }

      Machine.addHook('beforeCreate', 'beforeCreate', (rec, options) => {
        return Promise.all([checkUnique(rec), checkMachineLimit(rec)])
      })

      Machine.addHook('beforeUpdate','beforeUpdate', (rec, options) => {
        return db.model.Machine.findByPk(rec.id).then(resp => {
          return resp.active ? checkUnique(rec) :
          Promise.all([checkUnique(rec), checkMachineLimit(rec)])
        })
      })

      return Machine
    }
