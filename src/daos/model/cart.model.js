const {Schema, model} = require('mongoose')
const collection = 'carts'	//Esta variable contendrá el nombre de la colección que vamos a usar en nuestra base de datos de mongo

//Ahora definiremos el Schema de mongo, campo y tipo de dato, además de otras propiedades
const cartSchema = new Schema({
	products: [{productId: {type: Schema.Types.ObjectId, ref: "products"}, quantity: Number}]
	
})

//definimos  productModel, que será un objeto al que le pasaremos la colección que vamos a usar y el Schema que vayamos a usar también mediante la función model
const cartModel = model(collection, cartSchema)

//Ahora exportamos cartModel
module.exports = 
	cartModel
