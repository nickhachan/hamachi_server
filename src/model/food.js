const {Schema,model} = require("mongoose");

const schema= new Schema({
    title:String,
    type:[
        {
            name:String,
            price:String,
            offer:String,
            description:String,
            _id:String,
        }
    ],
    _id:Number
})
module.exports= model('food', schema);