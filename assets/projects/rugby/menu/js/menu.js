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
        }
    };

    setStatic(STATICS, Menu);

    function Menu(){
    	this.element = document.querySelector("#menu");
        this.backgroundEl = document.querySelector("#menu-backgrounds");
        this.partEls = this.element.querySelectorAll(".menu-part");
        this.dateEndEl = this.element.querySelector(".battle-date-end");
        this.imgDefault = this.element.querySelector("#menu-characters");
        this.avatarEl = this.element.querySelector("#menu-avatar");

        this.boundHandleOpenPart = this.handleOpenPart.bind(this);

        this.state = "closed";
        this.disabled = false;

    	//this.addEvents();
    }

    Menu.prototype = {
    	addEvents:function(){
            for(var p=1; p<=this.partEls.length; p++){
                var partEl = this.partEls[p-1];
                partEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleOpenPart);
            }
    	},
        handleOpenPart:function(e){
            var id = parseInt(e.currentTarget.getAttribute("file"));
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
            if(datas.dates){
                this.dates = datas.dates;
            }
            if(datas.progress){
                for(var p=1; p<=this.partEls.length; p++){
                    const partEl = this.partEls[p-1];
                    const fileId = parseInt(partEl.getAttribute("file"));
                    const file = ofp.player.getFileById(fileId);
                    const gaugeEl = partEl.querySelector(".gauge");
                    const dateEl = partEl.querySelector(".lock");
                    const progress = datas.progress[fileId-1];
                    const dateDatas = this.dates[fileId-1];
                    partEl.classList.add("locked");
                    if(dateEl){
                        //dateEl.querySelector("p").innerHTML = dateDatas;
                    }
                    if(gaugeEl && progress){
                        const levelEl = gaugeEl.querySelector("div");
                        const percent = file.status == "na" ? 0 : Math.round((parseInt(progress[0]) / parseInt(progress[1])) * 100);
                        levelEl.style.width = percent+"%";
                    }
                    if(this.time && this.dates){
                        const dateTime = new Date(this.time.utcDatetime);
                        const datePart = new Date(dateDatas);

                        if(dateTime >= datePart){
                            partEl.classList.remove("locked");
                            partEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleOpenPart);
                        } else {
                            partEl.removeEventListener(Constants.CLICK_TOUCH, this.boundHandleOpenPart);
                        }
                    }
                }    
            }
            if(typeof datas.isBattleEnded == "boolean"){
                if(datas.isBattleEnded){
                    this.dateEndEl.innerHTML = "Battle terminée. Scores bloqués."
                } else {
                    //this.dateEndEl.innerHTML = "La battle se termine le 26/07/2023.";
                }
            }
            if(datas.avatarDatas){

            }
    	},
        hide:function(cb,animated,byFooter){
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
                    this.element.style["transform"] = "translateY(40%)";
                    this.element.style["opacity"] = 0;
                    cb();
                }    
            }
            
        },
        show:function(animated,byFooter){
            if(this.disabled==false){
                if(byFooter){
                    this.backgroundEl.style.opacity = 0;
                }
                if(this.time){
                    this.update({});
                }
                if(animated){
                    this.disabled = true;
                    this.element.style["transform"] = "translateY(40%)";
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
                    this.element.style["transform"] = "";
                    this.element.style["opacity"] = "";
                }    
            }
            
        }
    };

    mix(Menu, EmitterMixin);
    win.Menu = Menu;
})(window);
