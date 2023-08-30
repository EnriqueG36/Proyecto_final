//En esta funcion se meterá la logia de los socket, eventos emitidos y escuchados


const MessagesManagerMongo = require('../daos/mongo/messages.mongo.js');              //Importamos la clase MessagesManagerMongo

const messagesManager = new MessagesManagerMongo()




const websocketFuncion = (socketServer) =>{
	 socketServer.on('connection', socket =>{
		console.log(`Nuevo cliente conectado, id: ${socket.id}`)
	
		let allMessagesTxt;

		messagesManager.getMessages().then(result => { 
        		
			allMessagesTxt = JSON.stringify(result, "null", 2)						//Convertimos a texto el arreglo de productos
			
			socketServer.emit('chatLog', allMessagesTxt)							//Emite el evento 'products' a todos los sockets conectados
        })

		
	
		//Escucha por el evento newChatMessage, recibe un objeto con la informacion de ususario y texto
        socket.on('newChatMessage', data =>{

            console.log(data)
            messagesManager.addMessage(data)                                        //guarda un mensaje nuevo
    
        })


	})

   

}

module.exports = { 
    websocketFuncion
}

