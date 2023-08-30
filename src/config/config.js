//console.log(process.argv)

const [, , , enviroment] = process.argv

//Configuracion de dotenv, dependiento el argumento pasado por consola será el archivo .en que tomará en cuenta
require('dotenv').config({path:enviroment=="development"?'./.env.development':'./.env.production'})

module.exports = {
    PORT: process.env.PORT,
    MODO: process.env.MODE
}