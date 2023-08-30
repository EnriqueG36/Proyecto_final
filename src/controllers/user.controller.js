//User DAO, Model, DTO y service
const userModel = require("../daos/model/user.model");
const CartManagerMongo = require("../daos/mongo/cart.mongo");           //Importamos nuestro manager de carritos
const { userDto } = require("../dto/user.dto");
const {userService} = require("../repositories");

//Custom error
const { CustomError } = require("../utils/CustomError/customError");
const { generateUserErrorInfo } = require("../utils/CustomError/info");
const { EError } = require("../utils/CustomError/EErrors");

//DAO carritos
const cartManager = new CartManagerMongo()                              //Intanciamos el manager de carritos

//Hasheo de passwords
const { createHash, isValidPassword } = require('../utils/utils.js');    //Contiene las funciones para hashear el password
const { logger } = require("../config/logger");

//jwt
const { generateToken } = require("../utils/jwt");

//Nodemailer
const { sendEmail } = require("../utils/sendMail");


class UserController {

//login de ususario existente    
postUserLogin = async (req, res)=>{
    try{
        const {email, password} = req.body              //Obtenemos el email y el password del req.body

        logger.info(req.body)
        //Validacion del admin, este admin no se guardará en la base de datos users
        if(email == "adminCoder@coder.com" && password == "adminCod3r123") {
            req.session.user = {
                first_name: "Nombre Admin coder",
                last_name: "Apellido Admin coder",
                email: email,
                role: "admin"
            }

            res.redirect('/products')

        }else{
        
       // const userDB = await userModel.findOne({email, password})   //Buscamos en la base de datos si se encuentran el email y el password
        
       // if(!userDB) return res.send({status: "Error", message: "No existe el usuario"})

       //Nuevas funciones con password hasheado
       //console.log(email, password)
       
       //const userDB = await userModel.findOne({email})      //REEMPLAZAR POR USER SERVICE
       const userDB = await userService.findUser({email})


       //Console.log para mostrar los datos del user, que no necesariamente se muestran en /api/session/current
       logger.info(userDB)
       if (!userDB) return res.status(400).send({status: "error", error: "Email not found"})
       if(!isValidPassword(userDB, password)) return res.status(403).send({status: "error", error: "Incorrect password"})       //Compara el password ingresado con el password en la DB

        //Guardamos en la seesion los datos de firts_name, last_name, email
        req.session.user = {
            first_name: userDB.first_name,
            last_name: userDB.last_name,
            email: userDB.email,
            cart: userDB.cart,
            role: userDB.role,
            uid: userDB._id
        }

        //Actualizar la propiedad last connection del usuario
        const lastConnection = await userService.updateUserLastconnection(userDB._id)
        logger.info(`Ultima conexion de éste usuario: ${lastConnection}`)

        //res.send({status: "Success", message: "Session iniciada con exito"})
        res.redirect('/products')                                   //Redirige a la vista products
    }
    }catch(error){
        console.log(error)
    }
}

//Registro de nuevo ususario
postNewUserRegister = async (req, res, next) => {
    try{
        
    const {first_name, last_name, email, age, password} = req.body       //Obtenemos estos atributos del req.body
    
    //Validar si los campos introducidos no están vacíos
    if(!first_name || !last_name || !email || !age || !password) {

        CustomError.createError({
            name: "Error al crear un usuario nuevo",
            cause: generateUserErrorInfo({first_name, last_name, email, age, password}),
            message: "Al intentar registrar un nuevo usuario, hacen falta campos",
            code: EError.INVALID_TYPE_ERROR
        })

    }
        
    //return res.send({message: "Todos los campos son obligatorios"})
    
    //Validar si el campo email está repetido
    //const existEmail = await userModel.findOne({email})                             //Buscamos en la base de datos si el email ya existe 
    const existEmail = await userService.findUser({email})                              //AQUI SE REEMPLAZO POR EL USER SERVICE


    if (existEmail) return res.send({status: "Error", error: "email ya registrado"})    //Si existe respondemos con este mensaje

        // *** TODO LO QUE SIGUE SE METIO EN EL USER DAO *** //

    /*
    const cart = await cartManager.createCart()                                 //Crea un nuevo carrito para el nuevo usuario
    let role

    //Definimos un nuevo objeto con los datos de nuevo usuario
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),                            //encriptado
        cart,                              
        role
    }
    */
    // ** HASTA AQUI *** //


    //let resultUser = await userModel.create(newUser)                                //Creamos un nuevo usuario en la base de datos
    let resultUser = await userService.createUser(first_name, last_name, email, age, password)                                    //REEMPLAZAR POR SERVICE

    //console.log solo para mostrar todos los datos del usuario, ya que no todos se guardan en la session
    logger.info(resultUser)
    //res.status(200).send({message: 'registro exitoso'})
    res.status(200).redirect('/login')
    }catch(error){
        next(error)
    }                                   
}

//Logout de usuario ya existente
getUserLogout = async (req, res) => {

    const email = req.session.user.email
    const user = await userService.findUser({email}) 


    req.session.destroy(err => {
        if(err) {
            return res.send({status: 'error', error: err})
        }
    })

    //Actualizar la propiedad last connection del usuario
    const lastConnection = await userService.updateUserLastconnection(user._id)
    logger.info(`Ultima conexion de éste usuario: ${lastConnection}`)

    res.redirect('/login')  

}

//Mostrar información de la session actual
getCurrentUserSessionData = (req, res) => {

    if (!req.session.user) res.send({status: "error", error: "no ha iniciado session"})
    
    const currentUser = req.session.user

    //Implementar aqui el DTO??
    const user = new userDto(currentUser)

    //res.send(currentUser)
    res.send(user)              //Se envia como respuesta el resultado del DTO

}

//Cambio de mail
getPasswordChangeMail = async (req, res) => {

	let {email} = req.body                                      //Se obtiene el mail del body
    const existEmail = await userService.findUser({email})      //Validamos si el email ya está registrado en la DB
	if (!existEmail) return res.status(400).send({status: "error", error: "Email not found"})   //Si el mail no se encuentra se retorna este mensaje
    console.log(existEmail)

    //generar un jwt
    const user = {
        first_name: existEmail.first_name,
        last_name: existEmail.last_name,
        email: existEmail.email
    }
    console.log(user)
    const mailToken = generateToken(user)

    //Si el mail fue encontrado, se manda un email
	let subject = "Cambio de contraseña, practica integradora"
	//let html = '<h1>Para cambiar password vaya a la siguiente liga: </h1> <a href ="http://localhost:8080/changepassword">Cambiar mi password</a>'
	let html = `<form action="http://localhost:8080/changepassword/${mailToken}" method="PUT"> <button>Cambiar mi password</button>`


	sendEmail(email, subject, html)
	
		res.status(200).send({
			status: "success",
			message: "email para cambio de password enviado"
            
		})
	

}

//actualizar password
updatePassword = async (req, res) => {

    logger.info("EN UPDATE PASSWORD")
    const usermail = req.user
    const newpassword = req.body.password
    logger.info(usermail)
    logger.info(newpassword)
     
    const result = await userService.updatePassword(usermail, newpassword)

       console.log("ya se lo brincó")

       res.send(result)
    
}

//Cambiar role, de user a premium y viceversa
changeUserRoleById = async (req, res) => {
    
    const {uid} =req.params
    const updatedUser = await userService.changeUserRoleById(uid)

    res.send(updatedUser)
}

//Agregar docuemento de un usuario
addUserDocument = async (req, res)=>{
	console.log(req.file)
	if(!req.file)	return res.status(400).send({Status: "Error", error: "No se pudo cargar el archivo"})
	console.log (req.file)

    const nombreArchivo = req.file.filename
    const pathArchivo = req.file.path
    logger.info(`Nobre de archivo recibido: ${nombreArchivo}`)
    logger.info(`Locación donde se guardó el archivo: ${pathArchivo}`)

    const uid = req.session.user.uid
    console.log(req.session.user)
    const addUserDocument = await userService.addUserDocument(uid, nombreArchivo, pathArchivo)

    res.status(200).send({status: "Success", message: "Archivo cargado con exito"})
}

//Obtener todos los usuarios
getAllUsers = async (req, res) =>{

    const users = await userService.getAllUsers()                           //Obtiene todos los usuarios en la colección

    let resultArray = []

    users.forEach(element => {                                              //"Filtra" la información sensible de cada usuario mediante el DTO
        resultArray.push(new userDto(element))
    })

    res.status(200).send(resultArray)
}

//Eliminará los usuarios que no hayan tenido conexion en los últimos dos días
deleteUsers = async (req, res) => {

    let resutlArray = []                                        //Se almacenarán en este arreglo los usuarios a eliminar
    let users = await userService.getAllUsers()                 //Se obtienen todos los usuarios de la colección

    users.forEach(element => {

        let fechaAhora = new Date(Date.now())                   //Definimos la fecha en éste momento
        let fechaUsuario = new Date()
        fechaUsuario = element.last_connection                  //Definimos la fecha de última conexion del usuario
       
        if ( fechaAhora.getFullYear() > fechaUsuario.getFullYear() ) {          //Comparar si hay diferencia de años

        console.log ("Diferencia de años, eliminar usuario") 
        resutlArray.push(element)                                               //Se ingresa la info del usuario a este arreglo
        
        }else{

            if ( (fechaAhora.getFullYear() == fechaUsuario.getFullYear()) && (fechaAhora.getMonth() > fechaUsuario.getMonth()) ) {      //Si el año es el mismo, comparar si hay diferencia de meses

                console.log("Mismo año pero diferencia de meses, eliminar usuario")
                resutlArray.push(element)                                                                                               //Se ingresa el usuario a este arreglo

            }else{ if ( (fechaAhora.getFullYear() == fechaUsuario.getFullYear()) && (fechaAhora.getMonth() == fechaUsuario.getMonth()) ){       //Si mes y año coinciden, se comparará la diferencia de días

                console.log("Año y mes iguales")
                let diaUsuario = fechaUsuario.getDate()                     //Obtenemos el día del mes de la ultima conexión del usuario
                let diaAhora = fechaAhora.getDate()                         //Obtenemos el día del mes de en éste momento
    
                if ( (diaAhora - diaUsuario) > 2) {                         //Si la diferencia es de más de dos días se eliminará el usuario
                    
                    console.log("Diferencia mayor a dos días, eliminar usuario")
                    resutlArray.push(element) 

                }
                } 
            }
        }
         
    }); //Fin del foreach

    for (let i = 1 ; i <= resutlArray.length ; i ++) {

        await userModel.findOneAndDelete({_id: resultArray[i-1]._id})          //Buscar al usuario por id y eliminarlo de la colección
        
        let subject = "Cuenta eliminada por inactividad"
	    let html = `<h2> Estimado usuario ${resutlArray[i-1].first_name}, su cuenta ha sido eliminada por exceder el periodo de inactividad </h2`
        let email = resutlArray[i-1].email

        //Envio de email
        sendEmail(email, subject, html)
        
    }

    

    res.status(200).send({status: "Se eliminaron los siguientes usuarios", payload: resutlArray})
}

}

module.exports = UserController