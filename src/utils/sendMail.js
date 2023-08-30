const { createTransport } = require("nodemailer");
require('dotenv').config

//COnfiguracion de nodemailer para envio de mail de GMAIL
const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASS
    }
})

let from = `Servicio de email <${process.env.GMAIL_MAIL}>`

//Funcion generica exportada para elenvio de email
exports.sendEmail = async (email, subject, html) => {
    return await transport.sendMail({
        from,
        to: email,
        subject,
        html
    })
}