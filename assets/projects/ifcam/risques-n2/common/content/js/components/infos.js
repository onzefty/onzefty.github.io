// -> Moteur gestionnaire d'infos à display
// transition css utilisées pour les animations
// utilise jQuery pour les événements
function Infos(props){
    var defaultOptions = {
        buttons:[],
        infos:[],
        duration:0.8,
        delay:0.2,
        easing:"ease-out",
        cbEach:function(){},
        cbEachEnd:function(){},
        cbHide:function(){},
        cbEnd:function(){},
        cbReset:function(){},
        clickedClass:"clicked",
        activeClass:"active",
        inactiveClass:"inactive",
        hideClass:"hidden",
        infoHideClass:"hidden",
        hideButtons:false,
        noHiding:false,
        keepClickedClass:false,
        onlyOneInfoDisplayed:false,
        alreadyShown:null
    }
    this.options = Object.assign(defaultOptions, props);
    this.options.transitionsOut = this.getPropertiesArray("out",props.transitionsOut,this.options.infos.length);
    this.options.transitionsIn = this.getPropertiesArray("in",props.transitionsIn,this.options.infos.length);
    this.options.transitionsLinked = props.transitionsLinked ? this.getPropertiesArray("linked",props.transitionsLinked,this.options.infos.length) : null;

    this.infos = [];
    this.buttons = [];
    this.completed = false;

    this.handleClick = this.onClick.bind(this);
    this.handleTransitionEnd = this.onTransitionEnd.bind(this);

    this.init();
}

Infos.prototype = {
    getPropertiesArray: function(w,trans,length){
        var transDefaults = {
            "in":{opacity:0,scale:"0 0"},
            "out":{opacity:1,scale:"1 1"} 
        }
        var transitions = trans ? Array.isArray(trans) ? trans : Array(length).fill(trans) : null;
        var toCheck = Array.isArray(transitions);
        var arr = [];
        for(var p=1; p<=length; p++){
            if(toCheck && transitions[p-1]){
                arr.push(transitions[p-1]);
            } else {
                arr.push(transDefaults[w]); 
            }
        }
        return arr;
    },
    onClick: function(button,e){
        var info = this.infos[button.num-1];
        if(info.opened==true){
            if(this.options.keepClickedClass==false){
                button.removeClass(this.options.clickedClass)
            }
			if(this.options.noHiding==false){
				this.hide(info);
                this.options.cbHide(button.num);
			}
        } else {
            button.isSeen(this.options.clickedClass);
            button.removeClass(this.options.activeClass);
            if(this.options.hideButtons==true){
                button.addClass(this.options.hideClass);
            }
            this.show(info);
            this.options.cbEach(button.num);
        }
    },
    show: function(info){
        if(this.options.onlyOneInfoDisplayed==true){
            for(var i=1; i<=this.infos.length; i++){
                var inf = this.infos[i-1],
                button = this.buttons[i-1];
                if(inf.opened==true){
                    inf.hide();
                    if(this.options.keepClickedClass==false){
                        button.removeClass(this.options.clickedClass);
                    }
                }
                if(inf.opened==false && this.options.transitionsLinked){
                    inf.hide();
                }
            }
        }
        info.removeClass(this.options.infoHideClass);
        info.show();
        
    },
    hide: function(info){
        info.hide();
    },
    hideAll: function(){
        for(var i=1; i<=this.infos.length; i++){
            var info = this.infos[i-1],
            button = this.buttons[i-1];
            info.hide();
            if(this.options.keepClickedClass==false){
                button.removeClass(this.options.clickedClass);
            }
        }
    },
    onTransitionEnd: function(info,e){
        if(info.forceEnd==false){
            info.forceEnd = true;
            if(info.state=="in"){
                info.addClass(this.options.infoHideClass);
            }
            this.options.cbEachEnd(info);
            if(this.checkOpened()==true && this.completed==false){
               this.completed = true;
               this.options.cbEnd(); 
            }   
        }
    },
    checkOpened: function(){
        return (this.getInfoSeen()==this.buttons.length);
    },
    getInfoSeen:function(){
        var count = 0;
        for(var b=1; b<=this.buttons.length; b++){
            if(this.buttons[b-1].seen==true){
                count++;
            }
        }
        return count;
    },
    reset: function(){
        for(var b=1; b<=this.buttons.length; b++){
            var button = this.buttons[b-1],
            info = this.infos[b-1];

            info.hide();
            button.removeClass(this.options.hideClass);
            button.removeClass(this.options.clickedClass);
            button.addClass(this.options.activeClass);
            $(button.element).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,this.onClick.bind(this,button));

        }
        if(this.options.alreadyShown!=null){
            this.buttons[this.options.alreadyShown-1].addClass(this.options.clickedClass);
            this.show(this.infos[this.options.alreadyShown-1]);
        }
        this.completed = false;
        this.options.cbReset(); 
    },
    dispose: function(){
        for(var b=1; b<=this.options.buttons.length; b++){
            var button = this.options.buttons[b-1],
            info = this.options.infos[b-1];
            $(this.buttons[b-1].element).off(Constants.CLICK_TOUCH);
            info.removeEventListener("transitionend",this.onTransitionEnd.bind(this,this.infos[b-1]));
            info.removeEventListener("webkitTransitionEnd",this.onTransitionEnd.bind(this,this.infos[b-1]));
        }
    },
    init: function(){
        var self = this;
        for(var b=1; b<=this.options.buttons.length; b++){
            var button = this.options.buttons[b-1],
            info = this.options.infos[b-1];

            this.buttons.push(new InfoButton({
                element:button,
                num:b,
            }));
            this.buttons[b-1].removeClass(this.options.hideClass);
            this.buttons[b-1].removeClass(this.options.clickedClass);
            this.buttons[b-1].addClass(this.options.activeClass);
            $(this.buttons[b-1].element).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,this.onClick.bind(this,this.buttons[b-1]));

            this.infos.push(new InfoDisplay({
                elements: info instanceof HTMLElement ? [info] : info,
                num:b,
                transitionsIn:this.options.transitionsIn[b-1],
                transitionsOut:this.options.transitionsOut[b-1],
                transitionsLinked:Array.isArray(this.options.transitionsLinked)?this.options.transitionsLinked[b-1]:null,
            }));

            this.infos[b-1].addClass(this.options.infoHideClass);
            this.infos[b-1].setValue("in");
            this.infos[b-1].elements.forEach(function(element,index){
                element.style["transition-property"] = Object.keys(self.options.transitionsIn[b-1]).join(",");
                element.style["transition-delay"] = (index*self.options.delay)+"s";
                element.style["transition-duration"] = self.options.duration+"s";
                //info.style["pointer-events"] = "none";
                element.removeEventListener("transitionend",self.onTransitionEnd.bind(self,self.infos[b-1]));
                element.removeEventListener("webkitTransitionEnd",self.onTransitionEnd.bind(self,self.infos[b-1]));
                element.addEventListener("transitionend",self.onTransitionEnd.bind(self,self.infos[b-1]));
                element.addEventListener("webkitTransitionEnd",self.onTransitionEnd.bind(self,self.infos[b-1])); 
            })
            
        }

        if(this.options.alreadyShown!=null){
            this.buttons[this.options.alreadyShown-1].addClass(this.options.clickedClass);
            this.show(this.infos[this.options.alreadyShown-1]);
        }
    }
}

