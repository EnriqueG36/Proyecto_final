function sessionMiddleware(req, res, next) {
	if (req.session.user.role == "user"){
	return res.status(401).send("Error de autenticacion")
	}
	next()		//los middlewares necesitan llevar next() o se quedan atorado ahi, cargando infinitamente
}

module.exports =  { sessionMiddleware }                                      //Importamos la funcion auth