(function (win) {
    var STATICS = {
        MENU_OPEN: {
            get: function () {
                return 'Menu.menuOpen';
            }
        },
        MENU_UPDATE: {
            get: function () {
                return 'Menu.update';
            } 
        },
        MENU_SHOW: {
            get: function () {
                return 'Menu.show';
            } 
        },
        MENU_HIDE: {
            get: function () {
                return 'Menu.hide';
            } 
        },
        MENU_OFF: {
            get: function () {
                return 'Menu.off';
            } 
        },
        MENU_ON: {
            get: function () {
                return 'Menu.on';
            } 
        },
        OPEN_PART: {
            get: function () {
                return 'Menu.openPart';
            },
        },
        OPEN_GLOSSARY: {
            get: function () {
                return 'Menu.openGlossary';
            },
        },
        SWITCH_LANGUAGE: {
            get: function () {
                return 'Menu.switchLanguage';
            },
        },
    };

    setStatic(STATICS, Menu);

    function Menu(){
    	this.element = document.querySelector("#menu");
        this.languagesEl = this.element.querySelector("#menu-languages");
        this.buttonLanguageEls = this.element.querySelectorAll(".button-language");
        this.partEls = this.element.querySelectorAll(".menu-part");
        this.glossaryEl = this.element.querySelector("#menu-row-3");

        this.boundHandleOpenPart = this.handleOpenPart.bind(this);
        this.boundHandleSwitchLanguage = this.handleSwitchLanguage.bind(this);
        this.boundHandleOpenGlossary = this.handleOpenGlossary.bind(this);

        this.language = null;
        this.state = "closed";
        this.disabled = false;

    	this.addEvents();
    }

    Menu.prototype = {
    	addEvents:function(){
            for(var b=1; b<=this.buttonLanguageEls.length; b++){
                var buttonLanguageEl = this.buttonLanguageEls[b-1];
                buttonLanguageEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleSwitchLanguage);
            }
            for(var p=1; p<=this.partEls.length; p++){
                var partEl = this.partEls[p-1];
                partEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleOpenPart);
            }
            this.glossaryEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleOpenGlossary);
    	},
        render: function(){
            for(var p=1; p<=this.partEls.length; p++){
                var partEl = this.partEls[p-1];
                partEl.classList.remove("locked");
                // if(ofp.player.files[p-1].status=="na"){
                //     partEl.classList.add("locked");
                // } else {
                //     partEl.classList.remove("locked");
                // }
            }
        },
        handleOpenPart:function(e){
            var id = e.currentTarget.getAttribute("part");
            this.emit(Menu.OPEN_PART,id);
        },
        handleOpenGlossary:function(e){
            this.emit(Menu.OPEN_GLOSSARY);
        },
        handleSwitchLanguage:function(e){
            this.language = e.currentTarget.getAttribute("language");
            this.emit(Menu.SWITCH_LANGUAGE);
        },
    	update:function(datas){
            if(datas.texts){
                for(var prop in datas.texts){
                    var el = this.element.querySelector("."+prop);
                    if(el){
                        el.innerHTML = datas.texts[prop];
                    }
                }
            }
            if(datas.languageSelection === false){
                this.languagesEl.style.display = "none"
            }
            if(datas.language){
                this.language = datas.language;
                var selectedEl = this.element.querySelector(".selected");
                if(selectedEl){
                    selectedEl.classList.remove("selected");
                }
                for(var b=1; b<=this.buttonLanguageEls.length; b++){
                    var buttonLanguageEl = this.buttonLanguageEls[b-1],
                    language = buttonLanguageEl.getAttribute("language");
                    if(datas.language==language){
                        buttonLanguageEl.classList.add("selected");
                    }
                }
            }
    	},
        handlePrev:function(){
            this.emit(Menu.PREVIOUS_CLICKED);
    	},
    	handleNext:function(){
    		this.emit(Menu.NEXT_CLICKED);
    	},
        handleMenu:function(){

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
                this.render();
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

    mix(Menu, EmitterMixin);
    win.Menu = Menu;
})(window);
