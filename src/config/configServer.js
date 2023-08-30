//Configuracion para la conexion de nuestra base de datos en mongoAtlas
require('dotenv').config()
const {connect} = require('mongoose')
const { logger } = require('./logger')



//Aquí pegamos la connection string que inclye nuestro user y password de nuestro cluster en mongoAtlas, 
const url =  process.env.MONGO_CONNECTION_STRING                                                                                                                   //Antes del ? colocamos el nombre de nuestra base de datos

module.exports = {
    connectDB: () => { 
        connect(url) 
        logger.info('Base de datos conectada') 
        
    }}