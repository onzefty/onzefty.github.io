(function (win) {
    var STATICS = {
        GLOSSARY_OPEN: {
            get: function () {
                return 'Glossary.menuOpen';
            }
        },
        GLOSSARY_UPDATE: {
            get: function () {
                return 'Glossary.update';
            } 
        },
        GLOSSARY_SHOW: {
            get: function () {
                return 'Glossary.show';
            } 
        },
        GLOSSARY_HIDE: {
            get: function () {
                return 'Glossary.hide';
            } 
        }
    };

    setStatic(STATICS, Glossary);

    function Glossary(){
    	this.element = document.querySelector("#glossary");
        this.titleEl = this.element.querySelector("#glossary-title");
        this.buttonClose = this.element.querySelector("#glossary-button-close");
        this.wordsList = this.element.querySelector("#glossary-words");
        this.definitionTitleEl = this.element.querySelector("#glossary-definition-word");
        this.definitionContent = this.element.querySelector("#glossary-definition");

        this.boundHandleHide = this.handleHide.bind(this);

        this.language = null;
        this.state = "closed";
        this.disabled = false;
        this.words = [];
        this.word;

    	this.addEvents();
    }

    Glossary.prototype = {
    	addEvents:function(){
            this.buttonClose.addEventListener(Constants.CLICK_TOUCH, this.boundHandleHide);
    	},
        addWords:function(words,definitions){
            this.wordsList.innerHTML = ""
            this.words = [];
            for(var propWord in words){
                var num = propWord.match(/\d/g).join(""),
                element = document.createElement("divs"),
                defs = {};

                for(var propDefinition in definitions){
                    if(propDefinition.indexOf("definition-"+num+"-")!=-1){
                        defs[propDefinition] = definitions[propDefinition];
                    }
                }

                element.id = "glossary-word-"+num;
                element.className = "word Roboto-Regular relative";
                element.innerHTML = "<p class='"+propWord+"'></p>";

                this.wordsList.appendChild(element);

                this.words.push(new Word({
                    element:element,
                    num:num,
                    key:propWord,
                    word:words[propWord],
                    definitions:defs
                }));

                element.addEventListener(Constants.CLICK_TOUCH, this.displayDefinition.bind(this,this.words[num-1]));
            }
        },
        getWord(word){
            for(var w=1; w<=this.words.length; w++){
                if(typeof word == "string"){
                    if(this.words[w-1].key==word){
                        return this.words[w-1];
                    }
                }
                else if (typeof word == "number"){
                    if(this.words[w-1].num==word){
                        return this.words[w-1];
                    }
                }  
            }
            return null;
        },
        displayDefinition:function(w){
            var word = typeof w == "string" ? this.getWord(w) : w,
            selectedEl = this.wordsList.querySelector(".selected");
            if(selectedEl){
                selectedEl.classList.remove("selected");
            }
            word.element.classList.add("selected");
            
            this.definitionTitleEl.innerHTML = word.word;
            this.definitionTitleEl.setAttribute("json",word.key);
            this.definitionContent.innerHTML = word.content;
        },
    	update:function(datas){
            if(datas.title){
                this.titleEl.innerHTML = datas.title;
            }
            if(datas.words && datas.definitions){
                this.addWords(datas.words,datas.definitions);
                this.render(datas.words);
                this.render(datas.definitions);
            }
            if(datas.word){
                this.displayDefinition(datas.word);
            }
    	},
        render:function(datas){
            for(var prop in datas){
                var el = this.element.querySelector("."+prop),
                word = this.getWord(prop);
                if(el){
                    el.innerHTML = datas[prop];
                }
                if(word){
                    word.word = datas[prop];
                }
            }
        },
        handleHide:function(){
            this.emit(Glossary.HIDE);
    	},
        hide:function(cb,animated){
            if(this.disabled==false){
                if(animated){
                    this.disabled = true;
                    animate({
                        element:this.element,
                        duration:1000,
                        easing:"outExpo",
                        properties:{
                            translateY:"40%",
                            opacity:0
                        },
                        end:function(){
                            cb();
                            this.disabled = false;
                            this.state = "closed";
                        }.bind(this)
                    });
                } else {
                    this.disabled = false;
                    this.state = "closed";
                    this.element.style["translate"] = "0% 40%";
                    this.element.style["opacity"] = 0;
                    cb();
                }    
            }
            
        },
        show:function(animated){
            if(this.disabled==false){
                if(animated){
                    this.disabled = true;
                    this.element.style["translate"] = "0% 40%";
                    this.element.style["opacity"] = 0;
                    animate({
                        element:this.element,
                        duration:1000,
                        easing:"outBack",
                        properties:{
                            translateY:"0%",
                            opacity:1
                        },
                        end:function(){
                            this.disabled = false;
                            this.state = "opened";
                        }.bind(this)
                    });
                } else {
                    this.disabled = false;
                    this.state = "opened";
                    this.element.style["translate"] = "";
                    this.element.style["opacity"] = "";
                }    
            }
            
        }
    };

    function Word(props){
        this.element = props.element;
        this.num = props.num;
        this.word = props.word;
        this.key = props.key;
        this.definitions = props.definitions;
        this.content = "";

        this.init();
    }

    Word.prototype = {
        init:function(){
            var propPrev = "";
            for(var prop in this.definitions){
                var definition = this.definitions[prop];
                var isList = prop.indexOf("-list")!=-1;
                var isListSub = prop.indexOf("-list-sub")!=-1;
                var isGrid = prop.indexOf("grid")!=-1;
                if(isListSub==true){
                    if(propPrev.indexOf("-list-sub")==-1){
                        this.content += "<ul>";
                    }
                    this.content += "<li class='"+prop+"'>"+definition+"</li>";
                }
                else if(isList==true){
                    if(propPrev.indexOf("list")==-1){
                        this.content += "<ul>";
                    }
                    else if(propPrev.indexOf("list-sub")!=-1){
                        this.content += "</ul>";
                    }
                    this.content += "<li class='"+prop+"'>"+definition+"</li>";
                } else if(isGrid==true){
                    if(propPrev.indexOf("grid")==-1){
                        this.content += "<div class='grid'>";
                    }
                    this.content += "<div class='"+prop+"'>"+definition+"</div>";
                } else {
                    if(propPrev.indexOf("list")!=-1){
                        this.content += "</ul>";
                    }
                    if(propPrev.indexOf("grid")!=-1){
                        this.content += "</div>";
                    }
                    this.content += "<p class='"+prop+"'>"+definition+"</p>";
                }
                propPrev = prop;
            }
        }
    };

    mix(Glossary, EmitterMixin);
    win.Glossary = Glossary;
})(window);
