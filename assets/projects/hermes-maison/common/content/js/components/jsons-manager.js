export default class JsonsManager {
    constructor(){
        this.jsons = new Map();
        this.loading = false    
    }
    async load(jsons){
        if(this.loading){
            return false
        }
        this.loading = true
        const promises = []
        const array = !Array.isArray(jsons) ? [jsons] : jsons
        array.forEach((url) => {
            promises.push(
                fetch(url,{method:"GET"}).then((data) => {
                    return data.json();
                }).then((json) => {
                    for(var prop in json){
                        this.jsons.set(prop,json[prop])
                    }
                    return json;
                })
            )
        })
        return Promise.all(promises).then(() => {
            this.loading = false
        })
    }
    get(str){
        if(typeof str === "string"){
            return this.jsons.get(str)
        } else {
            const obj = new Map()
            const reg = new RegExp(str, "g");
            for(const [key,value] of this.jsons){
                const match = key.match(reg);
                if(match!=null){
                    obj.set(key,value)
                }
            }
            return obj   
        }
    }
}