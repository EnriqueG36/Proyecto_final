//Contiene la lógica para recibir datos de usuario

const userModel = require('../model/user.model.js')         //Importamos el userModel de moongose
//Dado que ahora el user lleva un campo de cart id, traemos el cartManager para crear un nuevo carro a la vez que un nuevo ususario se registra
const CartManager = require('./cart.mongo.js')      //Importamos el cartManager
const cartManager = new CartManager()               //NUeva instancia de cart manager

//Hasheo de password
const { createHash, isValidPassword } = require('../../utils/utils.js') //Se usa para encriptar el password de un nuevo user
//Logger
const { logger } = require('../../config/logger.js')

class UserManagerMongo {

    //crear un nuevo usuario
    async createUser(first_name, last_name, email, age, password){
        try{

            const cart = await cartManager.createCart()      //Crea un nuevo carrito para el nuevo usuario
            let role                                        //Contendrá el role del usuario
            let last_connection
            //Definimos un nuevo objeto con los datos de nuevo usuario
            const newUser = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                age: age,
                password: createHash(password),                            //encriptado
                cart,                              
                role,
                documents: [],
                last_connection
            }


            const resultUser = await userModel.create(newUser)

            return resultUser

        }catch(error){
            return new Error(error)
        }
    }

       //encontrar un usuario existente 
       async findUser(email){
       try{

            //console.log("en el find user del userManager")
            //console.log(email)

            return userModel.findOne(email)

        }catch(error){
            return new Error(error)
        }
    }

    //Actualizar un password de usuario
    async updatePassword (email, password) {
    
        //buscamos al usuario por su mail y obtenemos su password
        logger.info("DENTRO DE UPDATE USER PASSWORD")
        logger.info(email)
        const userInDb = await userModel.findOne({email: email})
        const oldPassword = userInDb.password
        console.log(userInDb)
        logger.info(oldPassword)


        console.log("A PUNTO DE COMPARAR LOS PASSWORDS")
        console.log(isValidPassword(userInDb, password))
        if(isValidPassword(userInDb, password)) return {status: "error", message: "Eliga otro password, diferente al anterior"}
    
        logger.info("Despues del if")
        const actualNewPassword = createHash(password)   
        logger.info(oldPassword)    
        logger.info(actualNewPassword)    
        const actualizado = await userModel.findOneAndUpdate({email: email}, {password: actualNewPassword},{new: true})
        logger.info(actualizado)
        return {status: "success", message: "Password ha sido actualizado"}
        
    }

    async changeUserRoleById (uid) {

        //Buscar el usuario en la DB por su uid
        let userInDb = await userModel.findOne({_id: uid})

        let updatedUser

        if (userInDb.role == "user"){ 
            if (userInDb.documents.length > 3) return ({status: "Error", message: "Hace falta documentacion"})
            updatedUser = await userModel.findOneAndUpdate({_id: uid}, {role: "premium"},{new: true})
        }
        if (userInDb.role == "premium"){
            updatedUser =  await userModel.findOneAndUpdate({_id: uid}, {role: "user"},{new: true})
        }

        logger.info(updatedUser)

        return updatedUser

    }   

    //Buscar al user por su id y actualizar su propiedad last_connection
    async updateUserLastconnection(uid){
        
        const user =  await userModel.findOneAndUpdate({_id: uid}, {last_connection: Date.now()}, {new: true})
                
        return user.last_connection
    }

    //Agregar docuemnentos al usuario, recibe el uid del usuario, nombre del archivo y path de archivo
    async addUserDocument(uid, filename, filePath){
       const user = await userModel.findOne({_id: uid})
       console.log(user)
       let nuevoDocuemnto = {name: filename, reference: filePath}
       let documentArray = []
       documentArray = user.documents
       console.log(user.documents)
       documentArray.push(nuevoDocuemnto)
       const result = await userModel.findByIdAndUpdate({_id: uid}, {documents: documentArray}, {new: true})
       return result
    }

    async getAllUsers(){

        const result = await userModel.find()
        return result
    }

}

module.exports = UserManagerMongo                           //Exportamos nuestra clase userManagerMongo