const mainRouter= require('./main')
const editRouter= require('./edit')
const express = require('express')
function route(app){
    app.use('/',mainRouter)
    app.use('/edit',editRouter)
}
module.exports=route