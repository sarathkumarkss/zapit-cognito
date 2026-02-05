// rethinkdb --directory /var/lib/rethinkdb/default/data
const fixtures = require('sequelize-fixtures')
const Types = require('Types')
const _ = require('underscore')
var r = require('rethinkdbdash')({
  timeoutGb: 60000,
  max: 250,
  db: 'zapit',
  servers: [{host: 'localhost', port: 28015}]
})
var util = require('util')
var fs = require('fs')
const doAudit = require('./audit')

global.db = require('db')()
var Promise = require('bluebird')
var moment = require('moment-timezone')

var atc_class = require('AbstractTestCollection')
var getData = require('AbstractTestGetSerialized')
var data = getData('/work/zapit/xml')
var atc = new atc_class(data[0],data[1])
var timing = {}
var lookups = {test_order: {}, users: {}, orgs: {}, groups: {}, machines: {}, tests: {}, test_paths: {}, test_fields: {}, facility_ids: {}, files: {}, machine_types: {}, procedures: {}, schedule_items: {}}


//remove all hooks?
_.each(db.model,(model, name) => {
  if (name !== 'Machine') {
    var hooks = _.keys(model.options.hooks)
    _.each(hooks,h => {
      // console.log(name + ' - removing ' + h)
      model.removeHook(h,h)
    })
  }
})

// var machine_ids = ['26']

// var machine_ids = ["0253a4e7-23a0-42a8-a6f4-d66b6269d34d","116df3bc-9966-4fde-bc7e-470da6b02c55","187c8565-cdb4-4fb0-a64f-2a2fc04ff313","059118ef-60c2-408c-9251-ae8644a4d6b3","44362b50-bf56-4fdb-b5cf-e57a34d37e87","101","0c2bd82f-d5a5-4dd9-bfb4-c2464f564db6","120","7ab93595-7094-4aed-893b-288d0686d340","8cc10ae5-bfce-4d80-9889-f9c85a0796ac","8512dfe4-9458-4333-b161-4dd1985a71d9","5c2a5460-67c0-4b6d-8c54-93650eff7464","745b1382-d13d-4a2c-89f9-563a9b7482ef","8422e660-2979-4269-bb2a-28209f1a36f9","8","8a2fdd8f-d0fc-4580-aeac-d86c23198104","bb5a102c-8754-4b11-80d5-40f40616beaf","L2f7UtlhfgsssvpDrtKoiHOpYg7kVI8a","a7c632d2-476b-4634-a0d8-7b2398ac84ac","ab0ab57d-edea-47fc-b131-da50d50dcf68","e0d4c237-7d8c-48d6-b74b-fa3051387073","c235b118-7c6c-4217-b363-78c95f42ee35","a129ebc3-a4e0-4199-8693-a356ae2b6a33","a1b09df3-2fb1-4b19-8225-93680b69037f","18","1a5fb5c0-4110-489c-ab66-5100f53728b9","1c893a74-c364-4a30-b024-df7a9fd1b498","0bcc1d95-288f-4488-a05e-f69d94fe1ee6","28","131015d8-cbf6-4a16-90ef-7fc59d5d09ce","800cbd0b-4941-4e22-9c37-7046744a2379","881f61b9-ba1d-4d6d-a636-ca9905207e3f","670d3bcc-43be-4b6b-b312-909bf1ee2e5a","8624556f-5170-4510-9983-6dcbe8f045e8","1c69b5fb-c7fd-4179-a131-140e84a0b1c5","b7e6992b-325f-497c-8dcb-340e8ee8ed5c","27","a33e2ef9-beec-4419-a189-41c155dd0d28","1e9e0b6a-8176-4b8d-a1ee-8b10493b0008","d5c254e7-7454-4d32-aa23-3637a9e8f543","ae652f93-6c0f-4563-af5b-7b456df65ecd","89","2b21cc2b-3798-41bc-b454-b0a521fa7656","32cf99f2-bc10-470d-bf34-aa04ac61ecb7","2f99dc7e-7c91-40a8-b298-7b80af130c04","29","26","33","39","31","9a4c3b90-1f57-4446-89e3-152d1296e13b","8fb5a581-350c-43b2-b7ba-b36bebff5c41","86","9f1f1b7d-9244-4c45-aa72-6738418eedb0","9ef602c3-ef03-43ee-8605-11db6a305177","eeb23cd0-d42b-469b-aebb-9eaedce236d4","d8dac8e3-cbfa-42fa-8c14-180ee7392788","f686c0de-374e-4043-acb8-37eb42d7fba7","f2b73a5e-c888-441b-acbf-b262377e9ad5","dbQfOkIa8tR6tL2Hsif8CWRZt2FxJgHW","5480e87b-a2e5-4c88-b7ab-a3e64ad6ad59","33ec265b-1063-43c7-a621-75d99da956a7","38","2be905b5-363d-478e-9604-a8e26543b6e7","34","3a8888b0-e6ec-4708-bb68-a81d4f3b3ae3","541d2976-f804-4714-b6b0-5dc044e4e0fc","9cf87b84-ea64-46ed-9b73-3c3c3a62c1ef","9e34a4c0-f1bd-43be-bfdb-284af29ac2dd","4715d947-4977-4415-a917-a50dedfef46a","427f78d3-6340-4d1d-b74c-e924a0c31361","30","525c7464-5f88-468c-b9da-c07f5d866ba6","5952e93e-71ab-4b82-bf89-20ed13fd034f","dd2ade66-5000-4537-b1fc-3e604c7e29e2","f55900ab-676a-4362-9001-456b1e2e6fdd","44996c41-0288-44f7-9be6-501544d4fbd2","ffeb963b-503c-4af1-9f3d-19ecfae05e7e","fd63ed76-dd41-4cdb-99fe-123161241df2","oN59lRmEXcpk5xtIa9o8bYEZ2D3JfzTR"]


// const machine_filter = r.contains(machine_ids,r.row('machine_id'))

const getRandom = () => {
  return Math.floor(Math.random() * Math.floor(1000000))
}

const cleanEmail = email => {
  return email.toLowerCase().replace(/ /g,'')
}

