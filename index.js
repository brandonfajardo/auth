const express = require('express')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')

require('./services/passport')

mongoose.connect(keys.mongoURI)

const app = express()
app.use(bodyParser.json())
app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey] }))
app.use(passport.initialize())
app.use(passport.session())

require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)

if (process.env.NODE_ENV === 'production'){
    // look here first 
    app.use(express.static('client/build'))
    // then here 
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve__dirname, 'client', 'build', 'index.html')
    })
}

const PORT = process.env.PORT || 5000 // process.env.PORT is for production... 5000 is for dev
app.listen(PORT, () => {
    console.log('Express server is running')
})