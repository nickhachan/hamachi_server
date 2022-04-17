window.onload=()=>{
    const $$= document.querySelectorAll.bind(document)
    const $= document.querySelector.bind(document)
    const form= $('form')
    const checkBox=$('.request')
    const menu=$('.menu')
    const history=[]
    const deleteBtn=()=>$$('.delete')
    const line=()=>[...$$('.line')].map(e=>({name:e,top:e.offsetTop}))
    const lineClone=()=>{
        let clone=renewedLine()[0].name.cloneNode()
        return clone
    }
    const reset=$('.reset')
    const denyBtn=$('.deny')
    const acceptBtn=$('.accept')
    const undo=$('.undo')
    const addHistory=()=>history.push({content:menu.innerHTML,pos:window.scrollY})
    function toggle(parent,classname){
        parent.classList.toggle(classname)
    }
    reset.onclick=e=>{
        if(history[0]){
            history.splice(1)
            let last= history[0]
            menu.innerHTML=last.content
            window.scrollTo(0,last.pos)
        }
    }
    undo.onclick=e=>{
        let last= history.pop()
        menu.innerHTML=last.content
        window.scrollTo(0,last.pos)
    }
    function getData(){
        let rawData= $$('.group:not(.clone)>.food:not(.clone) .need-check,.group:not(.clone)>.title')
        let data=[]
        let dataFormat={
            "title":"",
            "type":[]
        }
        let child=false
        let initFormat=()=>(JSON.parse(JSON.stringify(dataFormat)))
        let typeGroup={}
        for(var i of rawData){
            let type=i.dataset.type
            let content=i.innerHTML.trim()
            if(child){
                if(type=='title'){
                    data.push(child)
                    child=initFormat()
                    child.title=content
                }else if(type=='description'){
                    typeGroup[type]=content
                    child.type.push(typeGroup)
                    typeGroup={}
                }else{
                    typeGroup[type]=content
                }
            }else{
                    child=initFormat()
                    child.title=content
            }
        }
        data.push(child)
        return data
    }
    function validateData(data){
        return true
    }
    
    
    acceptBtn.onclick=()=>{
        let data= {json:getData(),key:$('#info').innerText}
        toggle(checkBox,'disappear')
        if(validateData(data)){
            fetch(window.location.href+'/post',{
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(data) // body data type must match "Content-Type" header
              })
        }
    }
    denyBtn.onclick=()=>{
        toggle(checkBox,'disappear')
    }
    form.onsubmit=async (e)=>{
        e.preventDefault()
        toggle(checkBox,'disappear')
    }
    function getClone(e){
        return [...e.parentNode.children].find(e=>e.className.includes('clone')).cloneNode(true)
    }
    function renewedLine(){
        let l=line()
        l.forEach(e=>{
            e.name.onclick=()=>{
                addHistory()
                let clone= getClone(e.name)
                e.name.classList.add('dis-line')
                clone.classList.remove('clone')
                e.name.insertAdjacentElement('beforebegin',lineClone())
                e.name.insertAdjacentElement('beforebegin',clone)
                renewedLine()
            }
        })
        $$('.need-check').forEach(e=>{
            e.onfocus=(e2)=>{
                e2.target.classList.add('changed')
                if(!e2.target.dataset.content)e2.target.dataset.content=e2.target.innerText
            }
            e.onblur=(e2)=>{
                if(e2.target.dataset.content==e2.target.innerText){
                    e2.target.classList.remove('changed')
                }else{
                    addHistory()
                }
            }
        })
        deleteBtn().forEach(e=>{
            e.onmouseenter=(e)=>{
                toggle(e.target.parentNode,'border')
            }
            e.onmouseleave=(e)=>{
                toggle(e.target.parentNode,'border')
    
            }
            e.onclick=(e)=>{
                toggle(e.target.parentNode,'border')
                addHistory()
                let parent=e.target.parentNode
                let parentFriends=[...parent.parentNode.children]
                let parentBestFriend=parentFriends[parentFriends.indexOf(parent)-1]
                parentBestFriend.remove()
                parent.remove()
            }
        })
        return l
    }
    menu.onmousemove=(e)=>{
        let pos= e.pageY
        let nearest
        let lineNode=renewedLine()
        for(var i of lineNode){
            let distance= Math.abs(i.top-pos)
            if(!nearest
            ||nearest.distance>distance)nearest={name:i.name,distance}
            i.name.classList.add('dis-line')
        }
        nearest.name.classList.remove('dis-line')
        
    }
}