const doLookups = () => {
  return Promise.props({
    machinelog_category: db.model.MachineLogCategory.findAll().then(arr => {
      return _.object(_.map(arr,i => {return [i.name, i.id]}))
    }),
    time_units: db.model.TimeUnits.findAll().then(arr => {
      return _.object(_.map(arr,i => {return [i.name, i.id]}))
    }),
    machinelog_status: db.model.MachineLogStatus.findAll().then(arr => {
      return _.object(_.map(arr,i => {return [i.name, i.id]}))
    })
  })
  .then(hash => {
    // console.log(hash)
    _.each(hash,(val, key) => {
      lookups[key] = val
    })
    // console.log(lookups)
    // process.exit()
    return null
  })
}

const doSubtestValues = () => {
  timing.doSubtestValues = {start: Date.now()}
  return Promise.map(_.keys(data[1]),name => {
    return {
      name: name,
      version: 1
    }
  })
    .then(arr => {
      return db.model.SubtestValueSet.bulkCreate(arr)
    })
    .then(() => {
      return db.model.SubtestValueSet.findAll().then(sets => {
        return Promise.map(sets,set => {
          return Promise.map(data[1][set.name],i => {
            return Object.assign({},i,{set_id: set.id})
          })
        })
      })
    })
    .then(data => {
      data = _.flatten(data)
      return db.model.SubtestValue.bulkCreate(data)
    })
    .then(() => {
      timing.doSubtestValues.end = Date.now()
      return null
    })
}

const doUsers = () => {
  timing.doUsers = {start: Date.now()}
  return r.table('users').orderBy('email').run()
  .then(users => {
    return Promise.map(users,u => {
      u.avatar_file_id = null
      var email = cleanEmail(u.email)
      return _.omit(Object.assign({},u,{email: email}),'id')
    },{concurrency: 1})
  })
  .then(users => {
    // console.log('adding users: ' + users.length)
    // console.log(_.findWhere(users,{email: 'nseiler@zapitmedical.com'}))

    return Promise.map(users,u => {
      if (lookups.users[u.email]) {
        return Promise.resolve()
      }
      else {
        return db.model.User.create(u).then(out => {
          lookups.users[u.email] = out.id
        })
      }
    },{concurrency: 1})

    // return db.model.User.bulkCreate(users,{ignoreDuplicates: true})
  })
  .then(out => {
    // updated created/updated by
    return r.table('users').run().then(arr => {
      return Promise.map(arr,u => {
        return db.model.User.update({
          user_created_id: lookups.users[u.created_by] || null,
          user_updated_id: lookups.users[u.updated_by] || null
        },
        {where: {email: u.email}})
      },{concurrency: 1})
    })
  })
  .then(() => {
    console.log('users ended!')
    timing.doUsers.end = Date.now()
    return null
  })
}

// const doAcks = () => {
//   timing.doAcks = {start: Date.now()}
//   return r.table('acks').run().then(arr => {
//     return Promise.map(arr,i => {
//       return {
//         procedure_id: i.type === 'procedure_changed_confirmation' ? i.item_id : null,
//         announcement_id: i.type === 'announcement' ? i.item_id : null,
//         user_created_id: lookups.users[i.user_email || i.created_by],
//         user_updated_id: lookups.users[i.updated_by || i.user_email]
//       }
//     })
//       .then(arr => {
//         return Promise.map(arr,i => {
//           return db.model.Ack.create(i)
//         },{concurrency: 1})
//       })
//   })
//   .then(() => {
//     timing.doAcks.end = Date.now()
//     return Promise.resolve(null)
//   })
// }

// const doAnnouncement = () => {
//   timing.doAnnouncement = {start: Date.now()}
//   return r.table('announcements').run().then(arr => {
//     return Promise.map(arr,i => {
//       return {
//         user_created_id: lookups.users[i.created_by],
//         user_updated_id: lookups.users[i.updated_by],
//         message: i.message,
//         title: i.title
//       }
//     },{concurrency: 1})
//     .then(arr => {
//       return db.model.Announcement.bulkCreate(arr)
//     })
//   })
//   .then(() => {
//     timing.doAnnouncement.end = Date.now()
//     return null
//   })
// }

