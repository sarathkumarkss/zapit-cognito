module.exports = (sequelize, DataTypes) => {
  var Upload = sequelize.define('analyze_upload', {
    id:                 { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    s3key:              { type: DataTypes.STRING, allowNull: false },
    agent_id:           { type: DataTypes.INTEGER, allowNull: false },
    study_instance_uid: { type: DataTypes.STRING, allowNull: true },
    machine_id:         { type: DataTypes.INTEGER, allowNull: true },
    is_valid:           { type: DataTypes.BOOLEAN, allowNull: true },
    is_processed:       { type: DataTypes.BOOLEAN, allowNull: true, default: 0 }
  },{
    indexes: [
      {fields: ['agent_id']},
      {fields: ['machine_id']}
    ]
  })

  Upload.prototype.updateMachineId = function(){
    var files = this.get('files',{plain: true})
    console.log(files)
    var counts = _.countBy(_.pluck(files,'machine_id'))
    var machine_id = _.invert(counts)[_.max(_.values(counts))]
    if (machine_id) {
      console.log(`machine id for upload is: ${machine_id}`)
      return this.update({machine_id: machine_id})
    }
    else {
      console.log('was not matched')
      return Promise.resolve()
    }
  }

  Upload.prototype.getSliceHash = function(){
    var files = this.get('files',{plain: true})
    if (files.length === 0) {
      console.log('no files found')
      return {}
    }
    // console.log('files:')
    // console.log(files)
    var modality = files[0].modality
    if (modality === 'mr') {
      var series_counts = _.countBy(files,'series_num')
      var main_series_num = parseInt(_.invert(series_counts)[_.max(_.values(series_counts))])
      var localizer_series_num = parseInt(_.invert(series_counts)[_.min(_.values(series_counts))])

      console.log(series_counts)
      console.log('main series: ' + main_series_num)
      console.log('localizer: ' + localizer_series_num)

      var main_series_image_start = _.min(_.pluck(files,'image_num'))
      var temp = {
        slice_localizer:  _.findWhere(files,{series_num: localizer_series_num}),
        slice_1:          _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start}),
        slice_5:          _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start + 4}),
        slice_6:          _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start + 5}),
        slice_7:          _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start + 6}),
        slice_8:          _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start + 7}),
        slice_9:          _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start + 8}),
        slice_10:         _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start + 9}),
        slice_11:         _.findWhere(files,{series_num: main_series_num, image_num: main_series_image_start + 10})
      }

      _.each(temp,(val, key) => {
        if (val) {
          temp[key] = {
            folder: val.filename,
            upload_file_id: val.id
          }
        }
      })

      return temp
    }
    else if (modality === 'ct') {
      var hash = {}
      _.each(files,f => {
        hash[`${f.series_num}_${f.image_num}`] = {
          folder: f.filename,
          upload_file_id: f.id
        }
      })
      return hash
    }
  }

  return Upload
}
