
const CartManagerMongo = require("../daos/mongo/cart.mongo");
const ProductManagerMongo = require("../daos/mongo/product.mongo");

const productManager = new ProductManagerMongo()
const cartManager = new CartManagerMongo()

const { logger } = require("../config/logger");

class ViewsController {

//Vista que muestra todos los productos disponibles, con paginacion    
getViewAllProducts = async (req, res) => {
    try{
        //req.querys, valores por default
        const {limit=5} = req.query
        const {page=1} = req.query
        const {query=null} = req.query
        const {sort} = req.query
    
        const products = await productManager.getProducts(limit, page, query, sort)
        
        const productsList = products.docs
        const hasPrevPage = products.hasPrevPage
        const hasNextPage = products.hasNextPage
        const prevPage = products.prevPage
        const nextPage = products.nextPage
        const productLimit = products.limit

        //console.log(productsList)

        const userFirst_name = req.session.user.first_name                          //Obtenemos el first_name del ususario, de la session
        const userLast_name = req.session.user.last_name                            //Obtenemos el last_name del usuario, de la session
        const user_cart = req.session.user.cart
        const role = req.session.user.role
        const uid = req.session.user.uid

        

        res.render('products', {userFirst_name, userLast_name, user_cart, role, uid, productsList, hasPrevPage, hasNextPage, prevPage, nextPage, productLimit})
        
    }catch(error){
        console.log(error)
        }      
}

//Vista que muestra todos los productos en un carrito dado
getViewCart = async (req, res) => {
    try{
        
        const {cid} = req.params
        const cart = await cartManager.showCartProducts(cid)
        
        //console.log("En el getViewCart")
        logger.info(cart)
       
        /*
        const productsInCartList = cart.products
        console.log(productsInCartList)
        */

        res.render('cart', {cart})
        
    }catch(error){
        console.log(error)
        }  
}


}

module.exports = ViewsController