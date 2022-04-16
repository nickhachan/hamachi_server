const mongoose = require('mongoose');
const uri="mongodb+srv://nickhachan:089695148@cluster0.7u4yy.mongodb.net/foodvilla-database?retryWrites=true&w=majority"

async function connectDB(){
    await mongoose.connect(uri);
    console.log('connect successfully')
}

module.exports= connectDB