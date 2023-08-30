//Contiene la logica para escribir tickets en la base de datos 
//DAO de tickets

const ticketModel = require("../model/ticket.model");           //Importamos el ticket model de mongoose

class TicketManagerMongo {

    async createTicket (totalAmount, purchaserEmail){
        try{

            //console.log("Empezando createTicket")

            //Generar antes el codigo
            let newCode = 0                                    //Variable que contendrá el nuevo código
            let puchase_datetime                                //Contiene el momento de la compra, se asigna por default al moemnto de escribir en la DB
            const totalTickets = await ticketModel.find()               //Obtenemos el total de tickets existente en la DB
            
            //console.log(totalTickets)
            if(!totalTickets) { 
                
                //console.log("en el if")    
                newCode = 1
            }                //Si el arreglo está vacio generamos el primer codigo = 1
            else{
                //console.log("en el else")
                //console.log(totalTickets.length)
                newCode = totalTickets.length + 1
                totalTickets.forEach(element => {
                    if (element.code == newCode) { newCode++ }
                });

            }

            /*
            console.log(`El código del ticket es ${newCode}`)
            console.log(totalAmount)
            console.log(purchaserEmail)
            */

            const newTicket = {
                code: newCode,
                puchase_datetime,
                amount: totalAmount,
                purchaser: purchaserEmail
            }
            //console.log(newTicket)

            //console.log("Despues de crear el objeto newTcket")
            

            const resultTicket = await ticketModel.create(newTicket)        //Guardamos el ticket en la base de datos
            return resultTicket

        }catch(error){
            return new Error(error)
        }
    }
}

module.exports = TicketManagerMongo                             //Importamos nuestra clase ticketManagerMongo