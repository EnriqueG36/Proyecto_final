//Configuración de passport

require('dotenv').config()	//para usar variables de entorno, y es necesario crear un archivo .env
//console.log(process.env)
const userModel = require('../daos/model/user.model.js')
const passport = require('passport')
const GithubStrategy = require('passport-github2')

//Dado que ahora el user lleva un campo de cart id, traemos el cartManager para crear un nuevo carro a la vez que un nuevo ususario se registra
const CartManager = require('./../daos/mongo/cart.mongo.js')    //Importamos el cartManager
const cartManager = new CartManager()                           //NUeva instancia de cart manager


const initPassportGithub = () => {
	passport.use('github', new GithubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
console.log('profile:', profile)
try{

	
	let user = await userModel.findOne({email: profile._json.email})
	if(!user) {

		const cart = await cartManager.createCart()           //Crea un nuevo carrito para el nuevo usuario
		let role


	let newUser = {
	first_name: profile.username,
	last_name: profile.username,
	email: profile._json.email,
    age: "1980",
	password: '',
	cart: cart,
	role: role
	}
	let result = await userModel.create(newUser)
	return done(null, result)
}
	return done(null, user)	//Mandamos esto si el usuario ya existe
}catch(error){
	console.log(error)
}
} ))
	passport.serializeUser(async (user, done)=> {
        done(null, user._id)
})
	passport.deserializeUser(async (id, done)=> {
	let user = await userModel.findOne({_id:id})
	done(null, user)
})
}

module.exports = {
	initPassportGithub
}