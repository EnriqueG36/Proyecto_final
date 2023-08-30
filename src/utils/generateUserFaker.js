const {faker} = require('@faker-js/faker')

const generateProduct = ()=>{
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.numeric(),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        stock: faker.string.numeric(),
        category: faker.commerce.department(),        
        thumbnails: faker.image.url()
    }
}

module.exports =  { generateProduct }