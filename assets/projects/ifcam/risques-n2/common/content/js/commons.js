var ofp = InterfaceFinder.searchOfp();
var ofpWin = InterfaceFinder.searchOfpWindow();
var scorm = new ScormManager(ofp, {
    isFileCompleted: isFileCompleted,
    allFilesCompleted: allFilesCompleted
});
var navigation = new NavigationManager({
    onCustomNext: navNext,
    onCustomPrev: navPrev,
    onCustomAfterMax: navMax,
    onCustomLoad: navLoad,
    onCustomOn: navOn,
    onCustomOff: navOff,
    onCustomSave: save
});
var languageManager = null;
var languageSelection = false;
var timeline = null;
var soundManager = null;
var videoManager = null;
var view = null;
var message = new Message();
var files;
var dataP;
var currentFileId;
var nbLessons;
var mainDom;
var soundTriggerDom;
var sections;
var languagesDom;
var subtitles;
var version;

var contentLoadedReady = false;
var mobile = false;

ofp.debug = ofp.getFromDataProvider('debug');
var debug = ofp.getFromDataProvider('debug');

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////    INITIALISATION FUNCTIONS    ///////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function contentLoaded() {
    contentLoadedReady = true;
    soundTriggerDom = ofpWin.document.querySelector("#sound-trigger");
    mainDom = document.querySelector("#main");
    files = ofp.getFromDataProvider('files');
    dataP = ofp.getFromDataProvider('data');
    languageSelection = dataP.languageSelection;
    version = dataP.version;
    currentFileId = ofp.player.actualFile.id;
    nbLessons = ofp && files.filter(function (file) { return file.type === 'lesson'; }).length;
    mobile = Constants.CLICK_TOUCH == 'touchend';
    listenMessages();
    setDebug();
    initTimeline();
    initLanguage();
    initSubtitles();
    initAudio();
    initLoadings();

    window.removeEventListener(Constants.LOAD, contentLoaded);
}

function initLesson() {
    languageManager.render();
    setSections();
    setButtons();
    setScorm();
    setNavigation();
    setVersion();
    sendToMenu({
        type: MessagesConstants.MENU_TOGGLE,
        condition:"opened",
        byFooter:true
    });
    sendToMenu({
        type: MessagesConstants.MENU_UPDATE,
        languageSelection:languageSelection
    });
    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        progress:(navigation.current<10 ? "0"+navigation.current : navigation.current)+"/"+(navigation.total<10 ? "0"+navigation.total : navigation.total),
        subtitles:dataP.subtitles
    });
    if(currentFileId!=1){
        sendToFooter({
            type: MessagesConstants.FOOTER_SHOW,
        });
        sendToHeader({
            type: MessagesConstants.HEADER_SHOW,
        });
    }
    //Si aucune intéraction utilisateur au démarrage, on force un click
    var canPlayOnInit = soundManager.canPlaySounds().then(launchTimeline).catch(function(){
        ofp.loader.hide();
        soundTriggerDom.style.display = "";
        soundTriggerDom.querySelector("p").innerHTML = languageManager.getTextFromJSON("start");
        $(soundTriggerDom.querySelector("#sound-trigger-button")).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH,launchTimeline);
    })
}

