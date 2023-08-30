//Script que maneja la lógica del chat

const socket = io()


socket.on('chatLog', data=>{                                      //Escucha por el evento chatLog
        console.log('Recibido el chatLog');
        //listaProductos = data;
        document.getElementById("chatLog").innerHTML = data      //Despliega la lista de productos en el elemento "chatLogs", dentro del documento
      
        
    })

    socket.on('evento_todos', data=>{
        console.log(data)
    })

    //Esta funcion se llama al momento de dar click en el boton del formulario para enviar el mensaje
    function addNewMessage() {

    console.log("Dentro de la funcion de añadir mensaje")

        const newMessage = {                                                            //Guarda en un objeto todos los valores recibidos de los campos del formulario
            "user": document.getElementById('userForm').value,
            "message": document.getElementById('messageForm').value                  
        }

        socket.emit('newChatMessage', newMessage)                                       //Este evento emite al servidor el nuevo mensaje para guardarlo en la base de datos

    }

    