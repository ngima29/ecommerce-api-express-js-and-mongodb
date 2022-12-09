const mongoose = require('mongoose')


// to connect to the database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('database connected'))
    .catch(err => console.log(err))