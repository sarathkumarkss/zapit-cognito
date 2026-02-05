module.exports = db => {
  var model = db.model
  var tables = _.keys(model)
  var todo = _.map(tables,t => {
    var toaudit = _.compact(_.map(model[t].rawAttributes,(hash, column) => {
      return hash.audit ? column : null
    }))
    return {raw: model[t].rawAttributes, table: model[t].tableName, columns: toaudit}
  })

  var output = []
  Promise.map(todo,i => {
    if (i.columns.length > 0) {
      var query =
      'CREATE TRIGGER ' + i.table + '_update\n' +
      'AFTER UPDATE ON `' + i.table + '`\n' +
      '  FOR EACH ROW\n' +
      '  BEGIN\n' +
      _.map(i.columns,c => {
        return `  IF (NEW.${c} <> OLD.${c} OR (OLD.${c} IS NULL AND NEW.${c} IS NOT NULL)) THEN\n` +
          '    INSERT INTO audit_update SET \n' +
          '    `table` = \'' + i.table + '\',\n' +
          '    `column` = \'' + c + '\',\n' +
          '    row_id = NEW.id, \n' +
          '    old_value = OLD.' + c + ',\n' +
          '    new_value = NEW.' + c + ',\n' +
          ((_.contains(_.keys(i.raw),'user_updated_id')) ? '    user_id = NEW.user_updated_id,\n' : '') +
          '    date = NOW();\n' +
          '  END IF;\n'
      }).join('') + '\n' +
        'END;'

        // console.log(query)

      output.push(i.table + ' - added trigger - tracking ' + i.columns.length + ' columns')
      return db.sequelize.query('DROP TRIGGER IF EXISTS ' + i.table + '_update;',{type: db.sequelize.QueryTypes.RAW})
      .then(() => {
        return db.sequelize.query(query,{type: db.sequelize.QueryTypes.RAW})
      })
    }
    else {
      return Promise.resolve()
    }
  },{concurrency: 1})
  .then(out => {
    console.log(output.join('\n'))
  })
}
