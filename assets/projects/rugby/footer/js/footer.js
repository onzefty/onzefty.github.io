(function (win) {
    var STATICS = {
        PREVIOUS_CLICKED: {
            get: function () {
                return 'Footer.previousClicked';
            }
        },
        NEXT_CLICKED: {
            get: function () {
                return 'Footer.nextClicked';
            }
        },
        MENU_OPEN: {
            get: function () {
                return 'Footer.menuOpen';
            }
        },
        FOOTER_UPDATE: {
            get: function () {
                return 'Footer.update';
            } 
        },
        FOOTER_SHOW: {
            get: function () {
                return 'Footer.show';
            } 
        },
        FOOTER_HIDE: {
            get: function () {
                return 'Footer.hide';
            } 
        },
        FOOTER_OFF: {
            get: function () {
                return 'Footer.off';
            } 
        },
        FOOTER_ON: {
            get: function () {
                return 'Footer.on';
            } 
        },
        MENU_TOGGLE: {
            get: function () {
                return 'Footer.menuToggle';
            } 
        },
        CHAT_OPEN: {
            get: function () {
                return 'Footer.chatOpen';
            } 
        },
        VOLUME_CHANGED: {
            get: function () {
                return 'Footer.volumeChanged';
            },
        },
    };

    setStatic(STATICS, Footer);

    function Footer(){
    	this.element = document.querySelector(".footer");
        this.moduleTitleEl = this.element.querySelector("#footer-module-title");
        this.partTitleEl = this.element.querySelector("#footer-part-title");
        this.navigationEl = this.element.querySelector("#footer-navigation");
        this.progressEl = this.element.querySelector("#footer-progress");
        this.buttonMenu = this.element.querySelector("#button-menu");
        this.buttonChat = this.element.querySelector("#button-chat");
        this.buttonPrev = this.element.querySelector("#button-previous");
    	this.buttonNext = this.element.querySelector("#button-next");

        this.boundHandlePrev = this.handlePrev.bind(this);
        this.boundHandleNext = this.handleNext.bind(this);
        this.boundHandleMenu = this.handleMenu.bind(this);
        this.boundHandleChat = this.handleChat.bind(this);

        this.nextValue = 1;
        this.prevValue = -1;

        this.status = null;

    	this.addEvents();
    }

    Footer.prototype = {
    	addEvents:function(){
            this.buttonMenu.addEventListener(Constants.CLICK_TOUCH, this.boundHandleMenu);
            this.buttonPrev.addEventListener(Constants.CLICK_TOUCH, this.boundHandlePrev);
    		this.buttonNext.addEventListener(Constants.CLICK_TOUCH, this.boundHandleNext);
            this.buttonChat.addEventListener(Constants.CLICK_TOUCH,this.boundHandleChat);
    	},
        handleChat:function(e){
            this.emit(Footer.CHAT_OPEN);
        },
    	update:function(datas){
            this.buttonMenu.classList.remove("close");
            this.buttonChat.classList.remove("unavailable");
            this.partTitleEl.innerHTML = "";
            if(typeof datas.title == "string"){
                this.moduleTitleEl.innerHTML = datas.title;
            }
            if(typeof datas.part == "string"){
                this.partTitleEl.innerHTML = datas.part;
            }
            if(typeof datas.progress == "string"){
                this.progressEl.innerHTML = datas.progress;
            }
            if(typeof datas.byFooter == "string"){
                if(datas.byFooter=="open"){
                    this.buttonChat.classList.add("unavailable");
                    this.buttonMenu.classList.add("close");
                } else {
                    this.buttonMenu.classList.remove("close");
                }
            }
            if(datas.isBattle==true){
                this.navigationEl.classList.add("unavailable");
            }
            else if(datas.isBattle==false) {
                this.navigationEl.classList.remove("unavailable");
            }
    	},
        setStatus:function(status,unread){
            this.status = status;
            if(typeof status == "string"){
                this.buttonChat.setAttribute("status",this.status);
                if(typeof unread== "number"){
                    this.buttonChat.querySelector("p[status=messages]").innerHTML = unread;
                }
            }
        },
        handlePrev:function(){
            this.emit(Footer.PREVIOUS_CLICKED);
    	},
    	handleNext:function(){
    		this.emit(Footer.NEXT_CLICKED);
    	},
        handleMenu:function(){
            this.emit(Footer.MENU_TOGGLE);
        },
        handleOn:function(w){
            if(w=="next"){
                this.buttonNext.classList.remove("inactive");
                this.buttonNext.classList.add("active");
                this.buttonPrev.classList.add("inactive");
                this.buttonPrev.classList.remove("active");
            }
            else if(w=="prev"){
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            } else {
                this.buttonNext.classList.remove("inactive");
                this.buttonNext.classList.add("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            }
        },
        handleOff:function(w){
            if(w=="next"){
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            }
            else if(w=="prev"){
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.remove("inactive");
                this.buttonPrev.classList.add("active");
            } else {
                this.buttonNext.classList.add("inactive");
                this.buttonNext.classList.remove("active");
                this.buttonPrev.classList.add("inactive");
                this.buttonPrev.classList.remove("active");
            }
        },
        hide:function(){
            this.element.classList.add("hidden");
        },
        show:function(){
            this.element.classList.remove("hidden");
        }
    };

    mix(Footer, EmitterMixin);
    win.Footer = Footer;
})(window);
