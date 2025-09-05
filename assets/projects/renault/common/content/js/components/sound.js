import EmitterMixin from "../emitter/emitter-mixin.js";
import { forEach } from "../utils/utils.js";

const defaultOptions = {
    id: 'test_sound',
    name: 'official_test_sound',
    path: '',
    loop: false,
    persistent: false,
}

export default class Sound extends EmitterMixin  {
    static get PLAY(){
        return 'Sound.play';
    }
    static get CAN_PLAY(){
        return 'Sound.canPlay';
    }
    static get TIME_UPDATE(){
        return 'Sound.timeUpdate';
    }
    static get ERROR(){
        return 'Sound.error';
    }

    constructor(container, options){
        super()
        this.container = container || win.document.body;
        this.options = Object.assign({}, defaultOptions, options);

        this.element = null;
        this.source = null;

        this.id = this.options.id;
        this.finishCallbacks = [];
        this.persistent = this.options.persistent;
        this.canPlay = false;

        Object.defineProperty(this, 'ended', {
            get: function () {
                return this.element.ended;
            },
        });

        Object.defineProperty(this, 'playing', {
            get: function () {
                return !this.element.paused;
            },
        });

        Object.defineProperty(this, 'duration', {
            get: function () {
                return this.element.duration;
            },
        });

        Object.defineProperty(this, 'currentTime', {
            get: function () {
                return this.element.currentTime;
            },
        });

        Object.defineProperty(this, 'percent', {
            get: function () {
                return this.element.currentTime / this.element.duration * 100;
            },
        });

        Object.defineProperty(this, 'volume', {
            get: function () {
                return this.element.volume;
            },
            set: function (volume) {
                if (typeof volume === 'number' && volume >= 0 && volume <= 1) {
                    this.element.volume = volume;
                }
            },
        });

        this.boundHandleEndSound = this.handleEndSound.bind(this);
        this.boundHandleCanPlay = this.handleCanPlay.bind(this);
        this.boundHandleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.boundHandleError = this.handleError.bind(this);    
    }
    
    init() {
        var audioData = createAudio(this.options.path, this.options.name);
        this.element = audioData.container;
        this.source = audioData.source;
        this.cbPlay = 
        this.element.loop = this.options.loop;
        this.element.onended = this.boundHandleEndSound;
        this.element.oncanplay = this.boundHandleCanPlay;
        this.element.ontimeupdate = this.boundHandleTimeUpdate;
        this.element.onerror = this.boundHandleError;
        
        this.source.onerror = this.boundHandleError;
        this.container.appendChild(this.element);
    
        var self = this;
    
        return new Promise(function(resolve,reject){
            self.element.onloadedmetadata = function(event){
                resolve()
            }
        })
    }
    
    play() {
        if (!this.playing) {
            this.element.play();
            this.emit(Sound.PLAY);
        }
    }

    pause(){
        if (!this.persistent) {
            this.element.pause();
        }
    }
    
    stop() {
        if (!this.persistent) {
            this.element.pause();
            this.element.currentTime = 0;
        }
    }
    
    stopPersistent() {
        if (this.persistent) {
            this.element.pause();
            this.element.currentTime = 0;
        }
    }
    
    handleEndSound() {
        var self = this;
        forEach(this.finishCallbacks, function (finishCallback) {
            var handleFinishCallback = finishCallback.bind(self);
            handleFinishCallback();
        });
    
        this.finishCallbacks.length = 0;
    }
    
    handleCanPlay() {
        this.canPlay = true;
        this.emit(Sound.CAN_PLAY);
    }
    
    handleTimeUpdate() {
        this.emit(Sound.TIME_UPDATE);
    }
    
    handleError(e) {
        this.canPlay = true;
        console.warn('An error occurred with sound ' + this.options.name + '.');
        this.emit(Sound.ERROR);
    }
    
    addFinishCallback(callback) {
        if (typeof callback === 'function') {
            this.finishCallbacks.push(callback);
        }
    }
    
    removeFinishCallback(callback) {
        var foundCallback = this.finishCallbacks.indexOf(callback);
    
        if (foundCallback > -1) {
            this.finishCallbacks.splice(foundCallback, 1);
        }
    }
    
    getData() {
        var id = this.id;
        var volume = this.volume;
        var loop = this.element.loop;
        var duration = this.duration;
    
        return {
            id: id,
            volume: volume,
            loop: loop,
            duration: duration
        }
    }
    
    setData(datas) {
        var id = datas.id;
        var volume = datas.volume;
        var loop = datas.loop;
    
        if (isDefined(id)) {
            this.id = id;
        }
    
        if (isDefined(volume)) {
            this.volume = volume;
        }
    
        if (isDefined(id)) {
            this.element.loop = loop;
        }
    }
    
    destroy() {
        this.element.onended = null;
        this.element.oncanplay = null;
        this.source.onerror = null;
        this.element.removeChild(this.source);
        this.container.removeChild(this.element);
        this.container = null;
        this.source = null;
        this.element = null;
    }
    
}

function createAudio(path, name) {
    var audio = document.createElement('audio');
    var source = document.createElement('source');

    if (audio.canPlayType('audio/mp3')) {
        source.type = 'audio/mp3';
        source.src = path + name + '.mp3';
    } else {
        source.type = 'audio/ogg';
        source.src = path + name + '.ogg';
    }

    audio.id = 'sound_' + name;
    audio.style.display = 'none';

    audio.appendChild(source);

    return {
        container: audio,
        source: source,
    };
}