const doOrganization = () => {
  timing.doOrganization = {start: Date.now()}
  var columns = [
    'name',
    'address1',
    'address2',
    'city',
    'state',
    'zip',
    'country',
    'machine_count_limit',
    'password_expiration_period',
    'user_logout_period',
    'created_at',
    'updated_at'
  ]

  var fac_columns = [
    'name',
    'address1',
    'address2',
    'city',
    'state',
    'zip',
    'country',
    'state_reg_num',
    'timezone',
    'permissions'
  ]

  return r.table('organizations').run().then(arr => {
    return Promise.map(arr,i => {
      return db.model.Org.create(Object.assign({},_.pick(i,columns),{user_created_id: lookups.users[i.created_by] || lookups.users['nseiler@zapitmedical.com'], user_updated_id: lookups.users[i.updated_by] || lookups.users['nseiler@zapitmedical.com']}))
        .then(org => {
          lookups.orgs[i.id] = org.id
          return Promise.map(_.compact(i.permission_groups),g => {
            var obj = Object.assign({
              org_id: org.id
            },
            _.omit(g,'id','org_id'), {
              old_id: g.id,
              user_created_id: lookups.users['nseiler@zapitmedical.com'],
              user_updated_id: lookups.users['nseiler@zapitmedical.com'],
              // created_at: g.created_at ? g.created_at.replace('Invalid date','NOW()') : 'NOW()',
              // updated_at: g.updated_at ? g.updated_at.replace('Invalid date','NOW()') : 'NOW()'
            })
            if (obj.created_at && (obj.created_at === 'Invalid date' || obj.created_at === '0000-00-00 00:00:00' || obj.created_at === 'c60882c5-08e6-448d-bd58-81a65b3b1f3e')) {
              obj.created_at = db.sequelize.literal('NOW()')
            }
            if (obj.updated_at && (obj.updated_at === 'Invalid date' || obj.updated_at === '0000-00-00 00:00:00' || obj.created_at === 'c60882c5-08e6-448d-bd58-81a65b3b1f3e')) {
              obj.updated_at = db.sequelize.literal('NOW()')
            }

            console.log(obj)
            return db.model.OrgPermissionGroup.create(obj)
          },{concurrency: 1})
            .then(groups => {
              _.each(groups,g => {
                lookups.groups[g.old_id] = g.id
              })

              var facilities = _.map(_.compact(i.facilities),f => {
                return _.omit(Object.assign({old_id: f.id},{org_id: org.id},_.pick(f,fac_columns),{user_created_id: lookups.users[f.created_by || 'nseiler@zapitmedical.com'], user_updated_id: lookups.users[f.updated_by || 'nseiler@zapitmedical.com']}),'id')
              })
              return Promise.map(facilities,f => {
                return db.model.Facility.create(_.omit(Object.assign({},f,{
                  timezone: 'America/New_York',
                  user_updated_id: lookups.users[f.user_update_id] || lookups.users['nseiler@zapitmedical.com'],
                }),'permissions'))
                  .then(rec => {
                    lookups.facility_ids[rec.old_id] = rec.id
                    return Promise.map(_.keys(f.permissions),email => {
                      var group_id = lookups.groups[f.permissions[email].group_id]
                      if (group_id && lookups.users[email]) {
                        var fac_user = Object.assign({},{
                          user_id: lookups.users[email],
                          facility_id: rec.id},
                          {
                            group_id: lookups.groups[f.permissions[email].group_id]
                          })
                        return db.model.FacilityUser.create(fac_user)
                        .then(fac_user => {
                          return Promise.map(_.keys(f.permissions[email]),mt => {
                            if (f.permissions[email][mt] && lookups.machine_types[mt]) {
                              return db.model.FacilityUserPermission.create({
                                facility_user_id: fac_user.id,
                                machine_type_id: lookups.machine_types[mt]
                              })
                            }
                            else {
                              return Promise.resolve()
                            }
                          })
                        })
                      }
                      else if (!lookups.users) {
                        console.log('NOT ADDING USER: ' + email + ' - user does not exist!')
                        return Promise.resolve()
                      }
                      else if (!group_id) {
                        console.log('NOT ADDING GROUP: ' + email + ' - group does not exist')
                        return Promise.resolve()
                      }
                    },{concurrency: 1})
                    // .then(arr => {
                    //   arr = _.compact(arr)
                    //   // console.log(arr)
                    //   return db.model.FacilityUser.bulkCreate(arr)
                    // })
                  })
              },{concurrency: 1})
            })
        })
    },{concurrency: 1})
  })
  .then(() => {
    timing.doOrganization.end = Date.now()
    return null
  })
}

const doFiles = () => {
  timing.doFiles = {start: Date.now()}
  return r.table('files').run().then(arr => {
    var data = _.map(arr,i => {
      var hash = Object.assign({},i,{
        old_id: i.id,
        user_created_id: lookups.users[i.created_by || 'nseiler@zapitmedical.com'],
        user_updated_id: lookups.users[i.created_by || 'nseiler@zapitmedical.com'],
        filename: i.filename || '(blank)',
        size: i.size || 0
      })
      delete hash.id
      return hash
    })

    return db.model.File.bulkCreate(data)
  })
  .then(() => {
    return db.model.File.findAll()
      .then(arr => {
        _.each(arr,i => {
          lookups.files[i.old_id] = i.id
        })
        return null
      })
  })
  .then(() => {
    timing.doFiles.end = Date.now()
    return null
  })
}

