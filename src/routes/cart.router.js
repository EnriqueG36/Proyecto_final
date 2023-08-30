//Endpoints para manejar los carritos

const { Router } = require('express');
const CartController = require('../controllers/cart.controller');
//const CartManager = require('./../daos/mongo/cart.mongo.js')    //Importamos el cartManager
//const cartManager = new CartManager()

const cartController = new CartController()               //Intanciamos nuestro cartController

const router = Router();    //Intanciamos router

//Endpoints para manejar los carritos

//Crear un carrito nuevo vacío
router.post('/', cartController.postNewCart)

//Agrega un producto a un carrito
router.post('/:cid/product/:pid', cartController.postProductToCart)


//lista los productos en un carrito por el id del carrito
//Se añade population
router.get('/:cid', cartController.getProductsInCart)

//Deberá eliminar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', cartController.deleteProductInCart)

//Deberá actualizar el carrito con un arreglo de productos
router.put('/:cid', cartController.putProductArrayToCart)

//Deberá poder actualizar solo la cantidad de ejemplares del producto por cualquier cantidad pasada por req.body
router.put('/:cid/products/:pid', cartController.putUpdateProductQuantity)

//Deberá eliminar todos los productos del carrito
router.delete('/:cid', cartController.deleteAllProductsInCart)

//Hacer una compra y generar el ticket
router.post('/:cid/purchase', cartController.purchase)

module.exports = router