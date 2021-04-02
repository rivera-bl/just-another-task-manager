const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = ""


sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
    to: 'rivvera.pabblo@gmail.com',
    from: 'rivvera.pabblo@gmail.com',
    subject: 'Test email from sendgrid',
    text: 'I hope this goes through'
})
