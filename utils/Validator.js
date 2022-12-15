const {check, validationResult} = require('express-validator')

exports.categoryValidation=[
    check('category_name','Category name must be required ').notEmpty()
    .isLength({min:3})
    .withMessage("category name must be atleast 3 characher")
]


exports.productValidation=[
    check('product_name','product name must be required ').notEmpty()
    .isLength({min:3})
    .withMessage("product name must be atleast 3 characher"),
    check('product_price','product price is required').notEmpty()
    .isNumeric().withMessage('price must be Numeric value'),
    check('countInStick','stock quantity is required').notEmpty()
    .isNumeric().withMessage('stock quantity must be Numeric value'),
    check('product_description','product description must be required ').notEmpty()
    .isLength({min:3})
    .withMessage("product description must be atleast 30 characher"),
    check('category','category is required').notEmpty()
]


exports.userValidation=[
    check('name',' name must be required ').notEmpty()
    .isLength({min:3})
    .withMessage("name must be of at least 2 charachter  "),
    check('email',' email must be required ').notEmpty()
    .isEmail().withMessage("email formate incorrest"),
    check('username',' username must be required ').notEmpty()
    .isLength({min:3})
    .withMessage("username must be of at least 3 charachter  "),
    check('password',' password must be required ').notEmpty()
    .matches(/[a-z]/)
    .withMessage("password  must contain at least one lowercase letter ")
    .matches(/[A-Z]/)
    .withMessage("password  must contain at least one uppercase letter ")
    .matches(/[0-9]/)
    .withMessage("password  must contain at least one numeric character ")
    .matches(/[@$#%-*/!]/)
    .withMessage("password  must contain at least one special character  ")
    .isLength({min:8})
    .withMessage("password  must be 8 characters ")

]

exports.passwordValidation=[
    check('password',' password must be required ').notEmpty()
    .matches(/[a-z]/)
    .withMessage("password  must contain at least one lowercase letter ")
    .matches(/[A-Z]/)
    .withMessage("password  must contain at least one uppercase letter ")
    .matches(/[0-9]/)
    .withMessage("password  must contain at least one numeric character ")
    .matches(/[@$#%-*/!]/)
    .withMessage("password  must contain at least one special character  ")
    .isLength({min:8})
    .withMessage("password  must be 8 characters ")

]

exports.validation=(req,res,next)=>{
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }else{
        return res.status(400).json({error:errors.array()[0].msg})
    }
}