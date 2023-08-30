//Capa repository para carritos

class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    createCart = ()=> {
        return this.dao.createCart()
    }

    addProductToCart = (cid, pid)=>{
        return this.dao.addProductToCart(cid, pid)
    }
    
    showCartProducts = (cid)=> {
        return this.dao.showCartProducts(cid)
    }

    deleteProductFromCart = (cid, pid)=>{
        return this.dao.deleteProductFromCart(cid, pid)
    }

    addProductArrayToCart = (cid, productArray)=>{
        return this.dao.addProductArrayToCart(cid, productArray)
    }

    updateProductQuantity = (cid, pid, productQuantity)=>{
        return this.dao.updateProductQuantity(cid, pid, productQuantity)
    }

    deleteAllProductsFromCart = (cid)=>{
        return this.dao.deleteAllProductsFromCart(cid)
    }
    
    updateCartProductsArray = (cid, productArray)=>{
        return this.dao.updateCartProductsArray(cid, productArray)
    }

}

module.exports = CartRepository