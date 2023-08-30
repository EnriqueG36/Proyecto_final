//Controller para carritos, hace uso del cart service
const { logger } = require("../config/logger");
const {cartService, ticketService, productService} = require("../repositories");        //Imporamos los service de carros, productos y tickets


//const CartManagerMongo = require("../daos/mongo/cart.mongo");
//const cartManager = new CartManagerMongo()


class CartController {

//Crear un nuevo carrito vacio    
postNewCart = async (req, res)=>{
    try{
        const newCart = await cartService.createCart()
        res.status(200).send({
            status: "success, se ha creado un nuevo carrito",
            payload: newCart
        })

    }catch(error){
        console.log(error)
    }
}    

//Agregar un producto al carrito
postProductToCart = async (req, res)=>{
    try{
        const {cid} = req.params
        const {pid} = req.params

        logger.info(cid)
       
        const showCart = await cartService.addProductToCart(cid, pid)
        res.status(200).send({
            status: `success, se añadió el producto al carro: ${cid}`,
            payload: showCart
        })

    }catch(error){
        console.log(error)
    }
}

//Lista los productos en un carrito por el id del carrito
getProductsInCart = async (req, res)=>{
    try{
        const {cid} = req.params
        logger.info(cid)
        const showCart = await cartService.showCartProducts(cid)
        res.status(200).send({
            status: `success, se muestra el carrito: ${cid}`,
            payload: showCart
        })

    }catch(error){
        console.log(error)
    }
}

//Elimina del carrito, el producto seleccionado
deleteProductInCart = async (req, res)=>{
    try{
        const {cid} = req.params
        const {pid} = req.params
       
        const showCart = await cartService.deleteProductFromCart(cid, pid)
        res.status(200).send({
            status: `success`,
            payload: showCart
        })  
    }catch(error){
        console.log(error)
    }
}

//Actualiza el carrito con un arreglo de productos
putProductArrayToCart = async (req, res)=>{
    try{
        const {cid} = req.params
        const productArray = req.body

        const showCart = await cartService.addProductArrayToCart(cid, productArray)
        res.status(200).send({
            status: `success`,
            payload: showCart
        })


    }catch(error){
        console.log(error)
    }
}

//Actualiza la contidad del producto seleccionado en el carrito seleccionado
putUpdateProductQuantity = async (req, res)=>{
    try{
        const {cid} = req.params
        const {pid} = req.params
        const {productQuantity} = req.body

        console.log(productQuantity)

        if (productQuantity < 0)  {  res.send({Error: `No se admite la cantidad ${productQuantity}`})
    } else{

        const showCart = await cartService.updateProductQuantity(cid, pid, productQuantity)       
        res.status(200).send({
            status: `success, se actualizó la cantidad del producto ${pid} a ${productQuantity} unidades`,
            payload: showCart
        })
    }
    }catch(error){
        console.log(error)
    }
}

//Elimina todos los productos del carrito
deleteAllProductsInCart = async (req, res)=>{
    try{
        const {cid} = req.params
        const showCart = await cartService.deleteAllProductsFromCart(cid)       
        res.status(200).send({
            status: `success, se han eliminado los productos del carro: ${cid}`,
            payload: showCart
        })

    }catch(error){
        console.log(error)
    }
}




//Hace una compra y genera el ticket
purchase = async (req, res)=>{
    try{

        //console.log("Dentro de la función purchase")

        const {cid} = req.params                    //El cid lo obtenemos de params, vamos a trabajar sobre el carrito asignado al usuario que haga la compra
        const email = req.session.user.email        //Obtenemos el email del usuario de los datos de la sesion, se usará al momento de generarl el ticket

        const theCart = await cartService.showCartProducts(cid)    //Obtenemos los datos del carrito
        
        const productsInCart = theCart.products                     //Se extrae solo el arreglo de productos en el carro para trabajar con el
        
        //validación del ID del carrito
        if(!productsInCart) { return res.status(400).send({status: "Error", message: "No se encuentra el carrito"})} //Validar si existe el carro en la base de datos

        const productsWithoutStock = []         //Arreglo que contendrá los productos cuya compra no se concrete
        const productsWithStock = []            //Arreglo que contendrá los productos que sí cumplan con el stock necesario para la compra

        
        let iterationAmount                     //Variable que saca el total a pagar por producto * cantidad de ese mismo producto
        let totalAmount = 0                     //Variable en la que iremos sumando la cantidad total de la compra
        let pidString                           //Se usa para obtener el ID de producto, ya que en el arreglo del carrito se devuelve con una cadena más larga
        let pid
        let stockLeft                           //Variable para ir guardando cuanto stock queda de determinado producto


        //Aquí vamos a recorrer el arreglo de productos para ver si cada elemento cumple con el stock necesario, si es así lo agregaremos a un arreglo de productos
        //que cumplen con el stock e iremos sumando el monto de acuerdo a la cantidad, si no se cumple el stock lo meteremos a un arreglo de productos sin stock suficiente
        productsInCart.forEach(element => {
          
            //pid = element.productId._id.slice(14, -2)
                        
            //si se tiene suficuente stock:
            if(element.productId.stock >= element.quantity) {
                productsWithStock.push(element)                                         //Agregar al arreglo de productos con stock el producto
                iterationAmount = element.productId.price * element.quantity            //Costo del producto por cantidad requerida
                stockLeft = element.productId.stock - element.quantity                  //Resta de la cantidad requerida al sotck total del producto
                           

                pidString = element.productId._id.toString()                            //extraer el id del producto, se usa para pasarlo a la funcion de actualizar del productService
                
                //Este objeto es solo para actualizar el campo stock, si hay una manera más sencilla, reemplazar
                const updateProduct = {
                    title: element.productId.title,
                    description: element.productId.description,
                    code: element.productId.code,
                    price: element.productId.price,
                    status: element.productId.status,
                    stock: stockLeft,                                           // <--- Este es el unico campo que presenta cambios
                    category: element.productId.category,
                    thumbnails: element.productId.thumbnails,
                    __v: element.productId.__v
                }

                //Actualizar el stock de los productos comprados en la BD, se pasa el ID del producto y el producto con su stock actualizado
                productService.updateProductById(pidString, updateProduct)                              
            }
            else{
                productsWithoutStock.push(element)
            }
            
            totalAmount = totalAmount + iterationAmount                             //Costo total de los productos con stock 
            
        });

              

        //console.log(`Informacion pasada al ticket: Total = ${totalAmount}, email: ${email}`)
        
        const generatedTicket = await ticketService.createTicket(totalAmount, email)                          //generamos un ticket usando el ticket service

        //actualizamos el carrito, quedandose solo con los productos que no cumplieron con el stock requerido
        cartService.updateCartProductsArray(cid, productsWithoutStock)
     

        //Regresamos toda la informacion de la operación, el ticket generado, los productos que se compraron, los productos que no tenían stock
        res.status(200).send({status: "success", message: "Compra realizada", ticket: generatedTicket, productosComprados: productsWithStock, productosNoComprados: productsWithoutStock})

    }catch(error){
        console.log(error)
    }
}
}

module.exports = CartController