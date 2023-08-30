//Contiene el Schema y el model para documentos de productos en mongoAtlas

const {Schema, model} = require('mongoose')
const collection = 'products'	//Esta variable contendrá el nombre de la colección que vamos a usar en nuestra base de datos de mongo
const mongoosePaginate = require('mongoose-paginate-v2')    //Importamos el modulo monggose paginate v2 que usaremos en nuestro model de productos

//Ahora definiremos el Schema de mongo, campo y tipo de dato, además de otras propiedades
const productSchema = new Schema({
	title: { type: String, required: true },
	description: {type: String, required: true },
	code: { type: String, required: true, unique: true },
    price: { type: Number },
    status: { type: Boolean },
    stock: { type: Number },
    category: {type: String },
    thumbnails: { type: String },
    owner: {type: Schema.Types.ObjectId, ref: "users", default: "admin"}
})

//Mongoose-paginate-v2
productSchema.plugin(mongoosePaginate)

//definimos  productModel, que será un objeto al que le pasaremos la colección que vamos a usar y el Schema que vayamos a usar también mediante la función model
const productModel = model(collection, productSchema)

//Ahora exportamos productModel
module.exports =  productModel
