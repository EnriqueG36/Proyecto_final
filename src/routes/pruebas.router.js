//Router para pruebas
const{Router} = require('express')
const { logger } = require('../config/logger')
const { sendEmail } = require('../utils/sendMail')

const router = Router() //Ejecutamos el metodo Router


//Router para probar logger
router.get('/loggerTest', (req, res) => {
    
    logger.info("Dentro del router /loggerTest")
    req.logger.error("Logger error (prueba)")

})

//Preba de envio de mail
router.get('/mail', (requ, res) => {

let subject = "Prueba de email nodemailer"
let html = '<h1>Prueba normal</h1>'


    sendEmail(' ', subject, html)

    res.status(200).send({
        status: "success",
        message: "email enviado"
    })
})


module.exports = router