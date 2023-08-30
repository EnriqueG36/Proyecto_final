//Jason Web Token
const jwt = require ('jsonwebtoken')
const { logger } = require('../config/logger')

const PRIVATE_KEY = "coderSecret"

const generateToken = (user) => {
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn: 90}) //'24h'
    return token
}

const authToken = (req, res, next) => {
    //console.log(req.params)
    //const authHeader = req.headers.authorization
    //console.log(authHeader)
    //if(!authHeader) return res.status(401).send({status: "error", message: "No se encontró el jason web token"})
    //const token = authHeader.split(' ')[1]
    
    //Recibimos el token mediante req.params
    const {token} = req.params

    if(!token) {
        logger.error("No se encuentra el token")
        
        return res.status(401).send({status: "error", message: "No se encontró el jason web token"})
    }
    logger.info(token)
    
    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if(error) res.redirect('/resendtoken')
        //return res.status(403).send({error: "Not authorized (El token ha expirado)"})
        const userEmail  = credentials.email
        req.user = userEmail
        logger.info(req.user)
        next()
    })

}

module.exports = { generateToken, authToken }