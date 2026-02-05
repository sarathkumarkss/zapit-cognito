const machineMatch = upload_file => {
  return db.model.Machine.findAll({
    where: {active: true},
    raw: true,
    attributes: ['id','serial_number','manufacturer','model','station_id'],
    include: [{association: 'facility', attributes: ['name']}]
  })
  .then(machines => {
    var matches = _.map(machines,m => {
      var cnt = 0
      if (m.serial_number ===  upload_file.serial_number) cnt++
      if (m.manufacturer &&  upload_file.manufacturer && (m.manufacturer.toLowerCase() ===  upload_file.manufacturer.toLowerCase())) cnt++
      if (m.model &&  upload_file.model && (m.model.toLowerCase() ===  upload_file.model.toLowerCase())) cnt++
      if (m.station_id ===  upload_file.station_name) cnt++
      if (m['facility.name'] &&  upload_file.institution_name && (m['facility.name'].toLowerCase() ===  upload_file.institution_name.toLowerCase())) cnt++
      return {machine_id: m.id, matches: cnt}
    })

    var cnts = _.countBy(matches,'matches')
    delete cnts['0']
    var using_match_count = 0
    _.each(cnts,(machine_cnt, matched_cnt) => {
      if (matched_cnt > using_match_count && matched_cnt >= 2) {
        using_match_count = matched_cnt
      }
    })

    console.log('match counts: ' + JSON.stringify(cnts), 'info', null, upload_file.id)
    console.log(cnts)
    console.log('using match count: ' + using_match_count)

    if (cnts[using_match_count] !== 1){
      console.log('NO MATCH : ', cnts)
      return null
    }
    else {
      var machine_id = _.findWhere(matches,{matches: parseInt(using_match_count)}).machine_id
      console.log('MATCHED - slice matched to exactly one machine on ' + using_match_count + ' fields - machine id is: ' + machine_id)
      return machine_id

      // return db.model.AnalyzeUploadFile.findOne({where: {filename: filename}})
      // .then(upload_file_rec => {
      //   console.log('upload file rec:')
      //   console.log(upload_file_rec)
      //   return Promise.all([
      //     db.model.AnalyzeUploadFile.update({machine_id: machine_id},{where: {filename: filename}}),
      //     db.model.AnalyzeUpload.update({machine_id: machine_id},{where: {id: upload_file_rec.upload_id}})
      //   ])
      // })
    }
  })
  .catch(e => {
    console.log('ERROR IN MATCH MACHINES:')
    console.log(e)
  })
}


module.exports = (sequelize, DataTypes) => {
  var UploadFile = sequelize.define('analyze_upload_file', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    upload_id:          { type: DataTypes.INTEGER, allowNull: false },
    etag:               { type: DataTypes.STRING, allowNull: true },
    filename:           { type: DataTypes.STRING, allowNull: true },
    modality:           { type: DataTypes.STRING, allowNull: true },
    slice_type_id:      { type: DataTypes.INTEGER, allowNull: true },
    machine_id:         { type: DataTypes.INTEGER, allowNull: true },

    institution_name:   { type: DataTypes.STRING, allowNull: true },
    serial_number:      { type: DataTypes.STRING, allowNull: true },
    manufacturer:       { type: DataTypes.STRING, allowNull: true },
    model:              { type: DataTypes.STRING, allowNull: true },
    station_name:       { type: DataTypes.STRING, allowNull: true },
    acquisition_date:   { type: DataTypes.DATE, allowNull: true },

    series_num:         { type: DataTypes.INTEGER, allowNull: true },
    image_num:          { type: DataTypes.INTEGER, allowNull: true },
    image_comment:      { type: DataTypes.STRING, allowNull: true }
  },{
    indexes: [
      // {fields: ['upload_id','series_num','image_num'], unique: true},
      // {fields: ['etag'], unique: true},
      {fields: ['upload_id']},
      {fields: ['slice_type_id']},
      {fields: ['machine_id']}
    ]
  })

  UploadFile.prototype.updateMachineMatch = function() {
    return machineMatch(this)
    .then(id => {
      return this.update({machine_id: id})
      .then(() => {
        return id
      })
    })
  }

  return UploadFile
}
