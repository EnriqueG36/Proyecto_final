const { logger } = require("../config/logger")

//Logger que se usa en los routers

//middleware
const addLogger = (req, res, next) => {
	req.logger = logger
	req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
	next()

}

module.exports = { addLogger }