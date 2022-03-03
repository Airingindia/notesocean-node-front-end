const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // set the API key


const sendMail = async (to, from, subject, html, replyTo) => {
    const msg = {
        to: to, // Change to your recipient
        from: from, // Change to your verified sender
        subject: subject, // Change to
        html: html,
        replyTo: replyTo, // Change to
    }
    const email_response = await sgMail.send(msg);
    return email_response;
}

module.exports = {
    send: sendMail
}