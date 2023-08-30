//Index que instancia los services
//Dado que no se implemento el patrón factory, se importan directamente los managers (DAO) de product, cart, etc...

//Importar repositories

const ProductRepository = require("./product.repository.js");
const CartRepository = require("./cart.repository.js");
const UserRepository = require("./user.repository.js");
const TicketRepository = require("./ticket.repository.js");


//Importar daos que se pasan a los repositories
const ProductManagerMongo = require("../daos/mongo/product.mongo.js");          //Dao de productos
const CartManagerMongo = require("../daos/mongo/cart.mongo.js");                //Dao de carritos
const UserManagerMongo = require("../daos/mongo/user.mongo.js");                //Dao de usuarios
const TicketManagerMongo = require("../daos/mongo/ticket.mongo.js");



//Declarar los services intanciando los repositories pasando el dao
const productService = new ProductRepository(new ProductManagerMongo())   
const cartService = new CartRepository(new CartManagerMongo())
const userService = new UserRepository(new UserManagerMongo())
const ticketService = new TicketRepository(new TicketManagerMongo)

//Exportar los services
module.exports = {userService, productService, cartService, ticketService}