const doMachines = () => {
  timing.doMachines = {start: Date.now()}
  return r.table('machines').filter(r.row('facility_id').ne(null),{default: false}).run().then(arr => {
    // arr = _.filter(arr,m => {return _.contains(machine_ids,m.id)})
    return Promise.map(arr,m => {
      if (!lookups.facility_ids[m.facility_id]) {
        console.log('not adding machine: ' + m.name + ' - ' + m.id)
        return null
      }
        if (m.chamber_id === '') {
          delete m.chamber_id
        }
        var hash = Object.assign({},_.omit(m,'calibration_date'),{
          facility_id: lookups.facility_ids[m.facility_id],
          user_created_id: lookups.users[m.created_by || 'nseiler@zapitmedical.com'],
          user_updated_id: lookups.users[m.updated_by || 'nseiler@zapitmedical.com'],
          user_deleted_id: lookups.users[m.deleted_by],
          old_id: m.id,
          machine_type_id: lookups.machine_types[m.type],
          clinical_or_research_use: m.clinical_or_research_use ? m.clinical_or_research_use.toLowerCase().replace('clincial','clinical').replace('climical','clinical') : null
        })
        console.log(hash)
        delete hash.id
        if (!hash.name) {
          hash.name = getRandom().toString()
        }
        hash.name = hash.name.trim()

        return r.table('machines').getAll(m.facility_id,{index: 'facility_id'}).run()
        .then(existing_machines => {
          console.log('current: ' + hash.name)
          var existing = _.map(_.pluck(existing_machines,'name'),i => {return i ? i.toLowerCase().trim() : i})
          var cnt = _.filter(existing,i => {return i === hash.name.toLowerCase().trim()}).length
          console.log(existing)
          console.log(cnt)
          if (cnt > 1) {
            var new_name = hash.name + ' - ' + getRandom().toString()
            console.log('changing name: ' + new_name)
            hash.name = new_name
          }

          hash.test_order = []

          if (m.test_order) {
            var cnt = 0
            var parent_test_cnt = {}
            hash.test_order = _.compact(_.map(m.test_order,path => {
              var parts = path.split('/')
              if (parts.length === 3 && lookups.test_paths[path]) {
                parent_test_cnt[path] = 1
                cnt++
                return {machine_id: m.id, test_id: lookups.test_paths[path], ordinal: cnt}
              }
              else {
                var parent_test_path = '/' + parts[1] + '/' + parts[2]
                lookups.test_order[m.id + '_' + path] = parent_test_cnt[parent_test_path]
                parent_test_cnt[parent_test_path]++
                return null
              }
            }))
          }

          return db.model.Machine.create(hash,{include: [{association: 'test_order'}]})
            .then(m_created => {
              lookups.machines[m_created.old_id] = m_created.id
              return Promise.map(m.logs || [],l => {
                // console.log(l)
                var hash = Object.assign({},l,{
                  title: l.title || '',
                  old_id: l.id,
                  machine_id: m_created.id,
                  date: new Date(l.date),
                  user_created_id: lookups.users[l.created_by] || lookups.users['nseiler@zapitmedical.com'],
                  user_updated_id: lookups.users[l.updated_by] || lookups.users['nseiler@zapitmedical.com'],
                  outage_time: l.outage_time || 0,
                  outage_units_id: lookups.time_units[l.outage_units || 'minutes'] || lookups.machinelog_status['minutes'],
                  category_id: lookups.machinelog_category[l.category] || lookups.machinelog_category.machine_error_fault,
                  status_id: lookups.machinelog_status[l.status] || lookups.machinelog_status['closed']
                })

                // console.log('status: ' + l.status)
                delete hash.id
                return db.model.MachineLog.create(hash)
                  .then(log_created => {
                    return Promise.props({
                      files: Promise.map(l.files || [],f => {
                        if (typeof f !== 'string') {
                          throw new Error('file is not string - ' + f)
                        }
                        else {
                          return db.model.File.findAll({where: {old_id: f}})
                            .then(arr => {
                              //THIS SHOULD THROW SOME ERROR
                              if (arr.length === 0) {
                                return Promise.resolve()
                              }
                              else {
                                var file_id = arr[0].id
                                return db.model.MachineLogFile.create({
                                  file_id: file_id,
                                  machine_log_id: log_created.id,
                                  user_created_id: log_created.user_created_id,
                                  user_updated_id: log_created.user_updated_id
                                })
                              }
                            })
                        }
                      },{concurrency: 1}),
                      notes: Promise.map(l.notes || [],n => {
                        return db.model.Note.create({
                          content: n.content || '',
                          user_created_id: lookups.users[n.created_by] || lookups.users[l.created_by] || lookups.users['nseiler@zapitmedical.com'] || lookups.users[l.updated_by] || lookups.users[n.updated_by],
                          user_updated_id: lookups.users[l.updated_by] || lookups.users[n.updated_by] || lookups.users['nseiler@zapitmedical.com'] || lookups.users[n.created_by] || lookups.users[l.created_by],
                          user_deleted_id: lookups.users[n.deleted_by] || null
                        })
                          .then(note => {
                            return db.model.MachineLogNote.create({
                              note_id: note.id,
                              machine_log_id: log_created.id,
                              user_created_id: note.user_created_id,
                              user_updated_id: note.user_updated_id
                            })
                          })
                      },{concurrency: 1})
                    })
                  })
              },{concurrency: 1})
            })
        })
      },{concurrency: 1})
    },{concurrency: 1})
    .then(() => {
      timing.doMachines.end = Date.now()
      return null
    })
}

const doScheduleItems = () => {
  console.log('do schedule items - start')
  timing.doScheduleItems = {start: Date.now()}
  return r.table('schedule_items').run().then(arr => {
    return Promise.map(arr,i => {
      var machine_id = lookups.machines[i.machine_id]
      if (machine_id) {
        var old_id = i.id
        delete i.id
        return Object.assign({},i,{machine_id: machine_id, old_id: old_id, user_created_id: lookups.users['pete@zapitmedical.com'], user_updated_id: lookups.users['pete@zapitmedical.com']})
      }
      else {
        return null
      }
    },{concurrency: 1})
  })
  .then(arr => {
    return Promise.map(_.compact(arr),i => { return db.model.ScheduleItem.create(i) },{concurrency: 1})
  })
  .then(() => {
    console.log('schedule items end')
    timing.doScheduleItems.end = Date.now()
    return null
  })
}

const doMachineTestSetups = () => {
  console.log('starting machine test setups')
  timing.doMachineTestSetups = {start: Date.now()}
  var field_data_hash = {}
  var ignores = [
    'procedure_id',
    'start_date',
    'alias',
    '_id',
    'frequency'
  ]

  var freq_hash = {}
  _.each(Types.frequency,f => {
    freq_hash[f.id] = f.value
  })

  return getFieldLookup().then(field_lookup_hash => {
    return getMostRecentTestVersionLookup().then(test_version_lookup => {
      return db.model.Test.findAll().then(tests => {
        return db.model.Machine.findAll().then(machines => {
          return doChunks({table: 'machine_field_setups', filter: r.row('machine_id').eq('26').or(r.row('machine_id').eq('a129ebc3-a4e0-4199-8693-a356ae2b6a33')), limit: 1000, cb: arr => {

            // return r.table('machine_field_setups').run().then(arr => {
              // arr = _.filter(arr,i => {
              //   // console.log(i.machine_id)
              //   return _.contains(machine_ids,i.machine_id)
              // })
              return db.model.MachineType.findAll().then(machine_types => {
                var types_lookup = _.object(_.map(machine_types,mt => {
                  return [mt.name, mt.id]
                }))
                return Promise.map(_.compact(arr),i => {
                  var machine = _.findWhere(machines,{old_id: i.machine_id})
                  var parts = i.test_path.split('/')
                  var test = _.findWhere(tests,{machine_type_id: types_lookup[parts[1]]})
                  // console.log(test)

                  var ignore = _.map(ignores,i => {
                    return '/' + parts[1] + '/' + parts[2] + '/' + i
                  })

                  if (typeof machine === 'undefined' || !test || typeof machine.id === 'undefined' || !test_version_lookup[i.test_path]){
                    // console.log(machine)
                    return Promise.resolve()
                  }

                  field_data_hash[i.id] = _.map(_.keys(i.field_data),key => {
                    return (field_lookup_hash[key] && Array.isArray(i.field_data[key]) === false && _.contains(ignore,i) === false) ? {
                      test_field_id:  field_lookup_hash[key],
                      val:            i.field_data[key]
                    } : null
                  })


                  // .field_data[i.test_path + '/procedure_id'] ? (lookups.procedures[i.field_data[i.test_path + '/procedure_id']].organization_id ? lookups.procedures[i.field_data[i.test_path + '/procedure_id']] : null) : null,

                  var procedure_id = (i && i.field_data) ? i.field_data[i.test_path + '/procedure_id'] : null
                  var new_procedure_id = null
                  if (procedure_id) {
                    // console.log(lookups.procedures)
                    // console.log(i)
                    // console.log(procedure_id)
                    // process.exit()
                    new_procedure_id = lookups.procedures[i.field_data[i.test_path + '/procedure_id']]

                    console.log(i)
                    console.log(new_procedure_id)
                    // if (!new_procedure_id || !new_procedure.organization_id) {
                    //   new_procedure_id = null
                    // }
                  }

                  return i.field_data ? {
                    old_id:             i.id,
                    machine_id:         machine.id,
                    test_version_id:    test_version_lookup[i.test_path],
                    alias:              i.field_data[i.test_path + '/alias'] || null,
                    start_date:         i.field_data[i.test_path + '/start_date'] ? moment(new Date(i.field_data[i.test_path + '/start_date'])).toDate() : null,
                    procedure_id:       new_procedure_id || null,
                    frequency:          i.field_data[i.test_path + '/frequency'] ? freq_hash[i.field_data[i.test_path + '/frequency']] : 1,
                    created_at:         i.created_at,
                    updated_at:         i.updated_at,
                    user_created_id:    lookups.users[i.created_by] || lookups.users[i.updated_by] || lookups.users['user@zapitmedical.com'],
                    user_updated_id:    lookups.users[i.created_by] || lookups.users[i.updated_by] || lookups.users['user@zapitmedical.com']
                  } : null
                },{concurrency: 1})
              })
              .then(recs => {
                return db.model.MachineTestSetup.bulkCreate(_.compact(recs))
              })
            // })
          }})
        })
      })
      .then(() => {
        return db.model.MachineTestSetup.findAll().then(arr => {
          return Promise.each(arr,setup_rec => {
            var items = _.map(_.compact(field_data_hash[setup_rec.old_id]),i => {
              return Object.assign({},i,{setup_id: setup_rec.id, val: i.val || ''})
            })

            return Promise.map(items,i => {
              return db.model.MachineTestSetupField.create(i)
            },{concurrency: 1})
          })
        })
      })
    })
  })
  .then(() => {
    console.log('machine test setups - end')
    timing.doMachineTestSetups.end = Date.now()
    return null
  })
}


