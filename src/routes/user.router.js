const { Router } = require('express')
const UserController = require('../controllers/user.controller')
const userController = new UserController()
const router = Router()
const { uploader } = require('../multer.js')

//Cambiar usuario de user a premium y viceversa
router.put('/premium/:uid', userController.changeUserRoleById)

//carga de archivos
//Aquí debe subir el archivo y actualizar al usuario, usa el middleware de multer
router.post('/:uid/documents', uploader.single('documentos'), userController.addUserDocument)

//Obtene todos los usuario, no mostrar información sensible
router.get('/', userController.getAllUsers)

//Debe eliminat todos los usuarios que no hayan tenido conexion en dos días
router.delete('/', userController.deleteUsers)

module.exports = router