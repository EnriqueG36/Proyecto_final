//Router de nuestras vistas

const { Router } = require('express')
const router = Router()
const { auth } = require('../middlewares/authentication.middleware')

//jwt
const { authToken } = require('../utils/jwt')


 /*
const ProductManager = require('../daos/mongo/product.mongo.js') //Importamos nuestro productManager hecho con la persistencia en mongo
const productManager = new ProductManager()

const CartManager = require('./../daos/mongo/cart.mongo.js')    //Importamos el cartManager
const cartManager = new CartManager()
*/

const ViewsController = require('../controllers/views.controller')


const viewsController = new ViewsController()


//Ruta que renderiza la vista chat.handlebars
router.get('/chat', (req, res)=>{
res.render('chat', {})

})

//Vista que muestra todos los productos disponibles con paginacion
router.get('/products', viewsController.getViewAllProducts)

//Vista que muestra todos los productos en un carrito
router.get('/carts/:cid', viewsController.getViewCart)

//Plantilla de registro
router.get('/register', (req, res) => {
    res.render('register', {})
})

//Plantilla de login
router.get('/login', (req, res) => {

    res.render('login', {}) 
})

//Contraseña olvidada
router.get('/forgotpassword', (req, res) => {
    
    res.render('forgotpassword', {})
})

//Cambio de contraseña, debería de estar activo el token para continuar
router.get('/changepassword/:token', authToken, (req, res)=> {
    console.log("ubicaco en dodne renderiza la vista")
    console.log(req.params)
    const {token} = req.params
    res.render('passwordchange', {token})
})

//Si el token expiro, redirigir a ésta vista
router.get('/resendtoken', (req, res) => {

    res.render('resendtoken', {})
})

module.exports = router