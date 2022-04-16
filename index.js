const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const route= require('./src/route/router')
const hbs= require('express-handlebars')
const path= require('path')
const connection= require('./src/mongodb/connection')

//connection()

app.use('/src',express.static(path.join(__dirname,'src','public')))

app.engine('hbs',hbs.engine({
    extname:".hbs"
}))
app.set('view engine','hbs')
app.set('views','./src/views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
route(app)

app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))