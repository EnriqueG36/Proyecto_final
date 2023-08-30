//Configuración de logger con winston
const winston = require('winston')
const { MODO } = require('./config')


let logger


if (MODO=="DEVELOPMENT"){

//Configuracion para el modo "DEVELOPMENT"

//Definicion de los custom leves y colores para logger
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
    }

//Configuración avanzada de logger
logger = winston.createLogger({
	levels: customLevelOptions.levels,
	transports: [
		new winston.transports.Console({
		level: 'debug',
		format: winston.format.combine(
			winston.format.colorize({colors: customLevelOptions.colors}),
			winston.format.simple())		
}), 	
		new winston.transports.File({
		filename: './errors.log', 
		level: 'error',
		format: winston.format.simple()
})]
})
}

if(MODO=="PRODUCTION"){

    //Configuracion de logger para modo PRODUCTION, loggea a partir del invel "info"
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'red',
        http: 'green',
        debug: 'white'
    }
    }

//Configuración avanzada de logger
 logger = winston.createLogger({
	levels: customLevelOptions.levels,
	transports: [
		new winston.transports.Console({
		level: 'info',
		format: winston.format.combine(
			winston.format.colorize({colors: customLevelOptions.colors}),
			winston.format.simple())		
}), 	
		new winston.transports.File({
		filename: './errors.log', 
		level: 'error',
		format: winston.format.simple()
})]
})
}


//Logger exports
module.exports = {
	logger
	//addLogger	
}