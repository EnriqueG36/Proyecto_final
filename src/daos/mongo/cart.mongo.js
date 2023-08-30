//Contiene la lógica para recibir datos de carritos (DAO)

const cartModel = require('../model/cart.model.js') //Importamos el cartModel

class CartManagerMongo {

    //Retorna todos los documentos de carritos
    async createCart(){
        try{
            //Este arreglo vacio se declara para cumplir con el Schema de mongoose
            /*let emptyProducts = {productId: null, 
                            quantity: 0}
                            */
                let emptyProducts = []
            //Se pasa el arreglo anterior
            //return await cartModel.create({products: emptyProducts})
            return await cartModel.create({produts: emptyProducts})

            //return await cartModel.create()
        }catch(err){
        return new Error(err)
        }
    }    
    
    //Agrega un producto a un determinado carrito
    async addProductToCart(cid, pid){
        try {
           let foundCart = await cartModel.findOne({_id: cid})
          //console.log (foundCart)

          let productArray = foundCart.products //obtenemos el arreglo products del documento
          console.log(productArray) 
          let newProduct = {productId: pid, quantity: 1}    //Definimos un nuevo producto 
          let foundId = false;

          productArray.forEach(element => {     //recorremos el arreglo products en busca del id proporcionado por params
            if (element.productId == pid){
                element.quantity ++             //Si se encuentra se sumará uno a la propiedad quantity
                foundId = true
                
            }
        })
            if (foundId){
                return await cartModel.updateOne({_id: cid},{products: productArray})       //si se encontro el id del producto en el carro, se actualiza en mongoAtlas
            }
            else {
                productArray.push(newProduct)                                               //Si no se encontró, se hace push del nuevo producto antes de actualizar en mongoAtlas
                return await cartModel.updateOne({_id: cid},{products: productArray})       
            }   
 
        
        }catch(error){
            return new Error(error)
        }
    }

    //Lista los productos en un carrito
    //Se añadio population
    async showCartProducts(cid){
        try {
            
        //return await cartModel.findOne({_id: cid})    
        return await cartModel.findOne({_id: cid}).populate('products.productId')
        }catch(error){
            return new Error(error)
        }
    }

    //Elimina los productos en un carrito
    async deleteAllProductsFromCart(cid){
        try {
            return await cartModel.updateOne({_id: cid}, {products: []})    //Busca el carro por su id y sustiye el arreglo productos por uno vacio
            
            }catch(error){
                return new Error(error)
            }

    }

     //Actualiza la cantidad del producto seleccionado en el carrito buscado
     async updateProductQuantity(cid, pid, productQuantity){
        try {
            let foundCart = await cartModel.findOne({_id: cid})     //Buscamos el carrito por su id
            let productArray = foundCart.products                  //Obtenemos el arreglo de los productos en el carrito
            let foundPid = false
            
            //recorremos el arreglo products en busca del id proporcionado por params
            productArray.forEach(element => {       
                if (element.productId == pid){
                    element.quantity = productQuantity             //Si se encuentra el producto en el carro, se actualizará la cantidad de este
                    foundPid = true                    
                }
            })

            if (foundPid){
                return await cartModel.updateOne({_id: cid},{products: productArray})       //si se encontro el id del producto en el carro, se actualiza la cantidad en mongoAtlas
            }
            else {
                
                return await {mensaje: "El producto no se encuentra en este carrito"}    
            }  

            
            }catch(error){
                return new Error(error)
            }

    }

      //Elimina el producto seleccionado del carrito
      async deleteProductFromCart(cid, pid){
        try {
            let foundCart = await cartModel.findOne({_id: cid})     //Buscamos el carrito por su id
            let productArray = foundCart.products                   //Obtenemos el arreglo de los productos en el carrito
            let foundPid = false
            let productIndex
            let newProductArray
            //console.log(productArray)
            
            //recorremos el arreglo products en busca del id proporcionado por params
            productArray.forEach(element => {       
                if (element.productId == pid){
                    productIndex = productArray.indexOf(element)                //Obtener el indice el producto en el arreglo
                    newProductArray = productArray.splice(productIndex, 1)      //Elimina el producto del arreglo
                    foundPid = true                    
                }
            })

            //console.log(productIndex)
            //console.log(newProductArray)

            if (foundPid){
                return await cartModel.updateOne({_id: cid},{products: productArray})       //si se encontro el id del producto en el carro, se actualiza la cantidad en mongoAtlas
            }
            else {
                
                return await {mensaje: "El producto no se encuentra en este carrito"}    
            }  
            
            }catch(error){
                return new Error(error)
            }

    }

    //Agrega un arreglo de productos a un carrito
    async addProductArrayToCart(cid, newProductsArray){
        try {
            let foundCart = await cartModel.findOne({_id: cid})      //Busca el carro por su id
            let productArray = foundCart.products                    //obtenemos el arreglo products del documento
               
            //Extraer los objetos del arreglo pasado por req.body
            newProductsArray.forEach(element => {
            productArray.push(element)                               //pushea los objetos pasados por req.body al arreglo de productos obtenido del carrito
          })
            
                                                                  
            return await cartModel.updateOne({_id: cid},{products: productArray})       //Actualiza el arreglo products en el carro seleccionado
             
        }catch(error){
            return new Error(error)
        }
    }

    //Nuevo metodo para actualizar el arreglo de productos de un carrito (no añadir, si no actualizarlo por completo)
    async updateCartProductsArray(cid, productArray){
        try{

            let updatedCart = await cartModel.updateOne({_id: cid},{products: productArray})
            return updatedCart


        }catch(error){
            return new Error(error)
        }
    }




}

module.exports = CartManagerMongo