const getMostRecentTestVersionLookup = () => {
  var hash = {}
  // var elements = test_path.split('/')
  return db.sequelize.query("SELECT test_version.id,CONCAT('/',machine_type.name,'/',test.name,IF(subtest_value.name IS NULL,'',CONCAT('/',subtest_value.name))) AS path FROM test JOIN machine_type ON test.machine_type_id = machine_type.id JOIN test_version ON test.id = test_version.test_id LEFT JOIN subtest_value ON test_version.subtest_value_id = subtest_value.id WHERE test_version.version = 1;",
  { type: db.sequelize.QueryTypes.SELECT})
  .then(arr => {
    _.each(arr,i => {
      hash[i.path] = i.id
    })

    // console.log(hash)
    return hash
  })
}

const getTestLookup = () => {
  return db.sequelize.query(
    "SELECT test_version.id,CONCAT('/',machine_type.name,'/',test.name,IF(subtest_value.name IS NULL,'',CONCAT('/',subtest_value.name))) AS path FROM test JOIN machine_type ON test.machine_type_id = machine_type.idJOIN test_version on test.id = test_version.test_id LEFT JOIN subtest_value ON test_version.subtest_value_id = subtest_value.id WHERE test_version.version = 1;",
    { type: db.sequelize.QueryTypes.SELECT }
  )
  .then(arr => {
    var hash = {}
    _.each(arr,i => {
      hash[i.path] = i.id
    })
    return hash
  })
}

const getFieldLookup = () => {
  return db.sequelize.query(
    "SELECT test_field.id AS id,CONCAT('/',machine_type.name,'/',test.name,'/',IF(subtest_value.name IS NULL,'',CONCAT(subtest_value.name,'/')),test_field.name) AS path FROM test_version JOIN test ON test_version.test_id = test.id JOIN machine_type ON test.machine_type_id = machine_type.id LEFT JOIN subtest_value ON test_version.subtest_value_id = subtest_value.id JOIN test_field ON test_version.id = test_field.test_version_id;",
    { type: db.sequelize.QueryTypes.SELECT }
  )
  .then(arr => {
    var hash = {}
    _.each(arr,i => {
      hash[i.path] = i.id
    })
    return hash
  })
}

const doChunks = config => {
  return r.table(config.table).filter(config.filter || {}).count().run().then(count => {
    console.log('limit: ' + config.limit)
    console.log('count: ' + count)
    var runs = Math.ceil(count / config.limit)
    console.log('runs: ' + runs)
    var arr = new Array(runs)
    return Promise.each(arr,(x, index) => {
      console.log(index)
      console.log('index: ' + index)
      var skip = config.limit * index
      console.log('skip: ' + skip)
      return r.table(config.table).filter(config.filter || {}).skip(skip).limit(config.limit).run().then(config.cb)
    },{concurrency: 1})
  })
}

