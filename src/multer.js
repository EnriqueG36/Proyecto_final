const multer = require('multer')

const storage = multer.diskStorage({

    destination: function(req, file, cb){
        //Distinguir entre los diferentes campos del formulario cambia la ubicacion donde
        //se alojarán los diferentes archivos
        if(file.mimetype == 'text/plain') {                                 //Si se recibe un txt

        cb(null, `${__dirname}/public/uploads/documents`)
        }

        else if (file.mimetype == 'image/jpeg') {                           //si se recibe una imagen

            cb(null, `${__dirname}/public/uploads/profile`)
        }

        else if (file.fieldname == 'product') {

            cb(null, `${__dirname}/public/uploads/products`)
        }


    },

    filename: function(req, file, cb){
        console.log ('file: ', file)
        cb(null, `${Date.now()}-${file.originalname}`)
    }

})

const uploader = multer({
    storage,
    onError: function(err, next){
        console.log(err)
        next()
    }
})

module.exports = {uploader}