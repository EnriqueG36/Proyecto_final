//Capa repository para productos

class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = (limit, page, query, sort)=> {
        return this.dao.get(limit, page, query, sort)
    }

    addProduct = (newProduct)=>{
        return this.dao.add(newProduct)
    }
    
    getProductById = (pid)=> {
        return this.dao.getById(pid)
    }

    deleteProductById = (pid)=>{
        return this.dao.deleteById(pid)
    }

    updateProductById = (pid, productToUpdate)=>{
        return this.dao.updateById(pid, productToUpdate)
    }
    
}

module.exports = ProductRepository