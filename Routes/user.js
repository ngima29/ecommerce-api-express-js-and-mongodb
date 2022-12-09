const express = require('express')
const { userRegister, postEmailVerification,resendVerificationLink, Signing, forgetPassword, resetPassword, signout, userList, singleUserView, requireSignin } = require('../controllers/userController')
const { userValidation, validation } = require('../utils/Validator')
const router = express.Router()

// router.get('/', test)
router.post('/register',userValidation,validation ,userRegister)
router.post('/confirmation/:token',postEmailVerification)
router.post('/resendEmailVerification',resendVerificationLink)
router.post('/signin',Signing)
router.post('/forgetpassword',forgetPassword)
router.put('/resetpassword/:token',resetPassword)
router.post('/signout',signout)
router.get('/userlist', requireSignin, userList)
router.get('/singleuser/:_id',singleUserView)

module.exports = router


