var Promise = require('bluebird')
// var config = require('config')
var aws = require('aws-sdk')
aws.config.setPromisesDependency(require('bluebird'))
var sns = new aws.SNS({region: 'us-east-1'})
var _ = require('underscore')

module.exports = config => {
  console.log('SEND NOTIFICATIONS')
  console.log(config)
  if (_.contains(['test','prod'],process.env.ZAPIT_DB)) {
    return sns.publish({
      TopicArn: 'arn:aws:sns:us-east-1:888328543067:send_notifications_' + process.env.ZAPIT_DB,
      Message: JSON.stringify(config)
    })
    .promise()
  }
  else {
    return Promise.resolve()
  }
}

// module.exports = (notification, transactions) => {
//   if (notification.email) {
//
//     return SendEmail.send({
//       subject: lookup[notification.entity][notification.action].subject,
//       to: notification.user.email,
//       transactions: transactions,
//       template: 'notifications/' + notification.entity + '/' + notification.action + '.pug'
//     })
//   }
// }


// var msg = {
//   TargetArn: arn,
//   Subject: 'THING',
//   MessageStructure: 'json',
//   Message: JSON.stringify({
//     APNS: JSON.stringify({
//       aps: {
//         alert: config.title,
//         badge: 0,
//         sound: 'default'
//       },
//       userInfo: config.data
//     }),
//     APNS_SANDBOX: JSON.stringify({
//       aps: {
//         alert: config.title,
//         badge: 0,
//         sound: 'default'
//       },
//       userInfo: config.data
//     }),
//     GCM: JSON.stringify({
//         data: {
//             title: config.title,
//             message: config.subtitle,
//             userInfo: config.data
//         }
//     })
//   })
// }
//
// sns.publish(msg,function(err, data){
//   if (err) logger.log('error',err)
//   else {
//     logger.log('info','Message sent')
//   }
// })
