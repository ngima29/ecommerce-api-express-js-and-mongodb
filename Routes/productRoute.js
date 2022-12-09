const express = require('express')
const { postProduct, productDetails, productList, deleteProduct, updateProduct } = require('../controllers/productController')
const router = express.Router()

const upload = require('../middleware/file-upload')
const { productValidation, validation } = require('../utils/Validator')


router.post('/postproduct', upload.single('product_image'),productValidation,validation, postProduct)

router.get('/productlist', productList)

router.get('/productdetails/:id', productDetails)


router.get('/deleteproduct/:id', deleteProduct)

router.get('/updateproduct/:id', updateProduct)




module.exports = router