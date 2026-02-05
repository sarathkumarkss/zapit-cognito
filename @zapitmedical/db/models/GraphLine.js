var Op = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var GraphLine = sequelize.define('graph_line',{
    id:                         { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    series_id:                  { type: DataTypes.INTEGER, allowNull: false },
    field:                      { type: DataTypes.STRING, allowNull: false },
    type:                       { type: DataTypes.STRING, allowNull: false },
    filter_field:               { type: DataTypes.STRING, allowNull: true },
    filter_val:                 { type: DataTypes.STRING, allowNull: true },
    both:                       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    negative:                   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },{
    indexes: [
      {fields: ['series_id']}
    ]
  })

  function filterTestRuns(arr, self){
    return _.compact(_.map(arr,tr => {
      var toret = true
      if (self.filter_field !== null) {
        toret = false
        _.each(tr.test_run_data,i => {
          console.log(self.filter_field + ' - ' + i.field.name + ' - ' + self.filter_val + ' - ' + i.val)
          if (self.filter_field == i.field.name && self.filter_val == i.val) {
            // console.log('MATCH!')
            toret = true
          }
        })

        if (toret === false) {
          _.each(tr.setup.data,i => {
            if (self.filter_field !== 'helical_axial_current_is' && self.filter_field == i.test_field.name && self.filter_val == i.val) {
              console.log(`${self.filter_field} : ${i.test_field.name} - ${self.filter_val} : ${i.val}`)
              console.log('MATCHED LATER!')
              toret = true
            }
          })
        }
      }

      return toret ? tr : null
    }))
  }

  GraphLine.prototype.getData = function(start, end, test_version_id, test_runs) {
    var self = this

    console.log('IN GETDATA')
    console.log(self.type)

    if (self.type === 'data') {

      return Promise.resolve(_.compact(_.map(filterTestRuns(test_runs, self),tr => {
        // console.log(self.field)
        var result_field = _.find(tr.test_run_data,i => {return i.field.name === self.field})
        // console.log(result_field)
        if (result_field) {
          return {
            test_run_id: tr.id,
            test_run_field_id: result_field.id,
            date: tr.test_date,
            value: parseFloat(result_field.val),
            has_files_notes: tr.files.length > 0 || tr.notes.length > 0,
            status: tr.status
          }
        }
        else {
          return null
        }
      })))
    }
    else if (self.type === 'community') {
      // console.log('GETTING COMMUNITY')
      return db.model.TestField.findOne({where: {test_version_id: test_version_id, name: self.field}})
      .then(test_field => {
        return db.model.TestRunCommunity.findAll({where: [
          {field_id: test_field.id},
          {test_run_date: {[Op.gt]: db.sequelize.fn('FROM_UNIXTIME',start)}},
          {test_run_date: {[Op.lt]: db.sequelize.fn('FROM_UNIXTIME',end)}}
        ]})
        .then(arr => {
          var stuff = _.map(arr,i => {
            return {
              date: i.test_run_date,
              value: parseFloat(i.val)
            }
          })

          return Promise.resolve(stuff)
        })
      })
    }
    else if (self.type === 'passfail') {
      return Promise.resolve(_.compact(_.map(filterTestRuns(test_runs,self),tr => {
        // console.log('TR:')
        // console.log(tr)
        // console.log(tr.setup)
        var val = null
        if (tr.setup && tr.setup.data) {
          console.log(`FIELD: ${self.field}`)
          var data = _.find(tr.setup.data,i => {console.log(i.test_field.name); return i.test_field.name === self.field && i.test_field.test_version_id === tr.test_version_id})
          console.log('SETUP DATA:')
          console.log(data)
          console.log(self.field)
          if (data && data.val) {
            val = data.val
            return {
              test_run_id: tr.id,
              date: tr.test_date,
              value: self.negative ? (0 - parseFloat(val)) : parseFloat(val),
              has_files_note: false
            }
          }
          else {
            return null
          }
        }
      })))
    }
  }

  return GraphLine
}
