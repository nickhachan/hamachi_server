const admin= require('../admin/key')
const model= require('../model/food')
const foodDir=__dirname+'/../database/food.json'
const url =require('url')
let key="dsadsafcdvi2yvek13giu32@me12"
const rand=()=>Math.random(0).toString(36).substr(2);
const token=(length)=>(rand()+rand()+rand()+rand()).substr(0,length);
key=token(40)
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
                        food:e.map(e=>e.toObject()),
                        key:key
                    })
                }else{
                    res.redirect('http://'+req.headers.host)
                }
            })
    }
    post(req,res,next){
        let correct=true
        var ref = req.headers.referer;
        console.log(ref)
        if(!ref){
            res.send(403,"invalid")
            return
        }
        let u = url.parse(ref);
        let items= req.body
        if(u && u.hostname === 'localhost'&&req.body.fixKey==key){
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
                if(Array.isArray(items.json)){
                    model.collection.deleteMany({})
                    model.collection.insertMany(items.json)
                    .then(e=>{        
                        res.send('success')
                    })
                }
            }else{
                res.send("fail")
            }
        }else{
            res.send('fail')
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
