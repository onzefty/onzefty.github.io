var ofp = InterfaceFinder.searchOfp();
var ofpWin = InterfaceFinder.searchOfpWindow();
var scorm = new ScormManager(ofp);
var navigation = new NavigationManager({
    onCustomNext:navNext,
    onCustomPrev:navPrev,
    onCustomAfterMax:navMax,
    onCustomLoad:navLoad,
    onCustomOn:navOn,
    onCustomOff:navOff,
    onCustomSave:save
});
var timeline = null;
var soundManager = null;
var message = new Message();
var files;
var dataP;
var currentFileId;
var nbLessons;
var stageSym;
var stageDom;
var sections;

var contentLoadedReady = false;
var mobile = false;

ofp.debug = ofp.getFromDataProvider('debug');
var debug = ofp.getFromDataProvider('debug');

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////    INITIALISATION FUNCTIONS    ///////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function contentLoaded() {
    contentLoadedReady = true;
    ofp.loader.show();
    window.AdobeEdge.supported.cssTransform3d =  false;
    files = ofp.getFromDataProvider('files');
    dataP = ofp.getFromDataProvider('data');
    currentFileId = ofp.player.actualFile.id;
    nbLessons = ofp && files.filter(function(file) { return file.type === 'lesson'; }).length;
    mobile = Constants.CLICK_TOUCH=='touchend';

    listenMessages();
    initAudio();
    setDebug();

    window.removeEventListener(Constants.LOAD, contentLoaded);
}

function compositionReady(s) {
    if(!stageSym){
        stageSym = s;
    }
    if(!stageDom){
        stageDom = document.getElementById("Stage");
    }
    if (!contentLoadedReady) {
        contentLoaded();
    }
    if(soundManager.list.length==0 && typeof soundsData !== 'undefined'){
        soundManager.addSounds(soundsData);
    }
    if (!soundManager.ready && typeof soundsData !== 'undefined') {
        soundManager.on(SoundsManager.READY, compositionReady);
        return false;
    }
    
    if(currentFileId!=0){
        setScorm();
        setNavigation();
    } else {
        if(ofp.getStatus()!="c"){
           ofp.setStatus("c"); 
        }
        
        sendToFooter({
            type: MessagesConstants.FOOTER_OFF
        }); 
    }

    initTimeline();
    
    setButtons();

    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        progress:currentFileId==0?100:Math.round(navigation.current/navigation.total*100),
        currentPart:currentFileId==0?"":currentFileId,
        totalParts:currentFileId==0?"":(nbLessons-1),
        title:ofp.player.actualFile.title
    });

    sendToMenu({
        type: MessagesConstants.MENU_UPDATE,
        parsedDatas:scorm.parsedDatas
    });

    
    if (!soundManager.browserAllowToPlay && typeof soundsData !== 'undefined') {
        /*
        if (soundManager.browserAllowToPlay === null) {
            soundManager.canPlaySounds().then(compositionReady).catch(compositionReady);
        }
        if (soundManager.browserAllowToPlay === false) {
            //Cas pour faire apparaitre le menu pour trigger l'intéraction pour les sons
            //var home = ofpWin.document.querySelector('#homeCustom');
            //scaleLoader.classList.add('hide');
            //home.style.display = 'block';

            //ofpWin.addEventListener('home-clicked', function () {
            //    scaleLoader.classList.remove('hide');
            //    soundManager.canPlaySounds().then(compositionReady).catch(compositionReady);
            //});
        }
        return false;
        */
    }

    initVideo();

    if(videosList==null){
        setSections();
        ofp.loader.hide();
        launchTimeline();  
    } else {
        initPreload(undefined,function(){
            setSections();
            ofp.loader.hide();
            launchTimeline(); 
        });
    }
}

