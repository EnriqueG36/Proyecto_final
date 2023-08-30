//Model de mongoose para tickets de compra
const {Schema, model} = require('mongoose')
const collection = 'tickets'        //Nombre de la coleccion a usar en mongoAtlas

//Definición del Schema tickets
const ticketSchema = new Schema({
	code: {type: String, required: true, unique: true },
    purchase_datetime: {type: Date, default: Date.now},
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true}
})

//Definición del ticketModel
const ticketModel = model(collection, ticketSchema)

//Exportar tocketModel
module.exports = ticketModel


/*purchase_datetime: { 
    type: Date,
    required: true,
    default: Date.now
}
*/