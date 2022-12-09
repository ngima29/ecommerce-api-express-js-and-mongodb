const express = require('express')
const { postCategory, categoryList, categoryDetails, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { categoryValidation, validation } = require('../utils/Validator')
const router = express.Router()


router.post('/', categoryValidation,validation, postCategory)
router.get('/', categoryList)

router.get('/:id', categoryDetails)

router.route('/updateCategory/:id',categoryValidation,validation, updateCategory)

router.delete('/:id', deleteCategory)

module.exports = router