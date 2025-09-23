(function (win) {
    var STATICS = {
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
        MENU_QUIT: {
            get: function () {
                return 'Menu.quit';
            }
        },
        MENU_GO: {
            get: function () {
                return 'Menu.go';
            }
        },
        MENU_UPDATE: {
            get: function () {
                return 'Menu.update';
            }
        },
        MENU_CLICK_HIDE: {
            get: function () {
                return 'Menu.clickHide';
            }
        }
    };

    setStatic(STATICS, Menu);

    function Menu(){
    	this.element = document.querySelector(".menu");
        this.wrap = this.element.querySelector("#menu-wrap");
    	this.menuParts = this.element.querySelectorAll(".menu-part");
    	this.buttonClose = this.element.querySelector("#button-close");
        this.buttonQuit = this.element.querySelector("#button-quit");

        this.boundHandleClickHide = this.onClickHide.bind(this);
        this.boundHandleGo = this.go.bind(this);
        this.boundHandleShow = this.show.bind(this);
        this.boundHandleQuit = this.quit.bind(this);
        this.boundHandleTransitionEnd = this.transitionEnd.bind(this);

        this.idClicked;

    	this.addEvents();
    }

    Menu.prototype = {
    	addEvents:function(){
            for(var p=1; p<=this.menuParts.length; p++){
                var menuPart = this.menuParts[p-1];
                menuPart.addEventListener(Constants.CLICK_TOUCH,this.boundHandleGo);
            }
    		this.buttonClose.addEventListener(Constants.CLICK_TOUCH,this.boundHandleClickHide);
            this.buttonQuit.addEventListener(Constants.CLICK_TOUCH,this.boundHandleQuit);
            this.wrap.addEventListener("transitionend",this.boundHandleTransitionEnd);
    	},
        show:function(){
            this.element.classList.add("show");
        },
        hide:function(){
            this.element.classList.remove("show");            
        },
        transitionEnd:function(e){
            var once = false;
            if(parseInt(window.getComputedStyle(document.querySelector("#menu-wrap")).getPropertyValue("opacity"))==0 && !once){
                once = true;
                this.emit(Menu.MENU_HIDE);
            }
        },
        quit:function(e){
            this.emit(Menu.MENU_QUIT);
        },
        onClickHide:function(e){
            this.emit(Menu.MENU_CLICK_HIDE);
        },
        go:function(e){
            this.idClicked = e.currentTarget.id.replace(/\D/g,"");
            this.emit(Menu.MENU_GO);
        },
    	update:function(datas){
            var current = ofp.player.actualFile.id,
            providerDatas = ofp.getFromDataProvider("files"),
            prevCompleted = false;
            for(var p=1; p<=this.menuParts.length; p++){
                var menuPart = this.menuParts[p-1],
                partTitleEl = menuPart.querySelector(".menu-part-title"),
                partProgressEl = menuPart.querySelector(".menu-part-progress"),
                file = ofp.player.files[p],
                providerData = providerDatas[p],
                d = datas.parsedDatas[p-1],
                progress = parseInt(d[0])/parseInt(d[1]);

                if(file.status=="c" || progress==1){
                    prevCompleted = true;
                    menuPart.classList.add("completed");
                    menuPart.classList.remove("current");
                }
                else if(file.status=="na" && prevCompleted==false){
                    //menuPart.classList.add("undone");
                }
                else if((p==current) || prevCompleted==true){
                    if(prevCompleted==false){
                        menuPart.classList.add("current");
                    }
                    menuPart.classList.remove("undone");
                    prevCompleted = false;
                }

                partTitleEl.innerHTML = providerData.title;
                partProgressEl.innerHTML = file.status=="na" ? "0%" : Math.round(progress*100)+"%";
            }
    	}
    };

    mix(Menu, EmitterMixin);
    win.Menu = Menu;
})(window);
