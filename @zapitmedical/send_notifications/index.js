module.exports = require("./dist").default;

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
