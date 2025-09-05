import InterfaceFinder from "./lib/interface-finder.js";
import DebugMode from "./components/debug.js";
import Toast from "./components/toast.js";
import Message from "./components/message.js";
import { EVENTS } from "./lib/utils.js";
import MESSAGES from "./components/message-constants.js";
import ScormManager from "./components/scorm-manager.js";
import SoundsManager from "./components/sound-manager.js";
import JsonsManager from "./components/jsons-manager.js";
import { translationRender } from "./lib/dom.js";

const ofp = InterfaceFinder.searchOfp();
const ofpWin = InterfaceFinder.searchOfpWindow();
const scorm = new ScormManager(ofp, {
    isFileCompleted: isFileCompleted,
    allFilesCompleted: allFilesCompleted
});
const jsonsManager = new JsonsManager();
let timeline = null;
let soundManager = null;
const message = new Message();
let files;
let currentFileId;
let mainDom;
let soundTriggerDom;
let language;

let contentLoadedReady = false;
let mobile = false;

ofp.debug = ofp.getFromDataProvider('debug');
let debug = ofp.getFromDataProvider('debug');

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////    INITIALISATION FUNCTIONS    ///////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function contentLoaded() {
    contentLoadedReady = true;
    soundTriggerDom = ofpWin.document.querySelector("#sound-trigger");
    mainDom = document.querySelector("#main");
    files = ofp.getFromDataProvider('files');
    currentFileId = ofp.player.actualFile.id;
    mobile = EVENTS.CLICK_TOUCH === 'touchend';
    listenMessages();
    setDebug();
    setLanguage(ofp.getFromDataProvider('lang'));
    initLoadings();
    window.removeEventListener(EVENTS.LOAD, contentLoaded);
}

function initLesson() {
    setTranslations();
    setScorm();
    sendToMenu({
        type: MESSAGES.MENU_TOGGLE,
        condition:"opened",
        byFooter:true
    });
    // sendToHeader({
    //     type: MESSAGES.HEADER_UPDATE,
    //     mode:"capture"
    // })
    //Si aucune intéraction utilisateur au démarrage, on force un click
    if(soundManager.list.length>0){
        soundManager.canPlaySounds().then().catch(function(){
            ofp.loader.hide();
            soundTriggerDom.style.display = "";
            soundTriggerDom.querySelector("p").innerHTML = jsonsManager.get("start");
            //$(soundTriggerDom.querySelector("#sound-trigger-button")).off(EVENTS.CLICK_TOUCH).on(EVENTS.CLICK_TOUCH,launchTimeline);
        })
    } else {
        ofp.loader.hide();
        soundTriggerDom.style.display = "none"; 
    }
}

// -> Lancée uniquement si debug à true (set les status si il est estimé que le fichier a été entièrement vu)
function setDebug() {
    if (debug === true) {
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////    SCORM FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// -> Met à jour le scorm
function setScorm() { 
    if(debug===true){
        return;
    }
    // Si écran actuel est le même que le dernier
    if ((scorm.parsedDatas[currentFileId - 1][2] == scorm.parsedDatas[currentFileId - 1][1])) {
        scorm.parsedDatas[currentFileId - 1][2] = 1;
        save();
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
    return (ofp.player.getAnsweredFiles().length == ofp.player.files.length);
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
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    AUDIO FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initAudio() {
    soundManager = new SoundsManager(document.body, {
        rootPath: ofpWin.rootPath + "../",
        directoryName: 'sounds/'+language+'/',
    });
    if (typeof soundsData === "undefined") {
        return false;
    }
    return soundManager.addSounds(soundsData);
}

function getSoundDuration(id){
    if(!soundManager){
        return 0;
    }
    const duration = soundManager.getSoundDuration(id);
    if(duration){
        return ((duration * 1000) + 1000);
    } else {
        console.warn("The id "+id+" does not match any sound. 0 is returned instead.");
        return 0;
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////   TRANSLATION FUNCTIONS    //////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////


function setTranslations() {
    mainDom.setAttribute("language",language);
    sendToHeader({
        type: MESSAGES.HEADER_UPDATE,
        texts: jsonsManager.get(/header-/g)
    })
    sendToMenu({
        type: MESSAGES.MENU_UPDATE,
        texts: jsonsManager.get(/menu-/g)
    })

    translationRender(jsonsManager.jsons,mainDom)
}

function setLanguage(lang) {
    // scorm.parsedDatas[6] = l;
    language = lang
    ofp.lang = lang;
    //soundManager.stopAll();
    //save()
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    FRAMES FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendToHeader(datas) {
    const header = ofpWin.document.querySelector('#header');
    if (header) {
        message.sendTo(header.contentWindow, datas);
    }
}

function sendToMenu(datas) {
    const menu = ofpWin.document.querySelector('#menuFrame');
    if (menu) {
        message.sendTo(menu.contentWindow, datas);
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////    MESSAGE LISTENER    ////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function listenMessages() {
    message.listen(function (datas) {
        const type = datas.type;
        switch (type) {
            case MESSAGES.CONTENT_NEXT:
                if (timeline.status == "normal") {
                    var value = typeof datas.value == "number" ? datas.value : 1;
                    navigation.load(value, true, true);
                }
                break;
            case MESSAGES.CONTENT_PREVIOUS:
                if (timeline.status == "normal") {
                    var value = typeof datas.value == "number" ? datas.value : -1;
                    navigation.load(value, true);
                }
                break;
            case MESSAGES.CONTENT_UPDATE:
                navigation.update();
                break;
            case MESSAGES.CONTENT_CHANGE:
                //loadFile(datas.id);
                break;
            case MESSAGES.CONTENT_SWITCH_LANGUAGE:
                if(datas.language!=language){
                    soundManager.stopAll();
                    changeLanguage(datas.language);    
                }
                break;
            case MESSAGES.CONTENT_VOLUME:
                soundManager.setAllVolume(datas.value);
                break;
            case MESSAGES.MENU_SHOW:
                sendToMenu({
                    type: MESSAGES.MENU_SHOW
                });
                break;
            case MESSAGES.MENU_HIDE:
                sendToMenu({
                    type: MESSAGES.MENU_HIDE
                });
                break;
        }
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////    LOADING FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initLoadings() {
    //Texts & sounds
    Promise.all([
        jsonsManager.load([
            "./json/"+language+".json",
            "../../common/content/jsons/"+language+".json"
        ]),initAudio()
    ])
    .then(function (reply) {
        initLesson();
    })
    .catch(function (err) {
        console.log(err);
    })
}


// //////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////           UTILS          //////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////


// // -> Position par rapport à l'écran d'un élément
// function getOffset(elem) {
//     var box = elem.getBoundingClientRect();
//     return {
//         top: box.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
//         left: box.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
//     };
// }

// // -> Récupère la position du curseur par rapport à un élément
// function getCursorIn(event, elem) {
//     var offset = getOffset(elem);
//     return {
//         x: (event.clientX - offset.left),
//         y: (event.clientY - offset.top)
//     };
// }

// // -> retourne une valeur au hasard qui n'a pas déjà été prise
// function getRandomIntInclusive(min, max, picked) {
//     var min = Math.ceil(min),
//         max = Math.floor(max),
//         random = Math.floor(Math.random() * (max - min + 1)) + min;
//     if (picked.indexOf(random) != -1) {
//         return getRandomIntInclusive(min, max, picked);
//     } else {
//         return random;
//     }
// }

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
window.addEventListener(EVENTS.LOAD, contentLoaded);