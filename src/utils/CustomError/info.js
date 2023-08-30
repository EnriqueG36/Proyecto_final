exports.generateUserErrorInfo = (user) => {
    return `All properties are required, one of more properties are incomplete or are invalid:
    * first_name: required string, received ${user.first_name}
    * last_name: required string, received ${user.last_name}
    * email: required string, received ${user.email}
    * age: required number, received ${user.age}
    * password: required string, received ${user.password}`
}
/*
exports.generateProductErrorInfo = (product) => {
return `One or more properties are incomplete or are of an invalid data-type:
    *title: required string, received ${product.title}
    *description: required string, received ${product.description}
    *code: required string, received ${product.code}
    *price: required number, received ${product.number}
    *status: required boolean, received ${product.status}
    *stock: required number, received ${product.stock}
    *category: required string, received ${product.category}
    *thumbnail: required string, received ${product.thumbnail}`
}
*/