//MIddleware que valida los dato de usuario introducidos en el login

function auth(req, res, next) {

	if(!req.session.user){return res.send({Status: "Error", Message: "No ha iniciado sesion"})}

	if (req.session.user.role !== "admin"){
	return res.status(401).send({Status: "Error", Message: "Error de autorización"})
	} 

	
	
	next()		//los middlewares necesitan llevar next()
}

module.exports =  { auth }                                      //Importamos la funcion auth

/*
function auth(req, res, next) {
	if (req.session.user !== "Enrique" || !req.session.admin ){
	return res.status(401).send("Error de autenticacion")
	}
	next()		//los middlewares necesitan llevar next() o se quedan atorado ahi, cargando infinitamente
}

module.exports =  { auth }                                      //Importamos la funcion auth
*/