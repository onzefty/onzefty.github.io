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
        SUBTITLES_OFF: {
            get: function () {
                return 'Footer.subtitlesOff';
            } 
        },
        SUBTITLES_ON: {
            get: function () {
                return 'Footer.subtitlesOn';
            } 
        },
        MENU_TOGGLE: {
            get: function () {
                return 'Footer.menuToggle';
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
        this.titleEl = this.element.querySelector("#footer-title-module");
        this.progressEl = this.element.querySelector("#footer-progress");
        this.buttonMenu = this.element.querySelector("#button-menu");
        this.buttonSubtitles = this.element.querySelector("#button-subtitle");
        this.buttonPrev = this.element.querySelector("#button-previous");
    	this.buttonNext = this.element.querySelector("#button-next");
        this.soundOnEl = this.element.querySelector("#sound-on");
        this.soundOffEl = this.element.querySelector("#sound-off");
        this.soundDurationEl = this.element.querySelector("#sound-duration");
        this.volumeBarEls = this.element.querySelectorAll(".volume-bar");

        this.boundHandlePrev = this.handlePrev.bind(this);
        this.boundHandleNext = this.handleNext.bind(this);
        this.boundHandleMenu = this.handleMenu.bind(this);
        this.boundHandleSubtitles = this.handleSubtitles.bind(this);
        this.boundHandleSetVolume = this.handleSetVolume.bind(this);

        this.nextValue = 1;
        this.prevValue = -1;
        this.volume = 1;
        this.subtitles = "off";

    	this.addEvents();
    }

    Footer.prototype = {
    	addEvents:function(){
    		this.buttonPrev.addEventListener(Constants.CLICK_TOUCH, this.boundHandlePrev);
    		this.buttonNext.addEventListener(Constants.CLICK_TOUCH, this.boundHandleNext);
            this.buttonMenu.addEventListener(Constants.CLICK_TOUCH, this.boundHandleMenu);
            this.soundOnEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleSetVolume);
            this.soundOffEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleSetVolume);
            this.buttonSubtitles.addEventListener(Constants.CLICK_TOUCH,this.boundHandleSubtitles);
            for(var v=1; v<=this.volumeBarEls.length; v++){
                var volumeBarEl = this.volumeBarEls[v-1];
                volumeBarEl.addEventListener(Constants.CLICK_TOUCH, this.boundHandleSetVolume);
            }
    	},
        handleSwitchLanguage:function(e){
            this.language = e.currentTarget.getAttribute("language");
            this.emit(Footer.SWITCH_LANGUAGE);
        },
    	update:function(datas){
            if(typeof datas.title == "string"){
                this.titleEl.innerHTML = datas.title;
            }
            if(typeof datas.progress == "string"){
                this.progressEl.innerHTML = datas.progress;
            }
            if(typeof datas.byFooter == "string"){
                if(datas.byFooter=="open"){
                    this.buttonMenu.classList.add("close");
                } else {
                    this.buttonMenu.classList.remove("close");
                }
            }
            if(typeof datas.duration == "number"){
                this.soundDurationEl.querySelector("div").style.width = datas.duration+"%";
            }
            if(typeof datas.subtitles=="string"){
                if(datas.subtitles=="on"){
                    this.subtitlesEnable();
                } else {
                    this.subtitlesDisable();
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
        subtitlesEnable:function(){
            this.subtitles = "on";
            this.buttonSubtitles.classList.add("off");
            this.buttonSubtitles.classList.remove("on")
            this.emit(Footer.SUBTITLES_ON);
        },
        subtitlesDisable:function(){
            this.subtitles = "off";
            this.buttonSubtitles.classList.remove("off");
            this.buttonSubtitles.classList.add("on");
            this.emit(Footer.SUBTITLES_OFF);
        },
        handleSubtitles:function(){
            if(this.subtitles=="off"){
                this.subtitlesEnable();
                
            } else {
                this.subtitlesDisable();
            } 
        },
        handleSetVolume:function(e){
            var target = e.currentTarget,
            volume = parseFloat(target.getAttribute("volume"))
            this.volume = volume;
            for(var v=1; v<=this.volumeBarEls.length; v++){
                var volumeBarEl = this.volumeBarEls[v-1],
                vol = parseFloat(volumeBarEl.getAttribute("volume"));
                if(volume<vol){
                    volumeBarEl.classList.add("off");
                } else {
                    volumeBarEl.classList.remove("off");
                }
            }
            this.emit(Footer.VOLUME_CHANGED);
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
