(function (win) {
    var STATICS = {
        CLICK_MENU_SHOW: {
            get: function () {
                return 'Header.clickMenuShow';
            },
        },
        CLICK_MENU_HIDE: {
            get: function () {
                return 'Header.clickMenuHide';
            },
        },
        TUTORING_TCHAT: {
            get: function () {
                return 'Header.tutoringTchat';
            },
        },
        TUTORING_MAIL: {
            get: function () {
                return 'Header.tutoringMail';
            },
        },
        TUTORING_OPEN: {
            get: function () {
                return 'Header.tutoring.open';
            },
        },
        TUTORING_CLOSE: {
            get: function () {
                return 'Header.tutoring.close';
            },
        },
        VOLUME_CHANGED: {
            get: function () {
                return 'Header.volumeChanged';
            },
        },
        SOUND_CLICKED: {
            get: function () {
                return 'Header.soundClicked';
            },
        }
    };

    setStatic(STATICS, Header);

    function Header(){
    	this.element = document.querySelector(".header");
    	this.buttonMenu = this.element.querySelector("#button-menu");
    	this.buttonTutorat = this.element.querySelector("#button-tutorat");
        this.buttonVolume = this.element.querySelector("#button-volume");
        this.buttonSoundOn = this.element.querySelector("#sound-on");
        this.buttonSoundOff = this.element.querySelector("#sound-off");
        this.volumeLevelEl = this.element.querySelector("#volume-level");
        this.elTutoratWrap = this.element.querySelector("#tutorat-wrap");
        this.elTutoratTchat = this.elTutoratWrap.querySelector("#tutorat-chat");
        this.elTutoratMail = this.elTutoratWrap.querySelector("#tutorat-mail");
        
    	this.boundHandleTutorat = this.handleTutorat.bind(this);
        this.boundHandleTutoratTchat = this.handleTutoratTchat.bind(this);
        this.boundHandleTutoratMail = this.handleTutoratMail.bind(this);
        this.boundHandleMenu = this.handleMenu.bind(this);
        this.boundHandleVolumeMin = this.handleVolumeMin.bind(this);
        this.boundHandleVolumeMax = this.handleVolumeMax.bind(this);
        this.boundHandleVolumeChanged = this.handleVolumeChanged.bind(this);

        this.volumeMinPos = 0;
        this.volumeMaxPos = this.buttonVolume.parentNode.offsetWidth - this.buttonVolume.offsetWidth;
        this.volumeEvent;
        this.volume = 1;

    	this.addEvents();

        //Cas tutorat
        if(ofp.tutor.getAvailableServices().length==0){
            //this.buttonTutorat.classList.add("inactive");
        }
    }

    Header.prototype = {
    	addEvents:function(){
    		this.buttonTutorat.addEventListener(Constants.CLICK_TOUCH, this.boundHandleTutorat);
            this.elTutoratTchat.addEventListener(Constants.CLICK_TOUCH, this.boundHandleTutoratTchat);
            this.elTutoratMail.addEventListener(Constants.CLICK_TOUCH, this.boundHandleTutoratMail);
    		this.buttonMenu.addEventListener(Constants.CLICK_TOUCH, this.boundHandleMenu);
            this.buttonSoundOn.addEventListener(Constants.CLICK_TOUCH, this.boundHandleVolumeMax);
            this.buttonSoundOff.addEventListener(Constants.CLICK_TOUCH, this.boundHandleVolumeMin);
            this.buttonVolume.addEventListener(Constants.CLICK_TOUCH, this.boundHandleVolumeChanged);

            this.volumeEvent = new Movable({
                element:this.buttonVolume,
                customOnMove:this.boundHandleVolumeChanged,
                limitXStart:this.volumeMinPos,
                limitXEnd:this.volumeMaxPos,
                limitYStart:this.buttonVolume.offsetTop,
                limitYEnd:this.buttonVolume.offsetTop
            });
    	},
        handleVolumeMin:function(){
            this.volume = 0;
            this.buttonVolume.style.left = this.volumeMinPos+"px";
            this.volumeLevelEl.style.width = "0%";
            this.emit(Header.VOLUME_CHANGED);
        },
        handleVolumeMax:function(){
            this.volume = 1;
            this.buttonVolume.style.left = this.volumeMaxPos+"px";
            this.volumeLevelEl.style.width = "100%";
            this.emit(Header.VOLUME_CHANGED);
        },
        handleVolumeChanged:function(value){
            var l = this.buttonVolume.offsetLeft;
            this.volume = ((l-this.volumeMinPos)/(this.volumeMaxPos-this.volumeMinPos));
            this.volumeLevelEl.style.width = (this.volume*100)+"%";
            this.emit(Header.VOLUME_CHANGED);
        },
    	handleTutorat:function(e){
            if(this.elTutoratWrap.classList.contains("open")){
                this.elTutoratWrap.classList.remove("open");
                this.emit(Header.TUTORING_CLOSE);
            } else {
                this.elTutoratWrap.classList.add("open");
                this.emit(Header.TUTORING_OPEN);   
            }
    	},
        handleTutoratTchat:function(e){
            this.emit(Header.TUTORING_TCHAT);
        },
        handleTutoratMail:function(e){
            this.emit(Header.TUTORING_MAIL);
        },
    	handleMenu:function(){
            if(this.buttonMenu.classList.contains("open")){
                this.buttonMenu.classList.remove("open");
                this.emit(Header.CLICK_MENU_HIDE);
            } else {
                this.buttonMenu.classList.add("open");
                this.emit(Header.CLICK_MENU_SHOW);
            }
    	},
    	update:function(datas){     
    	}
    };

    mix(Header, EmitterMixin);
    win.Header = Header;
})(window);