// -> Lancée uniquement si debug à true (set les status si il est estimé que le fichier a été entièrement vu)
function setDebug() {
    if (debug === true) {
        for (var f = 1; f <= ofp.player.files.length; f++) {
            var fl = ofp.player.files[f - 1],
                datas = scorm.parsedDatas[f - 1];
            if (parseInt(datas[0]) >= parseInt(datas[1])) {
                fl.status = "c";
                fl.answered = true;
            }
            else if (parseInt(datas[0]) > 1) {
                fl.status = "i";
            }
        }
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////    SCORM FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -> Met à jour le scorm
function setScorm() {
    
    if(debug==true){
        return;
    }
    
    // Si écran actuel est le même que le dernier
    if ((scorm.parsedDatas[currentFileId - 1][2] == scorm.parsedDatas[currentFileId - 1][1])) {
        scorm.parsedDatas[currentFileId - 1][2] = 1;
        save();
    }
    //SPEC
    //FILE 1 - RETOUR ÉCRAN 2 AVEC MENU DISPLAY
    if(currentFileId==1 && scorm.parsedDatas[currentFileId - 1][2]== 2){
        scorm.parsedDatas[currentFileId - 1][2] = 3;
    }
}


// -> Vérifie si la leçon est completed ou non
function isFileCompleted() {
    if (((parseInt(scorm.parsedDatas[currentFileId - 1][0]) / parseInt(scorm.parsedDatas[currentFileId - 1][1])) >= 1)) {
        return true;
    }
    return false;
}

// -> Vérifie si la formation est terminée ou non
function allFilesCompleted() {
    return (ofp.player.getAnsweredFiles().length === ofp.player.files.length && ofp.getRawScore()>=scorm.isScoreSaved);
}

// -> Fonction de sauvegarde
function save() {
    onCustomSave();
    var throttleData = scorm.save();
    if (throttleData) {
        if (throttleData.execute) {
            throttleData.execute();
        }
    }
}

// -> Fonction lancée pendant une sauvegarde SCORM
function onCustomSave() {
    //Mise à jour des valeurs current et maxVu
    scorm.parsedDatas[currentFileId - 1][2] = navigation.current;
    scorm.parsedDatas[currentFileId - 1][0] = Math.max(navigation.current, scorm.parsedDatas[currentFileId - 1][0]);

    //Calcul de la progression    
    var percent = 0, mainPercent = 0;
    for (var a = 1; a <= scorm.parsedDatas.length; a++) {
        var datas = scorm.parsedDatas[a - 1];
        percent += Math.round((parseInt(datas[0]) / parseInt(datas[1])) * 100);
    }
    mainPercent = Math.round(percent / scorm.parsedDatas.length) / 100;
    scorm.progress = mainPercent;

    //Mise à jour du footer
    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        progress:(navigation.current<10 ? "0"+navigation.current : navigation.current)+"/"+(navigation.total<10 ? "0"+navigation.total : navigation.total)
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////    NAVIGATION HANDLERS    ///////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setNavigation() {
    navigation.isOff();
    navigation.set(scorm.parsedDatas[currentFileId - 1][2], scorm.parsedDatas[currentFileId - 1][0], scorm.parsedDatas[currentFileId - 1][1]);
}

function navNext(c) {
    soundManager.stopAll();
    if (videoManager) {
        videoManager.stop();
    }
    timeline.play(c - 1);
}

function navPrev(c, forcePlaying) {
    soundManager.stopAll();
    if (videoManager) {
        videoManager.stop();
    }
    if (forcePlaying) {
        timeline.playFrom(c - 1);
    } else {
        timeline.stopAt(c - 1);
    }
}

function navLoad(c, forcePlaying) {
    if (forcePlaying) {
        timeline.playFrom(c - 1, { ignoreFinished: true });
    } else {
        timeline.stopAt(c - 1);
    }
}

function navMax() {
    var nextFile = ofp.player.getFileById(currentFileId + 1);
    if (nextFile) {
        loadFile(nextFile.id);
    }
}

function navOn(b) {
    sendToFooter({
        type: MessagesConstants.FOOTER_ON,
        which: b
    });
}

function navOff(b) {
    sendToFooter({
        type: MessagesConstants.FOOTER_OFF,
        which: b
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////    TIMELINE FUNCTIONS    //////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initTimeline() {
    timelineDatas.triggerEl = mainDom;
    timeline = new Timeline(timelineDatas);
}

function launchTimeline() {
    soundTriggerDom.style.display = "none";
    if (navigation.current == 1) {
        setTimeout(function () {
            ofp.loader.hide();
            timeline.play(0);
        }, 1);
    } else {
        ofp.loader.hide();
        timeline.stopAt(navigation.current - 1);
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    AUDIO FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initAudio() {
    soundManager = new SoundsManager(document.body, {
        rootPath: ofpWin.rootPath + "../",
        directoryName: 'sounds/'+languageManager.language+'/',
        cbPlay:subtitles.handleDisplay,
        cbTimeUpdate:function(e){
            sendToFooter({
                type: MessagesConstants.FOOTER_UPDATE,
                duration: (this.currentTime/this.duration*100)
            }); 
        }
    });

    if (typeof soundsData === "undefined") {
        return false;
    }

    soundManager.addSounds(soundsData);
}

function getSoundDuration(id){
    if(!soundManager){
        return 0;
    }
    var duration = soundManager.getSoundDuration(id);
    if(duration){
        return ((duration * 1000) + 1000);
    } else {
        console.warn("The id "+id+" does not match any sound. 0 is returned instead.");
        return 0;
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    SUBTITLES FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initSubtitles(){
    subtitles = new Subtitles();
}

function Subtitles(){
    this.element;
    this.state = "off";
    this.timeout;
    this.handleHide = this.hide.bind(this);
    this.handleDisplay = this.display.bind(this);
    this.init();
}

Subtitles.prototype = {
    init:function(){
        if(!mainDom.querySelector("#subtitles-wrap")){
            var el = document.createElement("div");
            el.id = "subtitles-wrap";
            el.className = "absolute flexCenter";
            el.innerHTML = "<p class='Roboto-Regular'></p>"
            mainDom.appendChild(el);
        }
        this.element = mainDom.querySelector("#subtitles-wrap");
        this.element.classList.remove("on");
        
    },
    show:function(force){
        if(this.state=="on"){
            if(!this.element.classList.contains("on")){
                this.element.classList.add("on");
            }
        }
    },
    hide:function(force){
        if(force){
            if(this.timeout){
                clearTimeout(this.timeout);
            }
            this.state = "off";
            this.element.classList.remove("on");
        } else {
            if(this.state=="on"){
                this.element.classList.remove("on");
            }
        }
    },
    display:function(e){
        if(e && e.target && e.target.id){
            var id = e.target.id;
            if(this.timeout){
                clearTimeout(this.timeout);
            }
            if(!this.element.classList.contains("on")){
                this.show();
            }
            this.element.querySelector("p").innerHTML = languageManager.jsonObj[id];
            var duration = getSoundDuration(id);
            this.timeout = setTimeout(this.handleHide,(duration+200));   
        }
        
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    VIDEO FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

var quality = "high",
videoFormat = preferWEBM() ? 'webm' : 'mp4',
videoQuality = quality=="high" ? '' : '_480p';

function initVideo(){
    if (typeof videosData === "undefined") {
        return false;
    }

    videoManager = new VideoManager({
        container: mainDom.querySelector("#"+videosData.containerId),
        src:languageManager.jsonObj[videosData.src],
        onEnded:videosData.onEnded,
        onTimeUpdate:videosData.onTimeUpdate
    });
}

function getSource(src) {
    var rawData = preloader.getResult(src,true);
    return rawData instanceof File ? URL.createObjectURL( rawData ) : src;
}

function preferWEBM(){
    return document.createElement('video').canPlayType('video/webm') !== '';
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////   TRANSLATION FUNCTIONS    //////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setPopupLanguage(el) {
    var flags = mainDom.querySelector("#languages").querySelector(".languages-wrap").querySelectorAll("div");
    for (var f = 1; f <= flags.length; f++) {
        var flag = flags[f-1],
            language = languageManager.languages[f - 1];
        if (language) {
            flag.style["background-image"] = "url(../../menu/img/" + language + ".png)";
            flag.setAttribute("language", language);
            $(flag).off(Constants.CLICK_TOUCH).on(Constants.CLICK_TOUCH, pickLanguage);
        } else {
            flag.classList.add("hidden");
        }
    }
}

function pickLanguage() {
    if (timeline.status == "normal") {
        changeLanguage(this.getAttribute("language"));
        timeline.play("languagePopupHide");
    }
}

function setTranslations() {
    mainDom.setAttribute("language", languageManager.language);
    //SI PENDANT LE QUIZ, IL FAUT REINIT LA QUESTION POUR LES LISTES
    if (typeof quiz !== 'undefined') {
        var question = quiz.options.questions[quiz.index]
        if(question.lists){
            quiz.render()
        }
        if(navigation.current === 3){
            var resultsGroupEl = sections[0].querySelector("#s3-group"),
            resultTxt3El = resultsGroupEl.querySelector(".s3-feedback-txt-score")
            var str = languageManager.jsonObj["s3-feedback-txt-score"],
            toReplace = str.match(/<.*?>/g);
            str = str.replace(toReplace[0],quiz.scoreScale);
            resultTxt3El.innerHTML = str;
        }
    }
    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        title: languageManager.jsonObj["footer-title-lesson-1"]
    });
    sendToHeader({
        type: MessagesConstants.HEADER_UPDATE,
        title: languageManager.jsonObj["header-title-module"]
    });
    sendToMenu({
        type: MessagesConstants.MENU_UPDATE,
        texts: languageManager.getTextsFromJSON("menu-"),
        language:languageManager.language
    });
    var words = languageManager.getTextsFromJSON("glossary-word-");
    var definitions = languageManager.getTextsFromJSON("glossary-definition-");
    sendToGlossary({
        type: MessagesConstants.GLOSSARY_UPDATE,
        title:languageManager.jsonObj["glossary-title"],
        words:words,
        definitions:definitions,
        language:languageManager.language
    });
    glossaryConnections(words);
}

function changeLanguage(l) {
    scorm.parsedDatas[6] = l;
    ofp.lang = l;
    languageManager.setLanguage({
        language:l,
        callback:function(){
            languageManager.render();
        }
    });
    soundManager.stopAll();
    initAudio()
    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        subtitles:"off"
    });
    save()
}

function initLanguage() {
    var l = typeof scorm.parsedDatas[6] === "string" ? scorm.parsedDatas[6] : ofp.getFromDataProvider('lang');

    languageManager = new LanguageManager({
        languages: dataP.languages,
        onCustomSwitchLanguage: setTranslations,
        wrapEl: mainDom,
        language: l,
        jsonURL: "./json/"
    });
    ofp.lang = languageManager.language;
}

function getDelayByLanguage(str){
    if(!languageManager){
        return 0;
    }
    var obj = JSON.parse(str)
    var duration = obj[languageManager.language];
    if(typeof duration == "number"){
        return duration;
    } else {
        console.warn("The id "+id+" does not match any sound. 0 is returned instead.");
        return 0;
    }
}

function glossaryConnections(words){
    var toCheck = languageManager.getTextsFromJSON(/s[0-9]+-/);

    function addSpan(el,prop,toCheckWord){
        var innerHTML = el.innerHTML
        el.innerHTML = innerHTML.replace(toCheckWord,"<span class='glossary-link' word='"+prop+"'>"+toCheckWord+"</span>");
        var spans = el.querySelectorAll(".glossary-link");
        for(var s=1; s<=spans.length; s++){
            $(spans[s-1]).on(Constants.CLICK_TOUCH,glossaryShowWord);
        } 
    }

    for(var prop in words){
        var word = words[prop];
        var wordReplacement = languageManager.getTextFromJSON(prop.replace("-word-","-replacement-"))
        var keys = word.split(/:|ou/g);
        for(var prop2 in toCheck){
            var toCheckText = toCheck[prop2],
            keysFilter = keys.filter(function(key){if(toCheckText.indexOf(key.trim())!=-1) {return key}}),
            conditionWord = toCheckText.indexOf(word)!=-1,
            conditionWordLowered = toCheckText.indexOf(word.toLowerCase())!=-1,
            conditionKeys = keysFilter.length>0,
            conditionConnect = conditionWord || conditionWordLowered || conditionKeys,
            toCheckWord = conditionKeys==true ? keysFilter[0].trim() : conditionWordLowered ? word.toLowerCase() : word;

            if(typeof wordReplacement == "string"){
                toCheckWord = []
                var replacements = wordReplacement.split("|")
                for(var r=1; r<=replacements.length; r++){
                    var replacement = replacements[r-1];
                    if(toCheckText.indexOf(replacement)!=-1){
                        toCheckWord.push(replacement);
                        conditionConnect = true;
                    }
                }
            }
            
            if(conditionConnect==true){
                var el = mainDom.querySelector("."+prop2);
                if(el){
                    if(Array.isArray(toCheckWord)){
                        for(var w=1; w<=toCheckWord.length; w++){
                            addSpan(el,prop,toCheckWord[w-1])
                        }
                    } else {
                       addSpan(el,prop,toCheckWord)   
                    }
                     
                }
            }
        }
    }
}

function glossaryShowWord(){
    sendToGlossary({
        type: MessagesConstants.GLOSSARY_SHOW,
        condition:"opened"
    });
    sendToGlossary({
        type: MessagesConstants.GLOSSARY_UPDATE,
        word:this.getAttribute("word")
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////    FILE FUNCTIONS    ////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -> charge un file du dataprovider selon l'id passé en paramètre
function loadFile(id) {
    ofp.loader.show();
    ofp.openFileById(id);
}

function isFormationStarted() {
    return ((ofp.player.getAnsweredFiles().length) > 0);
}

// -> retourne le premier fichier avec le statut 'incomplete' (id 0 est exclu)
function getFirstIncompleteFileId() {
    var incompleteFile = ofp.player.getNotAnsweredFiles().filter(function (f) { if (f.status == "i" && f.id != 0) { return f } })[0],
        undoneFile = ofp.player.getNotAnsweredFiles().filter(function (f) { if (f.status == "na" && f.id != 0) { return f } })[0];
    if (incompleteFile) {
        return incompleteFile.id;
    }
    else if (undoneFile) {
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

function sendToGlossary(datas) {
    var glossary = ofpWin.document.querySelector('#glossary');
    if (glossary) {
        message.sendTo(glossary.contentWindow, datas);
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
                if (timeline.status == "normal") {
                    var value = typeof datas.value == "number" ? datas.value : 1;
                    navigation.load(value, true, true);
                }
                break;
            case MessagesConstants.CONTENT_PREVIOUS:
                if (timeline.status == "normal") {
                    var value = typeof datas.value == "number" ? datas.value : -1;
                    navigation.load(value, true);
                }
                break;
            case MessagesConstants.CONTENT_UPDATE:
                navigation.update();
                break;
            case MessagesConstants.CONTENT_CHANGE:
                loadFile(datas.id);
                break;
            case MessagesConstants.CONTENT_SWITCH_LANGUAGE:
                if(datas.language!=languageManager.language){
                    soundManager.stopAll();
                    changeLanguage(datas.language);    
                }
                break;
            case MessagesConstants.CONTENT_VOLUME:
                soundManager.setAllVolume(datas.value);
                if (videoManager) {
                    videoManager.video.volume = datas.value;
                }
                break;
            case MessagesConstants.SUBTITLES_OFF:
                dataP.subtitles = "off";
                subtitles.hide(true);
                break;
            case MessagesConstants.SUBTITLES_ON:
                dataP.subtitles = "on";
                subtitles.state = "on";
                if(soundManager.isSoundPlaying()==true){
                    subtitles.show();
                }
                break;
        }
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////    LOADING FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initLoadings() {
    Promise.all([
        languageManager.loadJSON(languageManager.jsonURL + languageManager.language + ".json")
    ])
    .then(function (reply) {
        initLesson();
    })
    .catch(function (err) {
        console.log(err);
    })
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////    UTILITIES FUNCTIONS    ////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -> set la version du quiz
function setVersion(){
    var versionEl = mainDom.querySelector(".version");
    if(versionEl){
        versionEl.innerHTML = version;
    } 
}


// -> Récupère toutes les sections et les cache
function setSections() {
    sections = mainDom.querySelectorAll(".section");
    for (var s = 1; s <= sections.length; s++) {
        var section = sections[s - 1];
        section.classList.add("hidden");
    }
}

function showSection(id) {
    var tab = !Array.isArray(id) ? [id] : id;
    for (var t = 1; t <= tab.length; t++) {
        var ta = tab[t - 1];
        if (typeof ta == "string") {
            var section = cUtils.array.from(sections).filter(function (s) { return s.id == ta })[0];
            if (section) {
                section.classList.remove("hidden");
            }
        } else {
            sections[ta].classList.remove("hidden");
        }
    }

}

function hideSection(id) {
    var tab = !Array.isArray(id) ? [id] : id;
    for (var t = 1; t <= tab.length; t++) {
        var ta = tab[t - 1];
        if (typeof ta == "string") {
            var section = cUtils.array.from(sections).filter(function (s) { return s.id == ta })[0];
            if (section) {
                section.classList.add("hidden");
            }
        } else {
            sections[ta].classList.add("hidden");
        }
    }
}

// -> Initialise les events des classes des boutons
function setButtons() {
    $(document).find(".btNext").on(Constants.CLICK_TOUCH, function () {
        if (timeline.status == "normal") {
            navigation.next(true);
        }
    });
    $(document).find(".btPrev").on(Constants.CLICK_TOUCH, function () {
        if (timeline.status == "normal") {
            navigation.prev(true);
        }
    });
    $(document).find(".btPlayFrom").on(Constants.CLICK_TOUCH, function () {
        var from = this.getAttribute("from");
        if (timeline.status == "normal") {
            navigation.load(from, true, true);
        }
    });
    $(document).find(".btQuit").on(Constants.CLICK_TOUCH, function () {
        ofp.close();
    });
    $(document).find(".btPopupQuit").on(Constants.CLICK_TOUCH, function () {
        //openPopup(buildPopup(languageManager.getTextFromJSON("popupQuit_txt_1")+"<br><span style='text-transform:none;font-size:2vh;'>"+languageManager.getTextFromJSON("popupQuit_txt_2")+"</span>"),function(){ofp.close()});
    });
    $(document).find(".btGlossary").on(Constants.CLICK_TOUCH,glossaryShowWord);
}


//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////           UTILS          //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

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
function resizeHtmlElement(htmlElement) {
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
function hideCommonButtons(sym, not) {
    var buttons = sym.getSymbolElement()[0].querySelectorAll(".commonButton");
    for (var b = 1; b <= buttons.length; b++) {
        var button = buttons[b - 1];
        button.classList.add("hidden");
    }
    if (not != undefined && Array.isArray(not)) {
        for (var n = 1; n <= not.length; n++) {
            var button = not[n - 1];
            button.classList.remove("hidden");
        }
    }
}

// > Renvoie le type d'une variable
function getType(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1);
}

// > Renvoie la valeur choisie entre un min et un max (inclus)
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// -> récupère la fenêtre avec une propriété
function findWindowOwnerOf(property, win) {
    var currentWindow = win || window;
    var isDefined = function (elem) {
        return elem && typeof elem !== 'undefined';
    };
    var ownerWindow = isDefined(currentWindow[property]) ? currentWindow : null;
    while (!ownerWindow && currentWindow.parent && currentWindow.parent != currentWindow) {
        currentWindow = currentWindow.parent;
        try {
            if (isDefined(currentWindow[property])) {
                ownerWindow = currentWindow;
            }
        } catch (error) { }
    }
    return ownerWindow;
}

// -> retourne le nom du navigateur utilisé
function getBrowserName() {
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function (p) {
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
function getCursorIn(event, elem) {
    var offset = getOffset(elem);
    return {
        x: (event.clientX - offset.left),
        y: (event.clientY - offset.top)
    };
}

// -> retourne une valeur au hasard qui n'a pas déjà été prise
function getRandomIntInclusive(min, max, picked) {
    var min = Math.ceil(min),
        max = Math.floor(max),
        random = Math.floor(Math.random() * (max - min + 1)) + min;
    if (picked.indexOf(random) != -1) {
        return getRandomIntInclusive(min, max, picked);
    } else {
        return random;
    }
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
                if (timeline) {
                    timeline.stopPlaying();
                    timeline.status = "normal";
                }
                navigation.prev(true);
                break;
            case DebugMode.RIGHT:
                if (timeline) {
                    timeline.stopPlaying();
                    timeline.status = "normal";
                }
                navigation.next(true);
                break;
            case DebugMode.UP:
                //loadNextFile();
                break;
            case DebugMode.DOWN:
                //loadPrevFile();
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