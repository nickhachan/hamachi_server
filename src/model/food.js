const {Schema,model} = require("mongoose");

const schema= new Schema({
    title:String,
    type:[
        {
            name:String,
            price:Number,
            description:String
        }
    ],
    _id:Number
})
module.exports= model('food', schema);