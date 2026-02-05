const Promise = require('bluebird')
var db = require('db')()
const glob = require('glob')
const YAML = require('yamljs')
const fs = require('fs')
const exec = require('child_process').exec
const doAudit = require('./audit')


const loadFixtures = () => {
  // var files = glob.sync('/work/zapit/zapit/report/db/models/fixtures.yml')
  var files = glob.sync('/work/zapit/zapit/**/fixtures.yml')
  files = _.sortBy(files,f => {
    return f.indexOf('/machine/') !== -1 ? 1 : 2
  })
  return Promise.map(files,f => {
    return YAML.load(f)
  })
  .then(arr => {
    return Promise.each(arr,i => {
      return Promise.each(i.fixtures,set => {
        console.log(set.model)
        return db.model[set.model].bulkCreate(set.data)
      })
    })
  })
}

const loadCustomFunctions = () => {
  console.log('here')
  var files = glob.sync('/work/zapit/zapit/**/db/functions/*.sql')
  return Promise.map(files,f => {
    return new Promise((res, rej) => {
      var cmd = 'mysql -upete -p365dity zapit < ' + f
      console.log(cmd)
      exec(cmd,(err, stderr, out) => {
        if (!err) {
          res()
        }
        else {
          console.log(err)
        }
      })
    })
  },{concurrency: 1})
}


// process.exit()

db.model.UserNotificationItem.sync({force: false})
// db.model.OrgField.sync({force: false})

// db.sequelize.sync({force: false})
  // .then(() => {
  //   return doAudit(db)
  // })
  // .then(loadFixtures)
  // .then(loadCustomFunctions)
  // .then(() => {
  //   return db.sequelize.close()
  // })
  // .catch(e => {
  //   console.log(e)
  // })
