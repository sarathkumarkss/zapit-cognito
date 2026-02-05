var testing = require('@zapitmedical/testing')
var moment = require('moment-timezone')

//2 scenarios
//- 2 subtests enabled, one has never been run
  //- max_test_date should be null
//- 2 subtests enabled, both have been run but one was 3 days ago
  //- max_test_date should be 3 days ago

var data = {
  user:         [{id: 1, email: 'xyz', user_created_id: 1, user_updated_id: 1}],
  org:          [{id: 1, name: 'org', user_created_id: 1, user_updated_id: 1}],
  facility:     [{id: 1, name: 'fac', org_id: 1, user_created_id: 1, user_updated_id: 1}],
  machine_type: [{id: 1, name: 'type', label: 'label'}],
  machine:      [
    {id: 1, machine_type_id: 1, name: 'abc', facility_id: 1, user_created_id: 1, user_updated_id: 1},
    {id: 2, machine_type_id: 1, name: 'abc2', facility_id: 1, user_created_id: 1, user_updated_id: 1},
    {id: 3, machine_type_id: 1, name: 'abc2', facility_id: 1, user_created_id: 1, user_updated_id: 1}
  ],
  test:         [
    {id: 1, name: 'has_subtests_1', machine_type_id: 1, user_created_id: 1, user_updated_id: 1}
  ],
  subtest_value_set: [
    {id: 1, name: 'subtest set', version: 1}
  ],
  subtest_value: [
    {id: 1, set_id: 1, name: 'subtest_value_1', label: 'Subtest value 1'},
    {id: 2, set_id: 1, name: 'subtest_value_2', label: 'Subtest value 2'}
  ],
  setup_subtest: [
    {id: 1, machine_id: 1, subtest_value_id: 1, enabled: 1, ordinal: 1, test_id: 1},
    {id: 2, machine_id: 1, subtest_value_id: 2, enabled: 1, ordinal: 2, test_id: 1},

    {id: 3, machine_id: 2, subtest_value_id: 1, enabled: 1, ordinal: 1, test_id: 1},
    {id: 4, machine_id: 2, subtest_value_id: 2, enabled: 1, ordinal: 2, test_id: 1},

    {id: 5, machine_id: 3, subtest_value_id: 1, enabled: 1, ordinal: 1, test_id: 1},
    {id: 6, machine_id: 3, subtest_value_id: 2, enabled: 1, ordinal: 2, test_id: 1}
  ],
  test_version: [
    {id: 1, test_id: 1, version: 1, name: null, label: 'Has subtests', default_frequency: 'daily', parent_id: null, subtest_value_id: null},
    {id: 2, test_id: 1, version: 1, name: 'subtest name #1', label: 'Subtest #1', default_frequency: 'daily', parent_id: 1, subtest_value_id: 1},
    {id: 3, test_id: 1, version: 1, name: 'subtest name #2', label: 'Subtest #2', default_frequency: 'daily', parent_id: 1, subtest_value_id: 2}
  ],
  procedure: [
    {id: 1, name: 'blerg', test_id: 1, html: 'stuff', user_created_id: 1, user_updated_id: 1}
  ],
  machine_test_setup: [
    {id: 1, test_version_id: 1, machine_id: 1, start_date: '2015-01-01 00:00:00', frequency: 1, procedure_id: 1, user_created_id: 1, user_updated_id: 1},
    {id: 2, test_version_id: 1, machine_id: 2, start_date: '2015-01-01 00:00:00', frequency: 1, procedure_id: 1, user_created_id: 1, user_updated_id: 1},
    {id: 3, test_version_id: 1, machine_id: 3, start_date: '2015-01-01 00:00:00', frequency: 1, procedure_id: 1, user_created_id: 1, user_updated_id: 1}
  ],
  test_run: [
//2 subtests enabled, one never run
    {id: 1, setup_id: 1, machine_id: 1, test_version_id: 2, test_date: moment().add(12,'hours').tz('America/New_York').format('YYYY-MM-DD hh:mm:ss'), status: 'pass', exclude: 0, user_created_id: 1, user_updated_id: 1},

//2 subtests enabled, both run today
    {id: 2, setup_id: 2, machine_id: 2, test_version_id: 2, test_date: moment().add(12,'hours').tz('America/New_York').format('YYYY-MM-DD hh:mm:ss'), status: 'pass', exclude: 0, user_created_id: 1, user_updated_id: 1},
    {id: 3, setup_id: 2, machine_id: 2, test_version_id: 3, test_date: moment().add(12,'hours').tz('America/New_York').format('YYYY-MM-DD hh:mm:ss'), status: 'pass', exclude: 0, user_created_id: 1, user_updated_id: 1},

//2 subtests enabled, one run today, the other run 3 days ago
    {id: 4, setup_id: 3, machine_id: 3, test_version_id: 2, test_date: moment().add(12,'hours').tz('America/New_York').format('YYYY-MM-DD hh:mm:ss'), status: 'pass', exclude: 0, user_created_id: 1, user_updated_id: 1},
    {id: 5, setup_id: 3, machine_id: 3, test_version_id: 3, test_date: moment().subtract(3,'days').tz('America/New_York').format('YYYY-MM-DD hh:mm:ss'), status: 'pass', exclude: 0, user_created_id: 1, user_updated_id: 1}
  ]
}

// console.log(testing.importTestData)
global.db = testing.importTestData(data)


describe('results generated',function(){
  it('get results', () => {
    expect.assertions(5)
    return db.sequelize.query(db.queries.machine_test,{
      replacements: {
        user_id:          1,
        org_id:           0,
        facility_id:      1,
        machine_id:       0,
        all_machines:     0,
        now:              moment().tz('America/New_York').startOf('day').unix(),
        special_user:     1,
        machine_type_id:  null
      },
      type: db.sequelize.QueryTypes.SELECT
    })
    .catch(e => {
      console.log(e)
    })
    .then((results, meta) => {
      console.log(results)
      expect(_.findWhere(results,{id: '1_1'}).max_test_date).toBe(null)
      expect(_.findWhere(results,{id: '1_1'}).is_timely).toBe(1)
      expect(moment(_.findWhere(results,{id: '2_1'}).max_test_date).format('YYYY-MM-DD')).toBe(moment().format('YYYY-MM-DD'))
      expect(_.findWhere(results,{id: '2_1'}).is_timely).toBe(0)
      expect(_.findWhere(results,{id: '3_1'}).is_timely).toBe(1)
    })
  })
})
