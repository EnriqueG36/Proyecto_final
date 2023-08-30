//Contiene el Schema y el model para documentos de productos en mongoAtlas

const {Schema, model} = require('mongoose')
const collection = 'messages'	//Esta variable contendrá el nombre de la colección que vamos a usar en nuestra base de datos de mongo

//Ahora definiremos el Schema de mongo, campo y tipo de dato, además de otras propiedades
const messagesSchema = new Schema({
	user: {type: String, required: true},
    message: {type: String, required: true}
})

//definimos  messagesModel, que será un objeto al que le pasaremos la colección que vamos a usar y el Schema que vayamos a usar también mediante la función model
const messagesModel = model(collection, messagesSchema)

//Ahora exportamos mesagesModel
module.exports = messagesModel