// -> Lancée uniquement si debug à true (set les status si il est estimé que le fichier a été entièrement vu)
function setDebug(){
    if(debug==true){
        for(var f=1; f<=ofp.player.files.length-1; f++){
            var fl = ofp.player.files[f],
            datas = scorm.parsedDatas[f-1];
            if(parseInt(datas[0])>=parseInt(datas[1])){
                fl.status = "c";
                fl.answered = true;
            }
            else if(parseInt(datas[0])>1){
                fl.status = "i";
            }
        }
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////    SCORM FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -> Met à jour le scorm
function setScorm(){
    var total = countScreens();
    //Si changement du total, on update
    if(parseInt(scorm.parsedDatas[currentFileId-1][1])<total){
        scorm.parsedDatas[currentFileId-1][1] = total;
    }
    // Si écran actuel est le même que le dernier, on remet à 1
    if((scorm.parsedDatas[currentFileId-1][2]==scorm.parsedDatas[currentFileId-1][1])){
    	scorm.parsedDatas[currentFileId-1][2]=1;
    	save(true);
    }
}

// -> compte le nombre d'écrans selon les étiquettes
function countScreens(){
    var screensTotal = 0;
    for(var i=1; stageSym.getLabelPosition("_fin_ecran_"+i) > 0; i++) {
        screensTotal++;
    }

    return screensTotal;
}

// -> Fonction de sauvegarde
function save(force){
    force = force || true;
    onCustomSave();
    var throttleData = scorm.save(true);
    if (force && throttleData){
        if (throttleData.execute){
            throttleData.execute();
        }
    }
}

// -> Fonction lancée pendant une sauvegarde SCORM
function onCustomSave(){
    //Mise à jour des valeurs current et maxVu
    scorm.parsedDatas[currentFileId-1][2] = navigation.current;
    scorm.parsedDatas[currentFileId-1][0] = Math.max(navigation.current,scorm.parsedDatas[currentFileId-1][0]);

    //Calcul de la progression    
    var percent = 0, mainPercent = 0;
    for(var a=1; a<=scorm.parsedDatas.length; a++){
        var datas = scorm.parsedDatas[a-1];
        percent += Math.round((parseInt(datas[0])/parseInt(datas[1]))*100);
    }
    mainPercent = Math.round(percent/scorm.parsedDatas.length)/100;
    ofp.setSCOProgress(mainPercent);

    //Si tous les écrans sont vus, le status est mis à jour (sauf cas évaluation)
    if (((parseInt(scorm.parsedDatas[currentFileId-1][0])/parseInt(scorm.parsedDatas[currentFileId-1][1])) >= 1) && currentFileId!=5) {
        ofp.setStatus("c");
    }

    //Si formation terminée (tous les fichiers ont le statut "completed")
    if(allCompleted()){
        ofp.setCourseCompleted();
        ofp.setCoursePassed();
    }

    //Mise à jour du footer
    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        progress:Math.round(navigation.current/navigation.total*100)
    });

    //Mise à jour du menu
    sendToMenu({
        type: MessagesConstants.MENU_UPDATE,
        parsedDatas:scorm.parsedDatas
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////    NAVIGATION HANDLERS    ///////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setNavigation(){
    navigation.isOff();
    navigation.set(scorm.parsedDatas[currentFileId-1][2],scorm.parsedDatas[currentFileId-1][0],scorm.parsedDatas[currentFileId-1][1]);    
}

function navNext(c){
    navOff();
    if(videosList!=null){
        initPreload(c);
        pauseAllVideos();
    }
	soundManager.stopAll();
    //timeline.playFrom("screen_"+c,true);
	timeline.play("screen_"+c);
}

function navPrev(c,forcePlaying){
    navOff();
    if(videosList!=null){
        initPreload(c);
        pauseAllVideos();
    }
	soundManager.stopAll();
	if(forcePlaying) {
        timeline.playFrom("screen_"+c);
    } else {
        timeline.stopAt("screen_"+c);
    }
}

function navLoad(c,forcePlaying){
    navOff();
    if(videosList!=null){
        initPreload(c);
        pauseAllVideos();
    }
    if(forcePlaying) {
        timeline.playFrom("screen_"+c,{ignoreFinished:true});
    } else {
        timeline.stopAt("screen_"+c);
    }
}

function navMax(){
    var nextFile = ofp.player.getFileById(currentFileId+1);
    if(nextFile){
        loadFile(nextFile.id);
    }
    //Cas Évaluation
    if(currentFileId==5){
        loadFile(0);
    }
}

function navOn(b){
    sendToFooter({
        type: MessagesConstants.FOOTER_ON,
        which:b
    });
}

function navOff(b){
    sendToFooter({
        type: MessagesConstants.FOOTER_OFF,
        which:b
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////    TIMELINE FUNCTIONS    //////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initTimeline(){
    timelineDatas.triggerEl = stageDom;
    timeline = new Timeline(timelineDatas);
}

function launchTimeline(){
    //S'il s'agit de l'accueil ou d'une partie en cours
    if(currentFileId==0){
        timeline.play();
    } else {
        if(navigation.current==1){
            timeline.play();
        } else {
            timeline.stopAt("screen_"+navigation.current);
        }
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////    FILE FUNCTIONS    ////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -> charge un file du dataprovider selon l'id passé en paramètre
function loadFile(id){
    ofp.loader.show();
    ofp.openFileById(id);
}

function allCompleted(){
    return (ofp.player.getAnsweredFiles().length==ofp.player.files.length);
}

function isFormationStarted(){
    var answeredFiles = ofp.player.getAnsweredFiles(),
    filtered = answeredFiles.filter(function(f){if(f.id!=0 && f.status=="c"){return f}});
    return (filtered.length > 0);
}

// -> retourne le premier fichier avec le statut 'incomplete' (id 0 est exclu)
function getFirstIncompleteFileId(){
    var incompleteFile = ofp.player.getNotAnsweredFiles().filter(function(f){ if(f.status=="i" && f.id!=0){ return f}})[0],
    undoneFile = ofp.player.getNotAnsweredFiles().filter(function(f){ if(f.status=="na" && f.id!=0){ return f}})[0];
    if(incompleteFile){
        return incompleteFile.id;
    }
    else if(undoneFile){ 
        return undoneFile.id
    } else {
        return 1;
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    FRAMES FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendToFooter(datas) {
    var footer = ofpWin.document.querySelector('#footer');
    if (footer) {
        message.sendTo(footer.contentWindow, datas);
    }
}

function sendToHeader(datas) {
    var header = ofpWin.document.querySelector('#header');
    if (header) {
        message.sendTo(header.contentWindow, datas);
    }
}

function sendToMenu(datas) {
    var menu = ofpWin.document.querySelector('#menuFrame');

    if (menu) {
        message.sendTo(menu.contentWindow, datas);
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////    MESSAGE LISTENER    ////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function listenMessages() {
    message.listen(function (datas) {
        var type = datas.type;

        switch (type) {
            case MessagesConstants.CONTENT_NEXT:
                if(timeline.status=="normal"){
                    var value = typeof datas.value == "number" ? datas.value : 1;
                    navigation.load(value,true,true);
                    soundManager.play("click");    
                }
                break;
            case MessagesConstants.CONTENT_PREVIOUS:
                if(timeline.status=="normal"){
                    var value = typeof datas.value == "number" ? datas.value : -1;
                    navigation.load(value,true);
                    soundManager.play("click");
                }
                break;
            case MessagesConstants.CONTENT_LOAD:
                if(timeline.status=="normal"){
                    navigation.load(datas.go,true,true);
                }
                break;
            case MessagesConstants.CONTENT_UPDATE:
                navigation.update();
                break;
            case MessagesConstants.CONTENT_CHANGE:
                loadFile(datas.id);
                break;
            case MessagesConstants.CONTENT_VOLUME:
                soundManager.setAllVolume(datas.value);
                if(videosList!=null){
                    for(var prop in videosList){
                        var vidDatas = videosList[prop],
                        vid = vidDatas.container.querySelector("video");
                        if(vid){
                            vid.volume = datas.value;
                        }
                    }    
                }
                break;
            case MessagesConstants.CONTENT_SOUND_CLICK:
                soundManager.play("click");
                break;
            case MessagesConstants.CONTENT_SOUND_OPEN:
                soundManager.play("open");
                break;
            case MessagesConstants.CONTENT_SOUND_CLOSE:
                soundManager.play("close");
                break
            case MessagesConstants.CONTENT_FOCUS:
                focusContent();
                break;
            case MessagesConstants.MENU_HIDE:
                sendToHeader({
                    type: MessagesConstants.MENU_HIDE
                });
                break;
            case MessagesConstants.MENU_SHOW:
                sendToHeader({
                    type: MessagesConstants.MENU_SHOW
                });
                break;
        }
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    AUDIO FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initAudio() {
    soundManager = new SoundsManager(document.body, {
        rootPath: ofpWin.rootPath + '../',
        directoryName: 'sons/',
        commonRelativePath: "../common/content/"
    });

    if (typeof soundsData === 'undefined') {
        return false;
    }

    soundManager.addSounds(soundsData);
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    VIDEO FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

var quality = "high", preloader, videoWraps, videoDatas = {},
videosList = null,
videoFormat = preferWEBM() ? 'webm' : 'mp4',
videoQuality = quality=="high" ? '' : '_480p';

function initVideo(){
    videosList = {};

    if(Object.keys(videoDatas).length>0){
        for(var prop in videoDatas){
            var container = stageDom.querySelector("#Stage_"+prop),
            num = parseInt(prop.match(/e\d.*_/g).join("").replace(/(\_|\D)/g,"")),
            //\_e\d.*\_
            datas = videoDatas[prop];
            if(!container){
                console.warn("l'id spécifié dans videoDatas de la leçon ne correspond pas à un élément du dom.");
                continue;
            }
            if(videosList[prop]==undefined){
                videosList[prop] = {
                    screen:num,
                    container:container,
                    src:datas.src,
                    loop:datas.loop,
                    loadScreens:datas.loadScreens,
                    timeStart:datas.timeStart,
                    timeEnd:datas.timeEnd,
                    onEnded:datas.onEnded,
                    onTimeUpdate:datas.onTimeUpdate,
                    preloaded:false,
                    ready:false,
                    manager:null
                }
            }
        }
    }

    if(Object.keys(videosList).length==0){
        videosList = null;
    }
}

// -> vérification si besoin de préloader des vidéos selon l'écran sur lequel on revient (prenant en compte écran précédent - actuel - suivant)
function initPreload(c,callback){
    var sDatas = scorm.parsedDatas[currentFileId-1],
    current = c!=undefined ? c : parseInt(sDatas[2]),
    prev = current==1 ? null : current-1,
    next = current==parseInt(sDatas[1]) ? null : current+1,
    toPreload = [], toLoad = [],
    ftc = typeof callback=="function" ? callback : function(){},
    check = function(num){
        for(var prop in videosList){
            var datas = videosList[prop];
            if(datas.screen!=num || (datas.screen==num && datas.preloaded==true)){
                if(datas.loadScreens){
                    var sc = !Array.isArray(datas.loadScreens) ? [datas.loadScreens] : datas.loadScreens;
                    for(var s=1; s<=sc.length;s++){
                        if(sc[s-1]==num){
                            if(datas.container.querySelector("video")==undefined){
                                datas.src = "videos/"+datas.src+videoQuality+"."+videoFormat;
                                toPreload.push(datas.src);
                                datas.ready = true;
                            }  
                        }
                    }
                    //Chargement via la paramètres screenLoad
                }
                continue;
            }
            if(datas.container.querySelector("video")==undefined){
                if(datas.src.indexOf(videoFormat)==-1 && datas.src.indexOf("videos/")==-1){
                    datas.src = "videos/"+datas.src+videoQuality+"."+videoFormat;
                }
                //console.log(datas.src);
                toPreload.push(datas.src);
                datas.ready = true;
            }
        }
    }

    check(current);
    check(prev);
    check(next);



    if(toPreload.length>0){
        preloadVideos(toPreload,ftc);
    } else {
        ftc();
    }
}

function preloadVideos(toPreload,callback){
    preloader = new Preloader();
    preloader.on( 'complete', function (e) {
        loadVideos(toPreload.length,callback);
    });
    preloader.load(toPreload);
}

function loadVideos(total,callback){
    var count = 0;

    for(var prop in videosList){
        var datas = videosList[prop];
        if(datas.ready==true && datas.preloaded==false){
            videosList[prop].preloaded = true;
            var src = getSource(datas.src);

            datas.manager = new VideoManager({
                container:datas.container,
                src:src,
                loop:datas.loop,
                timeStart:datas.timeStart,
                timeEnd:datas.timeEnd,
                onEnded:datas.onEnded,
                onTimeUpdate:datas.onTimeUpdate,
                controllable:false,
                onLoadedMetaData:function(){
                    count++;
                    if(count==total){
                        callback();
                    }
                }
            });
        }
    }
}

function playVideo(datas,time){
    if(datas.manager){
        datas.manager.setAt(time);
        datas.manager.play();    
    }
}

function pauseVideo(datas,time){
    if(datas.manager){
        datas.manager.pause();
        datas.manager.setAt(time);     
    }
}

function setTimeEndVideo(datas,time){
    if(datas.manager){
        datas.manager.timeEnd = time;
    }
}

function showVideo(datas){
    datas.container.classList.remove("unavailable");
}

function hideVideo(datas){
    datas.container.classList.add("unavailable");
}

function pauseAllVideos(){
    for(var prop in videosList){
        var datas = videosList[prop];
        if(datas.manager && datas.manager.isPlaying()==true){
            datas.manager.pause();
        }
    }
}

function getSource(src) {
    var rawData = preloader.getResult(src,true);
    return rawData instanceof File ? URL.createObjectURL( rawData ) : src;
}

function preferWEBM(){
    return document.createElement('video').canPlayType('video/webm') !== '';
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////    UTILITIES FUNCTIONS    ////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -> Récupère toutes les sections et les cache
function setSections(){
    sections = stageDom.querySelectorAll(".section");
    for(var s=1; s<=sections.length; s++){
        var section = sections[s-1];
        section.classList.add("hidden");
    }
}

// -> Initialise les events des classes des boutons
function setButtons() {
    $(document).find(".btNext").on(Constants.CLICK_TOUCH, function() {
        if(timeline.status=="normal"){
            if(this.go!=undefined){
                navigation.load(this.go,true,true);
                delete this.go; 
            } else {
                navigation.next(true);
            }
            soundManager.play("click");    
        }
        
        //Si on clique sur suivant mais que précédent avait un paramètre go, il faut le supprimer
        /*
        if(footer.querySelector(".btPrev").go!=undefined){
            delete footer.querySelector(".btPrev").go;
        }
        */
    });

    $(document).find(".btPrev").on(Constants.CLICK_TOUCH, function() {  
        if(timeline.status=="normal"){
            if(this.go!=undefined){
                navigation.load(this.go,true,true);
                delete this.go; 
            } else {
               navigation.prev(true);
            }
            soundManager.play("click");
        }
        //Si on clique sur précédent mais que suivant avait un paramètre go, il faut le supprimer
        /*
        if(footer.querySelector(".btNext").go!=undefined){
            delete footer.querySelector(".btNext").go;
        }
        */
    });

    $(document).find(".btLoadScreen").on("click tap touch", function(e) {
        var num = $(this).attr("class").match(/btLoadScreen-([0-9]+)/)[1],
        forcePlaying = $(this)[0].className.indexOf("noPlay") != -1 ? false : true;
        navigation.load("ecran_"+num,true,forcePlaying);
        soundManager.play("click");
    });

    $(document).find(".btGo").on(Constants.CLICK_TOUCH, function() {
        nextLesson();
    });

    $(document).find(".btQuit").on(Constants.CLICK_TOUCH, function() {
        ofp.close();
    });

    $(document).find(".btPopupQuit").on(Constants.CLICK_TOUCH, function() {
        //openPopup(buildPopup(languageManager.getTextFromJSON("popupQuit_txt_1")+"<br><span style='text-transform:none;font-size:2vh;'>"+languageManager.getTextFromJSON("popupQuit_txt_2")+"</span>"),function(){ofp.close()});
    });

    $(document).find(".btLaunch").on(Constants.CLICK_TOUCH, function() {
        soundManager.play("click");
        ofp.loader.show();
        var id = getFirstIncompleteFileId();
        loadFile(id);
    });

    $(document).find(".btMail").on(Constants.CLICK_TOUCH,function(){
        footer.querySelector("#tutorat").classList.add("hidden");
        ofp.tutor.openMail();
    });
    
    $(document).find(".btChat").on(Constants.CLICK_TOUCH,function(){
        footer.querySelector("#tutorat").classList.add("hidden");
        ofp.tutor.openChat();
    });
}

// -> patch pour le navigateur Chrome
function patchChrome() {
    var patch = getPatch();
    var ecartScale = Math.abs(1 - patch);
    if (ecartScale > 0.2) {
        stageDom.classList.add('blurPatchChrome');
    } else {
        stageDom.classList.remove('blurPatchChrome');
    }
}

// -> scale un élément selon le patch de l'interface
function resizeHtmlElement(htmlElement){
    var value = 'scale(' + getPatch(); + ')';
    htmlElement.css({
        '-webkit-transform': value,
        '-moz-transform': value,
        '-ms-transform': value,
        '-o-transform': value,
        'transform': value
    });
}

// -> cache ou montre les boutons communs
function hideCommonButtons(sym,not){
    var buttons = sym.getSymbolElement()[0].querySelectorAll(".commonButton");
    for(var b=1; b<=buttons.length; b++){
        var button = buttons[b-1];
        button.classList.add("hidden");
    }
    if(not!=undefined && Array.isArray(not)){
        for(var n=1; n<=not.length; n++){
            var button = not[n-1];
            button.classList.remove("hidden");
        }
    }
}

// > Renvoie le type d'une variable
function getType(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1);
}

// > Renvoie la valeur choisie entre un min et un max (inclus)
function clamp(value,min,max) {
    return Math.min(Math.max(value, min), max);
}

// -> récupère la fenêtre avec une propriété
function findWindowOwnerOf(property, win) {
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

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////           UTILS          //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

// -> retourne le nom du navigateur utilisé
function getBrowserName() {
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function(p) {
            return p.toString() === '[object SafariRemoteNotification]';
        })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
    var isIE = /* @cc_on!@*/ false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    var isChrome = !!window.chrome;
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    if (isIE) {
        return 'IE';
    }
    if (isEdge) {
        return 'Edge';
    }
    if (isChrome) {
        return 'Chrome';
    }
    if (isFirefox) {
        return 'Firefox';
    }
    if (isSafari) {
        return 'Safari';
    }
    if (isOpera) {
        return 'Opera';
    }
    if (isBlink) {
        return 'Blink';
    }
}

// -> Position par rapport à l'écran d'un élément
function getOffset(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
        left: box.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
    };
}

// -> Récupère la position du curseur par rapport à un élément
function getCursorIn(event,elem) {
    var offset = getOffset(elem);
    return {
        x: (event.clientX - offset.left),
        y: (event.clientY - offset.top)
    };
}

function pulseAnims() {
    pulseAnim = setInterval(function(){
        $(".pulse").each(function(i,el){
            if( $(el).is(":visible") ) {
                var scaleX = (el.clientWidth+50)/el.clientWidth,
                    scaleY = (el.clientHeight+50)/el.clientHeight;

                var tl = anime.timeline({
                    easing: 'easeOutCubic',
                    duration: 400
                });
                tl.add({
                    targets: el,
                    scaleX: 1,
                    scaleY: 1,
                    duration:10,
                    opacity:1
                });
                tl.add({
                    targets: el,
                    scaleX: scaleX,
                    scaleY: scaleY,
                    opacity:0
                }); 
            }
            else {
                $(el).css({
                    opacity: 0,
                    transform: ""
                });
            }
        });
    }, 1000 );
}

// -> Moteur clique classique
function clique(props){
    var datas = props.datas,
    buttons = props.buttons,
    btValidate = props.btValidate != undefined ? props.btValidate : null,
    btClass = typeof props.btClass == "string" ? props.btClass : "inactive",
    attempts = props.attempts != undefined ? props.attempts : 1,
    onEnd = props.onEnd!= undefined && typeof props.onEnd == "function" ? props.onEnd : function(){},
    onCustomClick = props.onCustomClick!= undefined && typeof props.onCustomClick == "function" ? props.onCustomClick : function(){},
    onCorrection = props.onCorrection!= undefined && typeof props.onCorrection == "function" ? props.onCorrection : function(){},
    correctionAuto = props.correctionAuto != undefined ? true : false,
    noCorrection = props.noCorrection != undefined ? true : false,
    multi = 0, currentAttempt = 1;

    var unCheckAll = function(){
        for(var b=1; b<=buttons.length; b++){
            var button = buttons[b-1];
            button.classList.remove("unselected"); 
            button.classList.remove("selected");
            button.classList.remove("right"); 
            button.classList.remove("wrong");
        }
    };

    var unSelectAll = function(){
        for(var b=1; b<=buttons.length; b++){
            var button = buttons[b-1];
            if(!button.classList.contains("selected")){
                button.classList.add("unselected");    
            }
            
        }
    };

    var checkIfOneClicked = function(){
        for(var b=1; b<=buttons.length; b++){
            var button = buttons[b-1];
            if(button.classList.contains("selected")){
                return true;    
            }  
        }
        return false;
    };

    var onClick = function(){
        if(this.classList.contains("selected")){
            this.classList.remove("selected");
            if(multi==1){
                unCheckAll();
            }
        } else {
            if(multi==1){
                unCheckAll();    
            }
            this.classList.add("selected");
            if(multi==1){
                unSelectAll();    
            }
        }

        onCustomClick();

        if(btValidate!=null){
            if(checkIfOneClicked()){
                btValidate.classList.remove(btClass);
            } else {
                btValidate.classList.add(btClass);
            }
        } else {
            if(checkIfOneClicked()){
                validation();
            }
        }
    };

    var init=function(){
        for(var c=1; c<=buttons.length; c++){
            var button = buttons[c-1];
            button.answer = datas[c-1].answer;
            button.classList.remove("unselected");
            button.classList.remove("selected");
            button.classList.remove("wrong");
            button.classList.remove("right");
            button.classList.remove("corrected");
            button.style["pointer-events"] = "";
            button.onClick = onClick;
            $(button).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,button.onClick);    
            multi = datas[c-1].answer == true ? multi+1 : multi;
        }

        if(btValidate!=null){
            btValidate.classList.add(btClass);
            btValidate.validation = validation;
            btValidate.correction = correction;
            $(btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,btValidate.validation);
        }  
    };

    var disposer = function(){
        for(var c=1; c<=buttons.length; c++){
            var button = buttons[c-1];
            button.classList.remove("unselected");
            button.classList.remove("selected");
            button.style["pointer-events"] = "none";
            $(button).off(Constants.CLICK_TOUCH);
        }
        if(btValidate!=null){
            $(btValidate).off(Constants.CLICK_TOUCH);
            btValidate.classList.add(btClass);
        }
    };

    var validation = function(){
        var count=0;
        for(var b=1; b<=buttons.length; b++){
            var button = buttons[b-1];
            if(button.classList.contains("selected") && button.answer==true){
                button.classList.remove("selected");
                if(noCorrection==false){
                    button.classList.add("right");
                }
                count++;
            } else if(button.classList.contains("selected") && button.answer==false){
                button.classList.remove("selected");
                if(noCorrection==false){
                    button.classList.add("wrong");
                } 
                count--;
            } else if(!button.classList.contains("selected") && button.answer==true){
                button.classList.remove("selected");
                button.classList.add("unselected");  
                count--;
            }
        }    

        if(count==multi){
            disposer();
            onEnd(true);
        } else {
            if(currentAttempt<attempts){
                currentAttempt++;
                unCheckAll();
            } else {
                if(noCorrection){
                    disposer();
                    onEnd((count==multi));
                }
                else if(correctionAuto || btValidate==null){
                    correction();     
                } else {
                    onCorrection();
                    $(btValidate).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,btValidate.correction);  
                }
            }
        }
    };

    var correction = function(){
        for(var b=1; b<=buttons.length; b++){
            var button = buttons[b-1];
            if(!button.classList.contains("selected") && !button.classList.contains("right") && button.answer==true){
                button.classList.remove("unselected");
                button.classList.add("corrected");  
            }   
        }
        disposer();
        onEnd(false); 
    };

    init();
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////    DEBUG MODE   //////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function (win) {
    var debugMode = new DebugMode(debug);

    function debugFunction(event) {
        if (!navigation || !debugMode.active) {
            return false;
        }
        var key = event.data.key;

        switch (key) {
            case DebugMode.LEFT:
                if(timeline){
                    timeline.stopPlaying();
                }
                navigation.prev(true);
                //navigation.enable();
                //navigation.previous();
                break;
            case DebugMode.RIGHT:
                if(timeline){
                    timeline.stopPlaying();
                }
                navigation.next(true);
                //navigation.enable();
                //navigation.next();
                break;
            case DebugMode.UP:
                loadNextFile();
                break;
            case DebugMode.DOWN:
                loadPrevFile();
                break;
        }
    }

    debugMode.on(DebugMode.PRESS, debugFunction);

    debugMode.on(DebugMode.ENABLED, function () {
        new Toast({
            container: document.body,
            message: 'Debug actif',
            status: 'success',
        });
    });

    debugMode.on(DebugMode.DISABLED, function () {
        new Toast({
            container: document.body,
            message: 'Debug inactif',
            status: 'error',
        });
    });

    debugMode.init();
})(window);

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////    INIT   ///////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener(Constants.LOAD, contentLoaded);