function InfoDisplay(props){
    this.elements = props.elements;
    this.num = props.num;
    this.transitionsIn = props.transitionsIn;
    this.transitionsOut = props.transitionsOut;
    this.transitionsLinked = props.transitionsLinked;
    this.forceEnd = false;
    this.opened = false;
    this.state = "in";
}

InfoDisplay.prototype = {
    setValue:function(w){
        var props = w == "out" ? this.transitionsOut : w=="in" ? this.transitionsIn : this.transitionsLinked;
        for(var t in props){
            this.elements.forEach(function(element){
                element.style[t] = props[t];
            })
        }
    },
    show: function(){
        this.opened = true;
        this.state = "out";
        this.forceEnd = false;
        this.elements.forEach(function(element){
            element.setAttribute("state","out");
        })
        this.setValue("out");
    },
    hide: function(){
        this.opened = false;
        this.state = "in";
        this.forceEnd = false;
        this.elements.forEach(function(element){
            element.setAttribute("state","in");
        })
        this.setValue(this.transitionsLinked?"linked":"in");
    },
    addClass:function(cl){
        this.elements.forEach(function(element){
            element.classList.add(cl);
        })
    },
    removeClass:function(cl){
        this.elements.forEach(function(element){
            element.classList.remove(cl);
        })
    }
}

function InfoButton(props){
    this.element = props.element;
    this.num = props.num;
    this.seen = false;
}

InfoButton.prototype = {
    isSeen:function(cl){
        this.seen = true;
        this.addClass(cl);
    },
    addClass:function(cl){
        this.element.classList.add(cl);
    },
    removeClass:function(cl){
        this.element.classList.remove(cl);
    }
}