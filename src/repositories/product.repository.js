//Capa repository para productos

class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = (limit, page, query, sort)=> {
        return this.dao.getProducts(limit, page, query, sort)
    }

    addProduct = (newProduct)=>{
        return this.dao.addProduct(newProduct)
    }
    
    getProductById = (pid)=> {
        return this.dao.getProductById(pid)
    }

    deleteProductById = (pid)=>{
        return this.dao.deleteProductById(pid)
    }

    updateProductById = (pid, productToUpdate)=>{
        return this.dao.updateProductById(pid, productToUpdate)
    }
    
}

module.exports = ProductRepository