const doTestRuns = () => {
  timing.doTestRuns = {start: Date.now()}
  return getMostRecentTestVersionLookup().then(test_version_lookup => {
    return getFieldLookup().then(field_lookup_hash => {
      return doChunks({table: 'test_runs', filter: r.row('machine_id').eq('26').or(r.row('machine_id').eq('a129ebc3-a4e0-4199-8693-a356ae2b6a33')), limit: 20000, cb: arr => {
        // arr = _.filter(arr,i => {return _.contains(machine_ids,i.machine_id)})
        return Promise.map(arr,tr => {
          var data = _.map(tr.field_data,(val, key) => {
            if (lookups.test_fields[key] && Array.isArray(val) === false){
              return {
                field_id: lookups.test_fields[key],
                val: val
              }
            }
          })

          return (lookups.machines[tr.machine_id] && test_version_lookup[tr.test_path]) ? {
            old_id:           tr.id,
            test_version_id:  test_version_lookup[tr.test_path],
            machine_id:       lookups.machines[tr.machine_id],
            created_at:       tr.created_at,
            updated_at:       tr.updated_at,
            created_by:       lookups.users[tr.created_by],
            updated_by:       lookups.users[tr.updated_by],
            exclude:          tr.exclude,
            resolved:         tr.resolved,
            approve_date:     tr.approve_date,
            approve_user_id:  lookups.users[tr.approve_user],
            signoff_date:     tr.signoff_date,
            signoff_user_id:  lookups.users[tr.signoff_user],
            reject_date:      tr.reject_date,
            reject_user_id:   lookups.users[tr.reject_user],
            test_date:        tr.test_date || tr.created_at,
            status:           tr.status.replace('incomplete','fail').replace('complete','pass') || 'fail',

            user_created_id:  lookups.users[tr.created_by] || lookups.users[tr.user_id] || lookups.users['nseiler@zapitmedical.com'],
            user_updated_id:  lookups.users[tr.updated_by] || lookups.users[tr.created_by] || lookups.users[tr.user_id] || lookups.users['nseiler@zapitmedical.com'],

            test_run_data:    _.compact(data)
          } : null
        },{concurrency: 1})
        .then(arr => {
          return Promise.map(_.compact(arr),i => {
            var field_data = i.test_run_data
            delete i.test_run_data
            return db.model.TestRun.create(i,{include: [{association: 'test_run_data'}], hooks: false})
            .then(tr => {
              return db.model.TestRunField.bulkCreate(_.map(field_data,f => {return Object.assign({},f,{test_run_id: tr.id})}))
            })
          },{concurrency: 1})
        })
      }})
    })
  })
  .then(() => {
    timing.doTestRuns.end = Date.now()
    return null
  })
}


const andOrArray = (arr, field_lookup, group_id, test_version_id) => {
  return Promise.map(arr,i => {
    // console.log(i)
    var key = _.keys(i)[0]
    if (key === 'or') {
      return db.model.TestReadyGroup.create({
        test_version_id: test_version_id,
        op: 'or'
      })
      .then(group_rec => {
        // console.log(i[key])
        return Promise.map(i[key],x => {
          // console.log('x:')
          // console.log(x)
          return andOrArray(Array.isArray(x) ? x : [x], field_lookup, group_rec.id, test_version_id)
        },{concurrency: 1})
      })
    }
    if (key === 'and') {
      return db.model.TestReadyGroup.create({
        test_version_id: test_version_id,
        op: 'and'
      })
      .then(group_rec => {
        return Promise.map(i[key],x => {
          // console.log('IN AND!')
          // console.log(x)
          // process.exit()
          return andOrArray(Array.isArray(x) ? x : [x], field_lookup, group_rec.id, test_version_id)
        },{concurrency: 1})
      })
    }
    else {
      // console.log('test_version_id:')
      // console.log(test_version_id)
      // console.log('key: ')
      // // var key = _.keys(i)[0]
      // console.log(key)

      return db.model.TestReadyItem.create({
        test_field_id: field_lookup[test_version_id + '_' + key],
        val: i[key],
        test_ready_group_id: group_id
      })
    }
  },{concurrency: 1})
}


// var data = andOrArray([{or: [{field: 'xyz'}, {stuff: 'abc'}]}], {field: 123, stuff: 456})
// console.log(data)


const addTestVersion = (test, test_rec) => {
  // console.log(test_rec)
  // process.exit()
  var prefix = '/' + _.invert(lookups.machine_types)[test_rec.machine_type_id] + '/' + test_rec.name

  var ignore = [
    'alias',
    'frequency',
    'procedure_id',
    'start_date'
  ]
  return db.model.TestVersion.create({
    test_id:            test_rec.id,
    version:            1,
    label:              test.label,
    default_frequency:  test.default_frequency,
    parent_id:          test.parent_id || null,
    subtest_value_id:   test.subtest_value_id || null
  })
    .then(test_version_rec => {
      var field_name_hash = {}

      return Promise.map(test.test_fields,f => {
        if (_.contains(ignore,f.name)) {
          return Promise.resolve()
        }
        return {
          test_version_id:        test_version_rec.id,
          type:                   f.data_type,
          label:                  f.label,
          post_run_label:         f.postRunLabel,
          name:                   f.name,
          units:                  f.units,
          xtype:                  f.xtype === '' ? null : f.xtype,
          formula:                f.formula,
          optional:               f.optional || false,
          parent_test_only:       f.parent_test_only || false,
          analyze_path:           f.analyze_path,
          eval_label:             f.evalLabel || false,
          eval_units:             f.evalUnits || false,
          default_value:          typeof f.default_value === 'undefined' ? null : f.default_value,
          active_if_old:          (f.activeIf && typeof f.activeIf === 'string') ? f.activeIf : null
        }
      })
      .then(arr => {
        return db.model.TestField.bulkCreate(_.compact(arr))
      })
      .then(() => {
        return db.model.TestField.findAll({where: {test_version_id: test_version_rec.id}})
        .then(arr => {
          _.each(arr,i => {
            if (i) {
              field_name_hash[test_version_rec.id + '_' + i.name] = i.id
              lookups.test_fields[prefix + '/' + i.name] = i.id
            }
          })
          return arr
        })
      })
      .then(arr => {
        return Promise.each(test.test_fields,f => {
          return Promise.each((f.activeIf && Array.isArray(f.activeIf)) ? f.activeIf : [],i => {
            return Promise.each(_.keys(i),key => {
              // console.log(field_name_hash)
              // console.log(key)

              var criteria_field_id = test_version_rec.id + '_' + key
              //field could be a parent test
              if (!field_name_hash[criteria_field_id]) {
                return db.model.TestField.findOne({where: {test_version_id: test_version_rec.parent_id, name: key}})
                .then(criteria_field => {
                  if (!criteria_field) {
                    return Promise.resolve()
                  }
                  if (i[key] && typeof i[key] !== 'object') {
                    return db.model.TestFieldActive.create({
                      affected_field_id:            field_name_hash[test_version_rec.id + '_' + f.name],
                      criteria_field_id:            criteria_field.id,
                      val:                          i[key]
                    })
                  }
                  else {
                    return Promise.resolve()
                  }
                })
              }
              else {
                if (i[key] && typeof i[key] !== 'object' && field_name_hash[test_version_rec.id + '_' + key]) {
                  return db.model.TestFieldActive.create({
                    affected_field_id:            field_name_hash[test_version_rec.id + '_' + f.name],
                    criteria_field_id:            field_name_hash[criteria_field_id],
                    val:                          i[key]
                  })
                }
                else {
                  return Promise.resolve()
                }
              }
            })
          })
        })
      })
      .then(() => {
        return Promise.each(test.test_fields,f => {
          // if (f.path === '/linear_accelerator/electronic_wedge/photon_4mv/pf_value') {
          //   // console.log(f)
          //   console.log(f)
          //   process.exit()
          // }

          return Promise.each((f.name !== 'frequency' && f.xtype && (f.xtype === 'radio' || f.xtype === 'combo') && f.store && typeof f.store !== 'string') ? f.store : [],i => {
            return db.model.TestFieldComboValue.create({
              test_field_id: field_name_hash[test_version_rec.id + '_' + f.name],
              label:         i.text,
              value:         i.value
            })
          })
        })
      })
      .then(() => {
        if (test.ready) {
          return andOrArray(test.ready, field_name_hash, null, test_version_rec.id)
        }
        else {
          return Promise.resolve()
        }
      })
      .then(() => {
        return {test: test, test_rec: test_rec, version_rec: test_version_rec}
      })
    })
}

