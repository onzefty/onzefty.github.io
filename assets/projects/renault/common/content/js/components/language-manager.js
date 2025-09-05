function LanguageManager(props){
    this.language = typeof props.language === "string" ? props.language : "fr";
    this.languages = Array.isArray(props.languages) ? props.languages : [this.language];
    this.wrapEl = props.wrapEl instanceof HTMLElement ? props.wrapEl : document;
    this.jsonURL = typeof props.jsonURL === "string" ? props.jsonURL : "";
    this.jsonObj = {};
    this.loaded = false;
    this.onCustomSwitchLanguage = props.onCustomSwitchLanguage != undefined && typeof props.onCustomSwitchLanguage == "function" ? props.onCustomSwitchLanguage : function(){};
}

LanguageManager.prototype = {
    loadJSON: function(url,onSuccess,onError){
        var self = this;
        this.loaded = false;
        return fetch(url,{method:"GET"}).then(function(data){
            return data.json();
        }).then(function(json){
            self.loaded = true;
            self.jsonObj=JSON.parse(JSON.stringify(json));
            return json;
        });
    },
    setLanguage: function(props){
        var defaults = {
            callback:function(){},
            language:null
        }
        var options = Object.assign(defaults,props);
        if(options.language==this.language){
            return;
        }
        if(this.hasLanguage(options.language)==true){
            this.language = options.language;
        }
        this.loadJSON(this.jsonURL+this.language+".json").then(function(json){
            options.callback.call();
        });
    },
    render:function(){
        this.insertAllTextsFromJSON();
        this.onCustomSwitchLanguage();
    },
    getLanguage: function(){
        if (navigator.browserLanguage) {
            return navigator.browserLanguage.split('-')[0];    
        }
        else{
            return navigator.language.split('-')[0];
        }
    },
    hasLanguage: function(l){
        if(typeof l === "string" && this.languages.indexOf(l)!=-1){
            return true;
        }
        return false;
    },
    switchLanguage: function(l){
        if(this.hasLanguage(l)){
            this.setLanguage({language:l});
        } else {
            var index = this.languages.indexOf(this.language),
            len = this.languages.length,
            newIndex = index==(len-1) ? 0 : index+1,
            language = this.languages[newIndex];
            this.setLanguage({language:language});
        }
    },
    insertAllTextsFromJSON: function(wrap){
        function injectContent(el,prop,content){
            if(props.indexOf("href-")!=-1){
                el.setAttribute("href",content);
            }
            else if(prop.indexOf("src-")!=-1){
                el.src = content;
            } else {
                var matches = content.match(/<.*?>/g);
                if(matches){
                    for(var t=1; t<=matches.length; t++){
                        var match = matches[t-1];
                        if(match.indexOf("<br>")!=-1){
                            continue;
                        }
                        var hasId = match.match(/id\(.*?\)/);
                        var hasClass = match.match(/class\(.*?\)/);
                        var id = hasId ? hasId[0].match(/\(.*?\)/).join("").replace(/\(|\)/g,"") : "";
                        var cl = hasClass ? hasClass[0].match(/\(.*?\)/).join("").replace(/\(|\)/g,"") : "";
                        var replacement = "<div id='"+id+"' class='"+cl+"'></div>"
                        content = content.replace(matches[t-1],replacement);
                    }
                }
                el.innerHTML = content; 
            }
        }

        for(var props in this.jsonObj){
            var txt = this.jsonObj[props];
            //Par classe
            var elems = this.wrapEl.querySelectorAll("."+props); 
            for(var e=1; e<=elems.length; e++){
                var elem = elems[e-1];
                injectContent(elem,props,txt);
            }
            //Par attribut
            var els = this.wrapEl.querySelectorAll('[json='+props+']');
            for(var a=1; a<=els.length; a++){
                var el = els[a-1];
                injectContent(el,props,txt);
            } 
        }
    },
    insertTextFromJSON: function(elem,txt){
        if(elem!=null && txt!=null){
            var content = elem.tagName == "DIV" ? "<p style='margin:0;'>"+txt+"</p>" : txt;
            elem.innerHTML = content;
        }
    },
    getTextFromJSON: function(id){
        if(this.jsonObj[id]!=undefined){
            return this.jsonObj[id];
        }
    },
    getTextsFromJSON: function(str){
        var obj = {}
        var cloned = Object.assign({},this.jsonObj);
        var reg = new RegExp(str, "g");

        for(var prop in this.jsonObj){
            var match = prop.match(reg);
            if(match!=null){
                obj[prop] = cloned[prop];
            }
        }

        return obj;
    }
}