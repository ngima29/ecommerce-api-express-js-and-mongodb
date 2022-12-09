const mongoose = require('mongoose');
const uuidv1 = require('uuidv1')//package that is used to generate random string
const crypto = require('crypto')

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    },
    hashed_password: {
        type: String,
        required: true,
    },
    salt: String,//to generate random string while hashing
    isVerified: {
        type: Boolean,
        default: false
    }



}, { timestamps: true })

// Virtual fields
authSchema.virtual('password')

    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)  //encryptPassword is user defined function
    })
    .get(function () {
        return this._password
    })


// defining methods
authSchema.methods = {
    encryptPassword: function (password) {
        if (!password) {
            return ''
        } else {
            try {
                return crypto
                    .createHmac('sha1', this.salt)  //sha1 vaneko algorithm ho hashing garne bela
                    .update(password)
                    .digest('hex')
            } catch (err) {
                return ''
            }
        }
    },
    authenticate:function(plainText){
        return this.encryptPassword(plainText)===this.hashed_password
    }

}

module.exports = mongoose.model('User', authSchema)