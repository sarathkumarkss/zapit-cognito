var aws = require('aws-sdk')
aws.config.setPromisesDependency(require('bluebird'))
const ses = new aws.SES({apiVersion: 'latest', region: 'us-east-1'})
// console.log(aws)
// process.exit()
const pug = require('pug')
const moment = require('moment-timezone')
const Promise = require('bluebird')

const send = config => {
  if (process.env.ZAPIT_DISABLE_SEND_EMAIL) {
    console.log('not sending email - disabled')
    return Promise.resolve()
  }
  else {
    console.log('SENDING EMAIL')
    console.log(config)
    var body = config.body || pug.renderFile(`${__dirname}/email_templates/${config.template}.pug`, Object.assign({},config,{moment: moment}))
    console.log('body length: ' + body.length)
    console.log(ses)
    return ses.sendEmail({
      Source: 'support@zapitmedical.com',
      Destination: { ToAddresses: [config.to] },
      Message: {
        Subject: {
          Data: config.subject
        },
        Body: {
          Html: {
            Data: body
          }
        }
      }
    })
    .promise()
  }
}

module.exports = {
  send: send
}