const doGraphs = (test, test_rec) => {
  // console.log(util.inspect(test.graph, false, null, true))
  if (_.keys(test.graph).length > 1) {
    return Promise.map(_.keys(test.graph),series_name => {
      if (series_name === 'testrun_notrun') {
        return Promise.resolve()
      }
      return db.model.GraphSeries.create({test_id: test_rec.id, name: series_name})
      .then(series_rec => {
        return Promise.map(test.graph[series_name],line => {
          return db.model.GraphLine.create({
            series_id: series_rec.id,
            field: line.field,
            type: line.type,
            field_field: line.filter ? line.filter.field : null,
            field_val: line.filter ? line.filter.value : null,
            both: line.both || false,
            negative: line.negative || false
          })
        },{concurrency: 1})
      })
    },{concurrency: 1})
  }
  else {
    return Promise.resolve()
  }
}

const doTests = () => {
  timing.doTests = {start: Date.now()}
  return Promise.map(atc.allParentTests(),t => {
    return {
      machine_type_id:    lookups.machine_types[t.module_type],
      active:             true,
      name:               t.name
    }
  },{concurrency: 1})
  .then(arr => {
    return db.model.Test.bulkCreate(arr)
  })
  .then(() => {
    return db.model.Test.findAll()
  })
  .then(test_recs => {
    return Promise.map(test_recs,rec => {
      var path = '/' + _.invert(lookups.machine_types)[rec.machine_type_id] + '/' + rec.name
      lookups.test_paths[path] = rec.id
      var test = atc.getTestByPath(path)
      return Promise.all([
        addTestVersion(test, rec),
        doGraphs(test, rec)
      ])
    },{concurrency: 1})
  })
  .then(arr => {
    return Promise.map(_.compact(arr),v => {
      v = v[0]
      var t = v.test
      // if (t.path === '/linear_accelerator/electronic_wedge') {
      //   console.log(v)
      //   console.log('subtests: ' + t.subtests.length)
      //   process.exit()
      // }
      if (t.subtests.length > 0) {
        console.log('DOING SUBTESTS!')
        return Promise.map(t.subtests,st => {
          st.parent_id = v.version_rec.id
          return db.model.SubtestValueSet.findOne({where: {name: t.subtests_from}})
          .then(set => {
            return db.model.SubtestValue.findOne({where: {set_id: set.id, name: st.subtest_data.name}})
            .then(subtest_val_rec => {
              st.subtest_value_id = subtest_val_rec.id
              return addTestVersion(st, v.test_rec)
            })
          })
        },{concurrency: 1})
      }
      else {
        return Promise.resolve()
      }
    },{concurrency: 1})
  })
  .then(() => {
    timing.doTests.end = Date.now()
    return null
  })
}

const doProcedures = () => {
  timing.doProcedures = {start: Date.now()}
  return r.table('procedures').run().then(arr => {
    return Promise.map(arr,p => {
      var test_id = lookups.test_paths[p.test_path]

      // if (p.id === '463b9b50-027b-4ef1-948f-a8e7e81a6646') {
      //   console.log(p)
      //   console.log(test_id)
      //   process.exit()
      // }

      if (!test_id) {
        return Promise.resolve(null)
      }

      return db.model.Procedure.create({
        old_id: p.id,
        org_id: p.organization_id ? lookups.orgs[p.organization_id] : null,
        name: p.name || '',
        html: p.html || p.content || '',
        test_id: lookups.test_paths[p.test_path],
        user_created_id: lookups.users[p.created_by] || lookups.users['nseiler@zapitmedical.com'],
        user_updated_id: lookups.users[p.updated_by] || lookups.users['nseiler@zapitmedical.com']
      })
      .then(rec => {
        lookups.procedures[rec.old_id] = rec.id
        return null
      })
    },{concurrency: 1})
  })
  .then(() => {
    // console.log(lookups.procedures['463b9b50-027b-4ef1-948f-a8e7e81a6646'])
    // process.exit()
    timing.doProcedures.end = Date.now()
  })
}

