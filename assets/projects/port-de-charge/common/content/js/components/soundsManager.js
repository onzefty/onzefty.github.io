// Properties
// doc - document où seront stockés les sons
// commonPath - url pour les sons communs
// localPath - url pour les sons spécifiques à un file
// Methods
// addSounds (s) - ajoute des sons (s)
// play (n,f,a) - joue un son
// --> n : id du son
// --> f : fonction callback lorsque le son s'achève
// --> a : stoppe tous les autres sons
// stop (a) - stoppe un son / tous les sons
// --> a : (boolean) tous les sons | id du son
// setVolume (vol) - set le volume
// --> vol : valeur de 0 à 1

function SoundsManager(props) {
    props = props==undefined ? {} : props;
    this.ofp = (this.findWindowOwnerOf('ofp', window) || {}).ofp;
    this.doc = props.doc != undefined ? props.doc : document;
    this.commonPath = props.commonPath != undefined ? props.commonPath : this.ofp.absoluteRootPath + 'common/content/medias/';
    this.localPath = props.localPath != undefined ? props.localPath : './sons/';
    this.sounds = {};
    this.currentSound = null;
    this.volume = 1;
}

SoundsManager.prototype = {
    addSounds: function(s){
        if(typeof s !== "object"){
            return console.error("s must be an object");
        }
        this.sounds = {};
        var frag = document.createDocumentFragment();
        for(var prop in s){
            this.sounds[prop] = this.addSound(s[prop]);
            frag.appendChild(this.sounds[prop]);
        }
        this.doc.body.appendChild(frag);
    },
    addSound: function(s){
        var audio = document.createElement('audio'),
        source = document.createElement('source'),
        p = s.path || "common",
        path = p == "common" ? this.commonPath : this.localPath,
        name = s.name;

        if (audio.canPlayType('audio/mp3')) {
            source.type = 'audio/mp3';
            source.src = path + name + '.mp3';
        } else {
            source.type = 'audio/ogg';
            source.src = path + name + '.ogg';
        }
        audio.id = 'son_'+name;
        audio.style.display = "none";
        audio.appendChild(source);

        return audio;
    },
    play: function(n,f,a){
        if(a!=undefined){
            this.stop(true);
        }
        var ftc = f || function(){};
        this.currentSound = n;
        if(this.sounds[n]!=undefined){
            var sound = this.sounds[n];
            sound.volume = this.volume;
            sound.play();
            sound.onended = function(){
                ftc.apply(ftc);
            }
        }
    },
    stop: function(a){
        if(typeof a == "boolean"){
            for(var prop in this.sounds){
                var sound = this.sounds[prop];
                sound.pause();
                sound.currentTime = 0;
            }
        } else if(this.sounds[a]!=undefined){
            this.sounds[a].pause();
            this.sounds[a].currentTime = 0;
        }
        this.currentSound = null;
    },
    setVolume: function(vol){
        if(vol>=0 && vol<=1){
            this.volume = vol;
        }
    },
    findWindowOwnerOf: function(property, win) {
        var currentWindow = win || window;
        var isDefined = function(elem) {
            return elem && typeof elem !== 'undefined';
        };
        var ownerWindow = isDefined(currentWindow[property]) ? currentWindow : null;
        while (!ownerWindow && currentWindow.parent && currentWindow.parent != currentWindow) {
            currentWindow = currentWindow.parent;
            try {
                if (isDefined(currentWindow[property])) {
                    ownerWindow = currentWindow;
                }
            } catch (error) {}
        }
        return ownerWindow;
    }
}