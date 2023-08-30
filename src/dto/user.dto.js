//Data Tranfer Object para normalización de datos de usuario
class userDto {
    constructor(user){
        this.userName = user.first_name
        this.userMail = user.email
        this.userCart = user.cart
        this.userRole = user.role
    }
}

module.exports = { userDto }