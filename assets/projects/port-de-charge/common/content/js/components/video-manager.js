function VideoManager(props){
	this.container = props.container instanceof HTMLElement ? props.container : typeof props.container == "string" ? document.querySelector(props.container) : null;
	this.src = typeof props.src == "string" ? props.src : "";
	this.loop = typeof props.loop == "boolean" ? props.loop : false;
	this.controllable = typeof props.controllable == "boolean" ? props.controllable : true;
	this.timeStart = typeof props.timeStart == "number" ? props.timeStart : 0;
	this.timeEnd = typeof props.timeEnd == "number" ? props.timeEnd : null;

	this.onPlay = typeof props.onPlay == "function" ? props.onPlay : function(){};
	this.onPause = typeof props.onPause == "function" ? props.onPause : function(){};
	this.onEnded = typeof props.onEnded == "function" ? props.onEnded : function(){};
	this.onTimeUpdate = typeof props.onTimeUpdate == "function" ? props.onTimeUpdate : function(){};
	this.onLoadedMetaData = typeof props.onLoadedMetaData == "function" ? props.onLoadedMetaData : function(){};

	this.handlePlay = this.play.bind(this);
	this.handlePause = this.pause.bind(this);
	this.handleEnded = this.ended.bind(this);
	this.handleTimeUpdate = this.timeUpdate.bind(this);
	this.handleLoadedMetaData = this.loadedMetaData.bind(this);
	this.handleTogglePlay = this.togglePlay.bind(this);

	this.looped = 0;
	this.finished = false;
	this.controls;
	this.controlsButtonPlay;
	this.controlsButtonVolume;
	this.controlsCurrentTime;
	this.controlsGauge;
	this.controlsSoundOff;
	this.controlsSoundOn;

	if(this.container==null){
		return console.warn("Le conteneur de la vidéo n'est pas spécifié.");
	}
	if(this.src== ""){
		return console.warn("La source n'est pas spécifiée.");
	}

	this.video = this.container.querySelector("video");

	this.init();
}

VideoManager.prototype = {
	init:function(){
		if(!this.video){
			this.video = document.createElement("video");
			this.container.appendChild(this.video);
		}
		this.video.setAttribute("src",this.src);
		this.video.setAttribute("playsinline",true);
		if(this.loop==true){
			this.video.setAttribute("loop",true);
		}
		if(this.controllable==true){
			this.controls = this.container.querySelector(".controls");
			if(!this.controls){
				this.controls = document.createElement("div");
				this.container.appendChild(this.controls);
				this.controls.className = "controls flex";
				this.controls.innerHTML = "\
 					<div class='controls-part-1 flexCenter'>\
 						<div class='controls-gauge'><div class='controls-current-time'></div></div>\
 					</div>\
 					<div class='controls-part-2 flexCenter'>\
 						<div class='controls-button flexCenter play'><img class='play' src='imgs/play.svg'><img class='pause' src='imgs/pause.svg'></div>\
 					</div>\
 					<div class='controls-part-3 flexCenter'>\
 						<img class='sound-off' src='imgs/sound-off.svg'><div class='controls-volume'><div class='controls-button-volume'></div><div class='controls-volume-level'></div></div><img class='sound-on'  src='imgs/sound-on.svg'>\
 					</div>\
				";
				this.controlsButtonPlay = this.controls.querySelector(".controls-button");
				this.controlsButtonVolume = this.controls.querySelector(".controls-button-volume");
				this.controlsCurrentTime = this.controls.querySelector(".controls-current-time");
				this.controlsGauge = this.controls.querySelector(".controls-gauge");
				this.controlsSoundOff = this.controls.querySelector(".sound-off");
				this.controlsSoundOn = this.controls.querySelector(".sound-on");
			}
			
		}
		this.addEvents();
	},
	play:function(){
		this.video.play();
		this.onPlay();
	},
	pause:function(not){
		this.video.pause();
		if(not==undefined){
			this.onPause();
		}
	},
	ended:function(){
		if(this.finished==false){
			this.finished = true;
			this.onEnded();
		}
	},
	timeUpdate:function(){
		if(this.isPlaying()==false){
			return;
		}
		var once = true;
		if(this.video.currentTime==0 && once==true){
			this.looped++;
			once = false;
		} else {
			once = true;
		}

		this.onTimeUpdate(this.video.currentTime,this.timeStart,this.timeEnd);

		if(this.video.currentTime >= this.timeEnd){
			if(this.loop==true){
				this.setAt("start");
			} else {
				this.video.currentTime = this.timeEnd;
				this.pause(false);
				this.ended();
			}
		}

		if(this.controllable==true){
			this.update();
		}
	},
	loadedMetaData:function(datas){
		if(this.timeEnd==null){
			this.timeEnd = datas.target.duration;
		} else {
			this.timeEnd = Math.min(this.timeEnd,datas.target.duration);
		}
		this.setAt(this.timeStart);
		this.onLoadedMetaData(datas.target.duration,datas.target.videoWidth,datas.target.videoHeight);
	},
	togglePlay:function(){
		if(this.video.paused==true){
			this.play();
			this.controlsButtonPlay.classList.remove("play");
			this.controlsButtonPlay.classList.add("pause");
		} else {
			this.pause();
			this.controlsButtonPlay.classList.remove("pause");
			this.controlsButtonPlay.classList.add("play");
		}
	},
	setAt:function(pTime){
		var time = pTime == "start" ? this.timeStart : pTime == "end" ? this.timeEnd : typeof pTime == "number" ? pTime : this.video.currentTime,
		current = minMax(time,this.timeStart,this.timeEnd);
		this.video.currentTime = current;
		if(this.controllable==true){
			this.update();
		}
	},
	isPlaying:function(){
		return this.video.paused==false;
	},
	isOver:function(){
		return this.video.currentTime==this.timeEnd;
	},
	update:function(){
		var percent = Math.round(this.video.currentTime/this.timeEnd*100);
		this.controlsCurrentTime.style.width = (percent)+"%";
	},
	addEvents:function(){
        this.video.addEventListener("play", this.handlePlay);
        this.video.addEventListener("pause", this.handlePause);
        this.video.addEventListener("loadedmetadata",this.handleLoadedMetaData);
        //this.video.addEventListener("seeking", this.boundHandleSeeking)
        this.video.addEventListener("timeupdate", this.handleTimeUpdate);
        this.video.addEventListener("ended", this.handleEnded);

        if(this.controllable==true){
        	this.controlsButtonPlay.addEventListener(Constants.CLICK_TOUCH,this.handleTogglePlay);
        }
	},
	removeEvents:function(){

	}
}

function getSource(src) {
    var rawData = preloader.getResult(src,true);
    return rawData instanceof File ? URL.createObjectURL( rawData ) : src;
}

function preferWEBM(){
    return document.createElement('video').canPlayType('video/webm') !== '';
}

function minMax(val, min, max) {
  return Math.min(Math.max(val, min), max);
}