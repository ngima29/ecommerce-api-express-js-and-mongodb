require('dotenv').config() 
const express = require('express')
const app = express()  
var cors = require('cors')
require('./database/connection')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const userRoutes = require('./Routes/user.js')
const categoryRoutes = require('./Routes/categoryRoute.js')
const productRoutes = require('./Routes/productRoute.js')
const orderRoutes = require('./Routes/orderRoute.js')


app.use(cors())
// middle ware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/public/uploads', express.static('public/uploads'))
app.use(cookieParser())

// routes middleware
app.use('/api', userRoutes)
app.use('/category', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)

const port = process.env.PORT || 8000 





















// Running the server and displaying message
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

// to start the server goto cmd and type node server.js and the message should pop out

// get (retrive)
//  post (insert)
// patch put (edit)

