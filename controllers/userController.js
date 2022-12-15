require('dotenv').config() 
const User = require('../models/authModel')
const Token = require('../models/token')
const sendEmail = require('../utils/setEmail')
const crypto = require('crypto')
const jwt = require('jsonwebtoken') // authuntication
const {expressjwt}  = require("express-jwt")
// to register user
exports.userRegister = async (req, res) => {
	
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    })
	
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: 'something went wrong' })
    }

    let token = new Token({
        token:crypto.randomBytes(16).toString('hex'),
        userId:user._id
    })
    token= await token.save()
    if(!token){
        return res.status(400).json({ error: 'something went wrong' })
    }

    const c_url = `${process.env.CLIENT_URL}/emailconfirmation/${token.token}`
    //send email
    sendEmail({
        from:process.env.SMTP_USER,
        to:user.email,
        subject:"email varification link",
       // text:`hello, \n\n please verify your account by cliking below link below:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`
        html:`<a href='${c_url}'> verify email </a>`
        })
    if(sendEmail){
        console.log("email send");
    }
    res.send(user)
}
//confirming 
exports.postEmailVerification = (req,res)=>{
Token.findOne({token:req.params.token},(error,token)=>{
    if(error || !token){
        return res.status(400).json({ error: 'invalid token or token may have exprire' })
    }

    User.findOne({_id:token.userId},(error,user)=>{
        if(error || !user){
            return res.status(400).json({ error: 'not found valid user for this token' })

        }
        // check if the user is already verified
        if(user.isVerified){
            return res.status(400).json({ error: 'this email is already varefied' })
        }

        /// save the varified user
        user.isVerified = true
        user.save((error)=>{
            if(error){
                return res.status(400).json({ error: error })
            }
            res.json({message:"congraturalation your email has been varified"})
        })
    })


})
}

// resend email verification  link
exports.resendVerificationLink= async(req,res)=>{
    // at first find out the register user

    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({ error: 'sorry the email you provieded not found  please register first or try anaoatrher' })
    }
// check if user is already verified
 if(user.isVerified){
    return res.status(400).json({ error: 'this email is already varefied' })
 }

 let token = new Token({
    token:crypto.randomBytes(16).toString('hex'),
    userId:user._id
})

   token= await token.save()
    if(!token){
        return res.status(400).json({ error: 'something went wrong' })
    }
    //send email
    sendEmail({
        from:"no-reply@expresscommerce.com",
        to:user.email,
        subject:"email varification link",
        text:`hello, \n\n please verify your account by cliking below link below Link:\n\n http:\/\/${req.headers.host}\/api\/confirmation\/${token.token}`

    })
    res.json({message: ' verification link has been sent'})
}

// signin process

exports.Signing = async (req,res)=>{
    const{email,password}= req.body
    // first check email is register or not 
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({ error: 'sorry the email you provieded not found  please register first or try anaoatrher' })
    }  
    // if emaial found then check password
    if(!user.authenticate(password)){
        return res.status(401).json({error:"email or password doesnot match"})
    }
    // check i=f user is verified
    if(!user.isVerified){
        return res.status(400).json({error:"verify your email first to continue"})
    }
    //now generate token with user id  an jwt secret
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
    //store token in cookie
    res.cookie('myCookie',token,{expire:Date.now()+99999})
    // return user information to frontend
    const {_id,name,role}= user
    return res.json({token,user:{_id,name,email,role}})
    

}


//// send password rest link
exports.forgetPassword= async(req,res)=>{
    // at first find out the register user

    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({ error: 'sorry the email you provieded not found  please register first or try anaoatrher' })
    }
// check if user is already verified
 if(user.isVerified){
    return res.status(400).json({ error: 'this email is already varefied' })
 }

 let token = new Token({
    token:crypto.randomBytes(16).toString('hex'),
    userId:user._id
})

   token= await token.save()
    if(!token){
        return res.status(400).json({ error: 'something went wrong' })
    }

    const c_url = `${process.env.CLIENT_URL}/resetpassword/${token.token}`
    //send email
    sendEmail({
        from:"no-reply@expresscommerce.com",
        to:user.email,
        subject:"reset password  link",
        text:`hello, \n\n please reste  your password by cliking below link below Link:\n\n http:\/\/${req.headers.host}\/api\/resetpassword\/${token.token}`,
        html:`<a href='${c_url}'  >Click here to Reset Password </a>`
    })
    res.json({message: ' password reset link has been sent'})
}


/// reset password

exports.resetPassword = async (req,res)=>{
   let token = await Token.findOne({token:req.params.token})
        if( !token){
            return res.status(400).json({ error: 'invalid token or token may have exprire' })
        }

    
    let user = await user.findOne({_id:token.userId})
       if(!user){
           return res.status(400).json({ error: 'invalid user for this token ' })
        }
    user.password= req.body.password
    user = await user.save()
    if(!user){
        return res.status(400).json({ error: 'failed to reset password ' })
    }
    res.json({message:"password has been rest"})
}

// signout
exports.signout=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:'signout sucess'})
}

// user list

exports.userList = async (req,res)=>{
    const user = await User.find().select('-hashed_password -salt')
    if(!user){
        return res.status(400).json({ error: 'something went wrong ' })
    }
    res.send(user)
}

// single user

exports.singleUserView = async(req,res)=>{
    const {_id}= req.params
    const user = await User.findById({_id:id}).select('-hashed_password -salt')
    if(!user){
        return res.status(400).json({ error: 'something went wrong ' })
    }
    res.send(user)
}


// require signin
exports.requireSignin = expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:"auth"
})