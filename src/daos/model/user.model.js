//Esquema de monongose para documentos de usuarios en la base de datos

const {Schema, model} = require('mongoose')
const collection = 'users'	//Esta variable contendrá el nombre de la colección que vamos a usar en nuestra base de datos de mongo

//Ahora definiremos el Schema de mongo, campo y tipo de dato, además de otras propiedades
const userSchema = new Schema({
	first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    //date_of_birth: {type: String, required: true},
    age: {type: Number, required: true},
    password: {type: String},
    cart: {type: Schema.Types.ObjectId, ref: "carts"},
    role: {type: String, required: true, default: "user"},
    documents: [{name: {type: String}, reference: {type: String}}],
    last_connection: {type: Date, default: Date.now() }	
})

//definimos  userModel, que será un objeto al que le pasaremos la colección que vamos a usar y el Schema que vayamos a usar también mediante la función model
const userModel = model(collection, userSchema)

//Ahora exportamos userModel
module.exports =  userModel
