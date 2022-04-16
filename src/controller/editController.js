const admin= require('../admin/key')
const model= require('../model/food')
const foodDir=__dirname+'/../database/food.json'
const getFood= ()=>require(foodDir).list
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
        if(check(req)){
            res.render('edit',{
                food:getFood()
            })
        }else{
            res.redirect('http://'+req.headers.host)
        }
        // model.find({})
        //     .then(e=>{
        //         if(check(req)){
        //             res.render('edit',{
        //                 food:e.map(e=>e.toObject())
        //             })
        //         }else{
        //             res.redirect('http://'+req.headers.host)
        //         }
        //     })
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
            if(correct){
                if(Array.isArray(items.json))fs.writeFileSync(foodDir,JSON.stringify({list:items.json}))
                res.send('success')
            }else{
                res.send("fail")
            }
        }
    }
    get(req,res,next){
        if(req.headers.href.match(/$https:\/\/foodvilla.no/))res.send(JSON.stringify(getFood()))
    }
}
module.exports= new controller()
