process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT']
var util = require('util')
var _ = require('underscore')
var Promise = require('bluebird')
var pug = require('pug')
var aws = require('aws-sdk')
aws.config.setPromisesDependency(require('bluebird'))
var moment = require('moment-timezone')
var sns = new aws.SNS({ region: 'us-east-1' })

// global.db = require('@zapitmedical/db')
global.db = require('@zapitmedical/db')({})

const sendToSlack = msg => {
	return new Promise((res, rej) => {
		sns.publish({
			Message: JSON.stringify({
				channel: 'server_status',
				msg: msg
			}),
			TopicArn: 'arn:aws:sns:us-east-1:888328543067:Slack'
		}, (err, data) => {
			if (err) console.log(err)
			res(data)
		})
	})
}

const send = config => {
	console.log('SENDING EMAIL - in SendEmail')
	var body = config.body || pug.renderFile(config.template, config)
	var ses = new aws.SES({ apiVersion: 'latest', region: 'us-east-1' })
	console.log('in SendEmail function - sending to: ' + config.to)
	console.log('body length: ' + body.length)
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


exports.handler = function (e, context) {
	console.log(e)
	if (e.triggerSource === 'PreSignUp_ExternalProvider') {
		e.response.autoConfirmUser = true;
		context.done(null, e)
	}
	else if (e.triggerSource === 'PreSignUp_AdminCreateUser') {
		context.done(null, e)
	}
	else if (e.triggerSource === 'PreSignUp_SignUp') {
		db.model.User.findOne({ where: { email: e.request.userAttributes.email } }).then(user => {
			if (user) {
				console.log(e.request.userAttributes.email + ' found in db')
				e.response.autoConfirmUser = false
				sendToSlack('PreSignUp_SignUp: ' + e.request.userAttributes.email + ' - found in db')
					.then(() => {
						context.done(null, e)
					})
			}
			else {
				var error = new Error('USER NOT IN DATABASE - please sign up')
				sendToSlack('PreSignUp_SignUp: ' + e.request.userAttributes.email + ' - not found in db')
					.then(() => {
						context.done(error, e)
					})
			}
		})
	}
	else if (e.triggerSource === 'PostConfirmation_ConfirmSignUp') {
		sendToSlack('PostConfirmation_ConfirmSignUp: ' + e.request.userAttributes.email)
			.then(() => {
				context.done(null, e)
			})
	}
	else if (e.triggerSource === 'CustomMessage_SignUp') {
		db.model.User.findOne({ where: { email: e.request.userAttributes.email } }).then(user => {
			var body = pug.renderFile('@zapitmedical/templates/signup_login/code.pug', { firstname: user.firstname })
			e.response = {
				emailMessage: body,
				emailSubject: 'Welcome to ZapIT!'
			}
			sendToSlack('CustomMessage_SignUp: ' + e.request.userAttributes.email)
				.then(() => {
					context.done(null, e)
				})
		})
	}
	else if (e.triggerSource === 'PreAuthentication_Authentication') {
		sendToSlack('PreAuthentication_Authentication: ' + e.request.userAttributes.email)
			.then(() => {
				context.done(null, e)
			})
	}
	else if (e.triggerSource === 'PostAuthentication_Authentication') {
		sendToSlack('PostAuthentication_Authentication: ' + e.request.userAttributes.email)
			.then(() => {
				context.done(null, e)
			})
	}
	else if (e.triggerSource === 'CustomMessage_ForgotPassword') {
		var body = pug.renderFile('@zapitmedical/templates/signup_login/code.pug')
		e.response = {
			emailMessage: body,
			emailSubject: 'Forgot password'
		}
		context.done(null, e)
	}
	else if (e.triggerSource === 'PostConfirmation_ConfirmForgotPassword') {
		context.done(null, e)
		// db.model.User.findOne({where: {email: e.request.userAttributes.email}}).then(user => {
		//   console.log('should send email here')
		//   sendToSlack('PostConfirmation_ConfirmForgotPassword: ' + e.request.userAttributes.email)
		//   .then(() => {
		//     context.done(null, e)
		//   })
		//
		//   // var body = pug.renderFile('node_modules/templates/signup_login/password_set.pug',{firstname: user.firstname})
		//   // send({
		//   //   to: user.email,
		//   //   subject: 'ZapIT! Password Set',
		//   //   body: body
		//   // })
		//   // .then(() => {
		//   //   console.log('would update last_password_reset for ' + e.request.userAttributes.email)
		//   //   sendToSlack('PostConfirmation_ConfirmForgotPassword: ' + e.request.userAttributes.email)
		//   //   .then(() => {
		//   //     context.done(null, e)
		//   //   })
		//   // })
		//   // .catch(e => {
		//   //   console.log(e)
		//   // })
		//
		//   // sns.publish({
		//   //   Message: JSON.stringify({
		//   //     body: body,
		//   //     to: user.email,
		//   //     subject: 'ZapIT! Password Set'
		//   //   }),
		//   //   TopicArn: 'arn:aws:sns:us-east-1:888328543067:SendEmail'
		//   // },(err, data) => {
		//   //   if (err) console.log(err)
		//   //   else console.log(data)
		//   //   // db.model.User.findOne({where: {email: e.request.userAttributes.email}})
		//   //   // r.table('users').get(e.request.userAttributes.email).update({last_password_reset: rnow()}).then(out => {
		//   //     console.log('would update last_password_reset for ' + e.request.userAttributes.email)
		//   //     sendToSlack('PostConfirmation_ConfirmForgotPassword: ' + e.request.userAttributes.email)
		//   //     .then(() => {
		//   //       context.done(null, e)
		//   //     })
		//   //   // })
		//   // })
		// })
	}
}
