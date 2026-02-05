var aws = require('aws-sdk')
var lambda = new aws.Lambda({region: 'us-east-1'})

module.exports = (sequelize, DataTypes) => {
  var UserPurchase = sequelize.define('user_purchase', {
    id:               { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
    user_id:          { type: DataTypes.INTEGER, allowNull: false },
    amount:           { type: DataTypes.INTEGER, allowNull: false },
    description:      { type: DataTypes.STRING, allowNull: false },
    effectivedate:    { type: DataTypes.DATE, allowNull: false },
    item:             { type: DataTypes.ENUM('gxmo','continuing_ed','lso','kentucky_lxmo'), allowNull: false },
    status:           { type: DataTypes.STRING, allowNull: false },
    term:             { type: DataTypes.INTEGER, allowNull: false },
    category:         { type: DataTypes.STRING, allowNull: true }
  },{
    indexes: [
      {fields: ['user_id']}
    ]
  })

  UserPurchase.addHook('afterCreate','afterCreate',(purchase, options) => {
    console.log('afterCreate')

    return db.model.User.findByPk(purchase.user_id)
    .then(user => {
      var groups = []

      if (purchase.item === 'lso' && purchase.category === 'chest') {
        groups.push('8g11047')
      }
      if (purchase.item === 'lso' && purchase.category === 'chiropractic') {
        groups.push('8z12742')
      }
      if (purchase.item === 'lso' && purchase.category === 'podiatric') {
        groups.push('8c12743')
      }
      else if (purchase.item === 'continuing_ed') {
        groups.push('zapit')
      }
      else if (purchase.item === 'gxmo') {
        groups.push('ohiogxmo')
        groups.push('ohiogxmoreview')
      }
      else if (purchase.item === 'kentucky_lxmo' && purchase.category === 'general') {
        groups.push('8h12599')
      }
      else if (purchase.item === 'kentucky_lxmo' && purchase.category === 'podiatry') {
        groups.push('8112600')
      }
      else if (purchase.item === 'kentucky_lxmo' && purchase.category === 'bone_densitometry') {
        groups.push('8a12601')
      }

      // console.log('afterCreate')
      return Promise.map(groups,g => {
        return lambda.invoke({
          FunctionName:   'TestCom',
          InvocationType: 'Event',
          Payload:        JSON.stringify({
            method:         'addUserToGroup',
            login:          user.testcom_user,
            password:       user.testcom_password,
            email:          user.email,
            groupcode:      g
          })
        })
        .promise()
        .catch(e => {
          console.log(e)
        })
      },{concurrency: 1})
    })

    return Promise.all([
      lambda.invoke({
        FunctionName: 'TestCom',
        InvocationType: 'Event',
        Payload:      JSON.stringify({
          method:   'addUserToGroup',
          login:    user.testcom_user,
          password: user.testcom_password,
          email:    user.email,
          name:     (user.firstname && user.lastname) ? (user.firstname + ' ' + user.lastname) : user.email
        })
      })
      .promise()
      .catch(e => {
        // console.log(e)
      })
    ])
  })

  return UserPurchase
}
