//Contiene la logica para guardar los mensajes de chat en la base de datos
const messagesModel = require('../model/message.model.js') //Impotamos nuestro messagesModel de mongoose

class MessagesManagerMongo {

//guardar mensaje nuevo
async addMessage(newMessage){
    try{
        return await messagesModel.create(newMessage)   //Guarda el mensaje en la base de datos
    }catch(error){
        return new Error(error)
    }

}

//Leer los mensajes
async getMessages(){
    try{
        return await messagesModel.find()   //Retorna todos los mensajes
    }catch(error){
        return new Error(error)
    }
}
}

module.exports = MessagesManagerMongo