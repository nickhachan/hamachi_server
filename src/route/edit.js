const express = require("express");
const router= express.Router()
const controller= require('../controller/editController')


router.post('/post',controller.post)
router.post('/',controller.index)

module.exports=router
