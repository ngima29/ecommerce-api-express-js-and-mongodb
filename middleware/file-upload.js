const multer = require('multer')



// folder read garna ko lagi fs
const fs = require('fs')


// file ko property read garna lai path
const path = require('path')



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let fileDestination = 'public/uploads/'

        // check if the directory exist
        if (!fs.existsSync(fileDestination)) {
            // recursive le chai parent ra child dutai folder banauxa
            fs.mkdirSync(fileDestination, { recursive: true })
            callback(null, fileDestination)
        }
        else {
            callback(null, fileDestination)
        }
    },
    filename: (req, file, callback) => {
        let fileName = path.basename(file.originalname, path.extname(file.originalname))
        // abc.jpg
        // .jpg
        // path.basename(abc.jpg,.jpg)
        // abc matra dinxa mathi ko path.basename le


        let ext = path.extname(file.originalname)
        // else hamilai .jpg dinxa


        callback(null, fileName + '_' + Date.now() + ext)
    }
})





// image filtering
let imageFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg|jfif|gif|JPG|JPEG|PNG|SVG|JFIF|GIF)$/)) {
        return callback(new Error('You can upload image files only'), false)
    }
    else {
        return callback(null, true)
    }
}





// uploading

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2000000 //2MB
    }
})

module.exports = upload