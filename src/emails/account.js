const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rivvera.pabblo@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}.`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rivvera.pabblo@gmail.com',
        subject: 'It\'s sad to see you leave!',
        text: `Was there anything we could've done better, ${name}?.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
