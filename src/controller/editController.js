const admin= require('../admin/key')
const model= require('../model/food')
const foodDir=__dirname+'/../database/food.json'
const fs= require('fs')
function check(req){
    let info= req.body
    return Object.values(info).every(e=>antiHack(e))
        &&info.email==admin.email
        &&info.password==admin.password
}
function antiHack(e){
    return !/['"&`<>]/g.test(e)
}

class controller{
    index(req,res){
        model.find({})
            .then(e=>{
                if(check(req)){
                    res.render('edit',{
                        food:e.map(e=>e.toObject())
                    })
                }else{
                    res.redirect('http://'+req.headers.host)
                }
            })
    }
    post(req,res,next){
        if(check(req)){
            let items= req.body
            let correct=true
            if(items.json)for(var item of items.json){
                let children= item.type
                let checkList= children.map(e=>Object.values(e))
                checkList.push(item.title)
                if(!checkList.every(e=>antiHack(e))){
                    correct=false
                    break
                }
            }
            else{
                correct=false
            }
<<<<<<< HEAD
            if(correct){
                if(Array.isArray(items.json))fs.writeFileSync(foodDir,JSON.stringify({list:items.json}))
                res.send('success')
            }else{
                res.send("fail")
            }
=======
        }
        else{
            correct=false
        }
        if(correct){
            if(Array.isArray(items.json)){
                model.collection.deleteMany({})
                model.collection.insertMany(items.json)
                .then(e=>{        
                    res.send('success')
                })
            }
        }else{
            res.send("fail")
>>>>>>> e5b71aefd6df5cdba96c1627a6d54108844eeb32
        }
    }
    get(req,res){
        model.find({})
            .then(e=>{
                res.send(JSON.stringify(e))
            })
    }
}
module.exports= new controller()