const doZQuestions = () => {
  timing.doZQuestions = {start: Date.now()}
  return r.table('z_questions').run().then(arr => {
    return Promise.map(arr,q => {
      var old_id = q.id
      delete q.id
      var user_id_email = q.user_id
      q.user_id = lookups.users[user_id_email || q.created_by]
      q.created_by = lookups.users[q.created_by || user_id_email]
      q.updated_by = lookups.users[q.updated_by || user_id_email]

      return db.model.Zap2ItQuestion.create(q)
        .then(rec => {
          return Promise.map(q.answers,a => {
            delete a.id
            return db.model.Zap2ItAnswer.create({
              question_id:  rec.id,
              content:      a.content || '',
              user_id:      lookups.users[a.user_id || a.created_by],
              created_at:   a.created_at,
              created_by:   lookups.users[a.user_id || a.created_by],
              updated_at:   a.updated_at,
              updated_by:   lookups.users[a.updated_by || a.user_id]
            })
            .then(answer_rec => {
              return Promise.map(a.votes,v => {
                delete v.id
                return db.model.Zap2ItVote.create({
                  answer_id: answer_rec.id,
                  user_id: lookups.users[v.user_id || v.created_by || v.user_email],
                  score: v.score,
                  created_at: v.created_at,
                  created_by: lookups.users[v.user_id || v.created_by || v.user_email],
                  updated_at: v.created_at,
                  updated_by: lookups.users[v.user_id || v.created_by || v.user_email]
                })
              },{concurrency: 1})
            })
          },{concurrency: 1})
        })
    },{concurrency: 1})
  })
  .then(() => {
    timing.doZQuestions.end = Date.now()
    return null
  })
}

const doMachineTypes = () => {
  return db.model.MachineType.findAll()
  .then(arr => {
    return Promise.map(arr,i => {
      lookups.machine_types[i.name] = i.id
      return null
    })
  })
}

const doMachineScheduleItems = () => {
  return Promise.props({
    schedule_items: db.model.ScheduleItem.findAll({paranoid: false}),
    machine_logs: db.model.MachineLog.findAll({paranoid: false}),
    machines_old: r.table('machines').run()
  })
  .then(hash => {
    var data = _.map(hash.machines_old,m => {
      return _.map(m.logs,l => {
        return _.map(l.schedule_items,s => {
          var schedule_item = _.findWhere(hash.schedule_items,{old_id: s})
          var machine_log_item = _.findWhere(hash.machine_logs,{old_id: l.id})
          if (schedule_item && machine_log_item) {
            var temp = {
              schedule_item_id: schedule_item.id,
              machine_log_id: machine_log_item.id
            }
            return temp
          }
          else {
            return null
          }
        })
      })
    })

    return Promise.resolve()
    // data = _.compact(_.flatten(data))
    // return db.model.MachineLogScheduleItem.bulkCreate(data)
  })
}

db.sequelize.transaction(t => {
  return Promise.resolve()
  .then(doLookups)
  .then(doMachineTypes)
  .then(doSubtestValues)
  .then(doTests)
  .then(doUsers)
  .then(doOrganization)
  .then(doFiles)
  .then(doMachines)
  .then(doScheduleItems)
  .then(doMachineScheduleItems)
  .then(doProcedures)
  .then(doMachineTestSetups)
  // .then(doZQuestions)
  .then(doTestRuns)
  .then(() => {
    return Promise.props({
      mt: db.model.MachineTestSetup.findAll(),
      test_runs: db.model.TestRun.findAll()
    })
    .then(hash => {
      return Promise.map(hash.test_runs,tr => {
        var setups = _.where(hash.mt,{test_version_id: tr.test_version_id, machine_id: tr.machine_id})
        if (setups.length === 0) {
          return Promise.resolve()
        }
        else {
          setups = _.filter(setups,i => {return moment(i.created_at).isBefore(moment(tr.created_at))})
          setups = _.sortBy(setups,i => {return moment(tr.created_at).unix()}).reverse()
          if (setups.length > 0) {
            console.log(setups.length)
            var setup = setups[0]
            return db.model.TestRun.update({setup_id: setup.id},{where: {id: tr.id}})
          }
          else {
            return Promise.resolve()
          }
        }
      },{concurrency: 10})
    })
  })
  .then(() => {
    console.log('TEST ORDER:')
    console.log(lookups.test_order)
    // get most recent machine_test_setup for each test on each machine, save enabled subtests

    var query = 'SELECT mts.id,mts.old_id,mts.machine_id,mts.test_version_id,mts2.maxdate ' +
      'FROM machine_test_setup mts ' +
    'JOIN (' +
      'SELECT machine_id,test_version_id,MAX(created_at) maxdate ' +
      'FROM machine_test_setup ' +
      'GROUP BY machine_id,test_version_id' +
    ') mts2 ' +
    'ON mts.machine_id = mts2.machine_id AND mts.test_version_id = mts2.test_version_id'
    return db.sequelize.query(query,{type: db.sequelize.QueryTypes.SELECT})
    .then(arr => {
      // console.log('query output: ' + arr.length)
      return Promise.map(arr,i => {
        // console.log(i)
        return r.table('machine_field_setups').get(i.old_id).run().then(mts => {
          // console.log(mts)
          var fields = _.keys(mts.field_data)
          return Promise.mapSeries(fields,f => {
            var parts = f.split('/')
            if (f.indexOf('/enabled') !== -1) {
              // console.log(mts.test_path)
              var t = atc.getTestByPath(mts.test_path)
              var subtests_from = t.subtests_from
              return db.model.SubtestValueSet.findOne({where: {name: subtests_from}})
              .then(set => {
                // console.log(parts[3])
                return db.model.SubtestValue.findOne({where: {set_id: set.id, name: parts[3]}})
                .then(subtest_val_rec => {
                  if (mts.machine_id) {
                    return db.model.SetupSubtest.create({
                      machine_id:         lookups.machines[mts.machine_id],
                      subtest_value_id:   subtest_val_rec.id,
                      enabled:            mts.field_data[f],
                      ordinal:            lookups.test_order[mts.machine_id + '_' + f.replace('/enabled','')] || 1
                    })
                  }
                  else {
                    return Promise.resolve()
                  }
                })
              })
            }
            else {
              return Promise.resolve()
            }
          })
        },{concurrency: 1})
      })
    })
  })
  .then(out => {
    _.each(_.keys(timing),k => {
      console.log(k + ' : ' + (timing[k].end - timing[k].start) / 1000)
    })
  })
  .catch(e => {
    console.log('ERROR')
    console.log(e)
    if (e.errors) {
      console.log(e.errors[0].instance)
    }
  })
  .finally(() => {
    r.getPoolMaster().drain()
    db.sequelize.close()
  })
})
