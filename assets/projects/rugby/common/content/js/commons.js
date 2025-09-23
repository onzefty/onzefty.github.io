var ofp = InterfaceFinder.searchOfp();
var ofpWin = InterfaceFinder.searchOfpWindow();
var scorm = new ScormManager(ofp);
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
var sections;
var languagesDom;
var version;
var isBattle = false;
let usersM = null;
let score = 0;
let level = 1;
var contentLoadedReady = false;
var mobile = false;
var dateNow;

ofp.debug = ofp.getFromDataProvider('debug');
var debug = ofp.getFromDataProvider('debug');

const levels = {
    "50": 114000,
    "49": 110000,
    "48": 106000,
    "47": 102000,
    "46": 98000,
    "45": 94000,
    "44": 90000,
    "43": 86000,
    "42": 82000,
    "41": 78000,
    "40": 74000,
    "39": 70000,
    "38": 66000,
    "37": 62000,
    "36": 58000,
    "35": 54000,
    "34": 50000,
    "33": 46000,
    "32": 42000,
    "31": 38000,
    "30": 34000,
    "29": 32000,
    "28": 30000,
    "27": 28000,
    "26": 26000,
    "25": 24000,
    "24": 22000,
    "23": 20000,
    "22": 18000,
    "21": 16000,
    "20": 14000,
    "19": 12000,
    "18": 11000,
    "17": 10000,
    "16": 9000,
    "15": 8000,
    "14": 7000,
    "13": 6000,
    "12": 5000,
    "11": 4500,
    "10": 4000,
    "9": 3500,
    "8": 3000,
    "7": 2500,
    "6": 2000,
    "5": 1500,
    "4": 1200,
    "3": 1000,
    "2": 500,
    "1": 0
}

const items = {
    "chests": [
        { src: "avatar-chest-1", level: 1 },
        { src: "avatar-chest-2", level: 1 },
        { src: "avatar-chest-3", level: 1 },
        { src: "avatar-chest-4", level: 1 },
        { src: "avatar-chest-5", level: 1 },
        { src: "avatar-chest-6", level: 1 },
    ],
    "hairs": [
        { src: "avatar-hair-1", level: 1 },
        { src: "avatar-hair-2", level: 1 },
        { src: "avatar-hair-3", level: 1 },
        { src: "avatar-hair-4", level: 1 },
        { src: "avatar-hair-5", level: 1 },
        { src: "avatar-hair-6", level: 1 },
        { src: "avatar-hair-7", level: 1 },
        { src: "avatar-hair-8", level: 1 },
        { src: "avatar-hair-9", level: 1 },
        { src: "avatar-hair-10", level: 1 },
        { src: "avatar-hair-11", level: 1 },
        { src: "avatar-hair-12", level: 2 },
        { src: "avatar-hair-13", level: 3 },
        { src: "avatar-hair-14", level: 4 },
        { src: "avatar-hair-15", level: 5 },
        { src: "avatar-hair-16", level: 9 },
        { src: "avatar-hair-17", level: 10 },
        { src: "avatar-hair-18", level: 15 },
        { src: "avatar-hair-19", level: 16, no: "eyes" },
        { src: "avatar-hair-20", level: 19 },
        { src: "avatar-hair-21", level: 21 },
        { src: "avatar-hair-22", level: 22, no: ["eyes", "mouths"] },
        { src: "avatar-hair-23", level: 23, no: ["eyes", "mouths"] },
        { src: "avatar-hair-24", level: 24 },
        { src: "avatar-hair-25", level: 25, no: ["eyes", "mouths"] },
        { src: "avatar-hair-26", level: 29 },
        { src: "avatar-hair-27", level: 30 },
        { src: "avatar-hair-28", level: 31 },
        { src: "avatar-hair-29", level: 32, no: ["eyes", "mouths"] },
        { src: "avatar-hair-30", level: 33 },
        { src: "avatar-hair-31", level: 34 },
        { src: "avatar-hair-32", level: 37 },
        { src: "avatar-hair-33", level: 40 }
    ],
    "eyes": [
        { src: "avatar-eyes-1", level: 1 },
        { src: "avatar-eyes-2", level: 1 },
        { src: "avatar-eyes-3", level: 1 },
        { src: "avatar-eyes-4", level: 1 },
        { src: "avatar-eyes-5", level: 1 },
        { src: "avatar-eyes-6", level: 8 },
        { src: "avatar-eyes-7", level: 20 },
        { src: "avatar-eyes-8", level: 43 }
    ],
    "mouths": [
        { src: "avatar-mouth-1", level: 1 },
        { src: "avatar-mouth-2", level: 1 },
        { src: "avatar-mouth-3", level: 1 },
        { src: "avatar-mouth-4", level: 1 },
        { src: "avatar-mouth-5", level: 1 },
        { src: "avatar-mouth-6", level: 1 },
        { src: "avatar-mouth-7", level: 1 },
        { src: "avatar-mouth-8", level: 13 },
        { src: "avatar-mouth-9", level: 14 },
        { src: "avatar-mouth-10", level: 26 },
        { src: "avatar-mouth-11", level: 50 }
    ],
    "tee-shirts": [
        { src: "avatar-tee-shirt-1", level: 1 },
        { src: "avatar-tee-shirt-2", level: 1 },
        { src: "avatar-tee-shirt-3", level: 1 },
        { src: "avatar-tee-shirt-4", level: 1 },
        { src: "avatar-tee-shirt-5", level: 1 },
        { src: "avatar-tee-shirt-6", level: 1 },
        { src: "avatar-tee-shirt-7", level: 1 },
        { src: "avatar-tee-shirt-8", level: 1 },
        { src: "avatar-tee-shirt-9", level: 1 },
        { src: "avatar-tee-shirt-10", level: 1 },
        { src: "avatar-tee-shirt-11", level: 1 },
        { src: "avatar-tee-shirt-12", level: 1 },
        { src: "avatar-tee-shirt-13", level: 1 },
        { src: "avatar-tee-shirt-14", level: 1 },
        { src: "avatar-tee-shirt-15", level: 1 },
        { src: "avatar-tee-shirt-16", level: 1 },
        { src: "avatar-tee-shirt-17", level: 1 },
        { src: "avatar-tee-shirt-18", level: 1 },
        { src: "avatar-tee-shirt-19", level: 1 },
        { src: "avatar-tee-shirt-20", level: 1 },
        { src: "avatar-tee-shirt-21", level: 1 },
        { src: "avatar-tee-shirt-22", level: 1 },
        { src: "avatar-tee-shirt-23", level: 1 },
        { src: "avatar-tee-shirt-24", level: 6 },
        { src: "avatar-tee-shirt-25", level: 7 },
        { src: "avatar-tee-shirt-26", level: 17 },
        { src: "avatar-tee-shirt-27", level: 18 },
        { src: "avatar-tee-shirt-28", level: 41 },
        { src: "avatar-tee-shirt-29", level: 42 },
        { src: "avatar-tee-shirt-30", level: 44 },
        { src: "avatar-tee-shirt-31", level: 45 },
        { src: "avatar-tee-shirt-32", level: 48 },
        { src: "avatar-tee-shirt-33", level: 49 }
    ],
    "pants": [
        { src: "avatar-pants-1", level: 1 },
        { src: "avatar-pants-2", level: 1 },
        { src: "avatar-pants-3", level: 1 },
        { src: "avatar-pants-4", level: 1 },
        { src: "avatar-pants-5", level: 1 },
        { src: "avatar-pants-6", level: 1 },
        { src: "avatar-pants-7", level: 11, no: "shoes" },
        { src: "avatar-pants-8", level: 12, no: "shoes" },
        { src: "avatar-pants-9", level: 27, no: "shoes" },
        { src: "avatar-pants-10", level: 28, no: "shoes" },
        { src: "avatar-pants-11", level: 35, no: "shoes" },
        { src: "avatar-pants-12", level: 36, no: "shoes" },
        { src: "avatar-pants-13", level: 38, no: "shoes" },
        { src: "avatar-pants-14", level: 39, no: "shoes" },
        { src: "avatar-pants-15", level: 46, no: "shoes" },
        { src: "avatar-pants-16", level: 47, no: "shoes" }
    ],
    "shoes": [
        { src: "avatar-shoes-1", level: 1 },
        { src: "avatar-shoes-2", level: 1 },
        { src: "avatar-shoes-3", level: 1 },
        { src: "avatar-shoes-4", level: 1 },
        { src: "avatar-shoes-5", level: 1 },
        { src: "avatar-shoes-6", level: 1 },
    ]
}

const itemsOrder = Object.keys(items);

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////    INITIALISATION FUNCTIONS    ///////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function contentLoaded() {
    var socket = parent.ofp.socket;

    if (socket.connected === true) {
        socket.on("disconnect", disconnection);
    } else {
        disconnection();
    }

    contentLoadedReady = true;
    mainDom = document.querySelector("#main");
    files = ofp.getFromDataProvider('files');
    dataP = ofp.getFromDataProvider('data');
    //languageSelection = dataP.languageSelection;
    currentFileId = ofp.player.actualFile.id;
    isBattle = ofp.player.actualFile.type == "battle";
    nbLessons = ofp && files.filter(function (file) { return file.type === 'lesson'; }).length;
    mobile = Constants.CLICK_TOUCH == 'touchend';
    listenMessages();
    var api = new APIClient({ ...parent.env, token: parent.ofp.token });

    api.getTime().then(function (result) {
        dateNow = result.utcDatetime;
        //TO REMOVE FOR PRO
        scorm.firstLaunch = false;
        //TO REMOVE FOR PROD
        //Premier lancement (on voit directement le menu)
        if (scorm.firstLaunch) {
            sendToFooter({
                type: MessagesConstants.FOOTER_HIDE
            });
            sendToMenu({
                type: MessagesConstants.MENU_UPDATE,
                progress: scorm.parsedDatas,
                dates: dataP.dates,
                isBattleEnded: isBattleEnded()
            });
            sendToMenu({
                type: MessagesConstants.MENU_TOGGLE,
                animated: true
            });
            setTimeout(function () {
                ofp.loader.hide();
            }, 20);
        } else {
            sendToFooter({
                type: MessagesConstants.FOOTER_SHOW,
                status: "visible"
            });
            sendToMenu({
                type: MessagesConstants.MENU_UPDATE,
                progress: scorm.parsedDatas,
                dates: dataP.dates,
                isBattleEnded: isBattleEnded()
            });
            sendToMenu({
                type: MessagesConstants.MENU_TOGGLE,
                condition: "opened"
            });
            //setDebug();
            initTimeline();
            initLanguage();
            //initVideo();
            initUsersM();
            initBattleCalls();
            initLoadings();
        }
    });

    window.removeEventListener(Constants.LOAD, contentLoaded);
}

function initLesson() {
    languageManager.render();
    setSections();
    setButtons();
    setNavigation();
    setScorm();
    setNavigation();
    updateFooter();
    launchTimeline();
    loadImages(navigation.current, true);
    loadImages(navigation.current + 1, true);
    loadImages(navigation.current - 1, true);
}

// -> Lancée uniquement si debug à true (set les status si il est estimé que le fichier a été entièrement vu)
function setDebug() {
    if (debug == true) {
        for (var f = 1; f <= ofp.player.files.length - 1; f++) {
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
    /*
    if(debug==true){
        return;
    }
    */
    // Si écran actuel est le même que le dernier
    // Cela signifie que le quiz a déjà été effectué donc on remet à 0 les valeurs d'écran en cours, score, question en cours et les réponses aux questions
    var fileScormData = scorm.parsedDatas[currentFileId - 1];
    var screensTotal = Object.keys(timeline.line).length;
    var changedValue = false;

    if (parseInt(fileScormData[1]) != screensTotal) {
        scorm.parsedDatas[currentFileId - 1][1] = screensTotal;
        changedValue = true;
    }

    var fileCompleted = scorm.isFileCompleted() === true;

    if (fileScormData[3] == null || (fileCompleted && fileScormData[3] === "0")) {
        if (fileCompleted) {
            fileScormData[3] = "1";
        } else {
            fileScormData[3] = "0";
        }

        changedValue = true;
    }

    if ((fileScormData[2] == fileScormData[1])) {
        fileScormData[2] = 1;
        changedValue = true;
    }

    // Sécurité pour remettre les valeurs de départ à 1 si les fichiers sont en statut "na"
    for (var a = 1; a <= scorm.parsedDatas.length; a++) {
        var datas = scorm.parsedDatas[a - 1],
            file = ofp.player.files[a - 1];
        if (file.status == "na") {
            var maxSeen = parseInt(scorm.parsedDatas[a - 1][0]);
            var current = parseInt(scorm.parsedDatas[a - 1][2]);
            if (maxSeen > 1 || current > 1) {
                console.log(file.id, a);
                scorm.parsedDatas[a - 1][0] = "1";
                scorm.parsedDatas[a - 1][2] = "1";
                changedValue = true;
            }
        }
    }

    if (changedValue) {
        var throttleData = scorm.save();

        if (throttleData) {
            if (throttleData.execute) {
                throttleData.execute();
            }
        }
    }
}


// -> Vérifie si la leçon est completed ou non
function isFileCompleted() {
    //Battle is set completed when a vs battle is initiated
    if (isBattle == true) {
        return false;
    }
    if (((parseInt(scorm.parsedDatas[currentFileId - 1][0]) / parseInt(scorm.parsedDatas[currentFileId - 1][1])) >= 1)) {
        return true;
    }
    return false;
}

// -> Vérifie si la formation est terminée ou non
function isAllCompleted() {
    return (ofp.player.getAnsweredFiles().length == ofp.player.files.length);
}

// -> Fonction de sauvegarde
function save() {
    onCustomSave();
    getCompletionPoints();

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
    var current = navigation.current;
    var maxVu = Math.max(navigation.current, scorm.parsedDatas[currentFileId - 1][0]);

    scorm.parsedDatas[currentFileId - 1][2] = current.toString();
    scorm.parsedDatas[currentFileId - 1][0] = maxVu.toString();

    //Calcul de la progression    
    var percent = 0, mainPercent = 0;
    for (var a = 1; a <= scorm.parsedDatas.length; a++) {
        var datas = scorm.parsedDatas[a - 1],
            file = ofp.player.files[a - 1];
        percent += file.status == "na" ? 0 : Math.round((parseInt(datas[0]) / parseInt(datas[1])) * 100);
    }
    mainPercent = Math.round(percent / scorm.parsedDatas.length) / 100;
    //SPEC BATTLE
    //Si la progression retourne 1 mais qu'aucune battle n'a été faite (Badge PACK)
    if (mainPercent == 1 && ofp.player.files[ofp.player.files.length-1].status != "c") {
        console.warn("Completion prevented. 1 => 0.99 as no battle ever done yet.")
        mainPercent = 0.99;
    }
    scorm.progress = mainPercent;

    sendToMenu({
        type: MessagesConstants.MENU_UPDATE,
        progress: scorm.parsedDatas,
        dates: dataP.dates,
        isBattleEnded: isBattleEnded(),
        avatarDatas: scorm.parsedDatas[scorm.parsedDatas.length - 1][3]
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
    timeline.play(c - 1);
    updateFooter();
    loadImages((c + 1));
}

function navPrev(c, forcePlaying) {
    if (forcePlaying) {
        timeline.playFrom(c - 1);
    } else {
        timeline.stopAt(c - 1);
    }
    updateFooter();
    loadImages((c - 1))
}

function navLoad(c, forcePlaying) {
    if (forcePlaying) {
        timeline.playFrom(c - 1, { ignoreFinished: true });
    } else {
        timeline.stopAt(c - 1);
    }
    updateFooter();
    loadImages((c + 1));
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
    //Battle
    if (isBattle) {
        setTimeout(function () {
            ofp.loader.hide();
            //Challenge hors battle accepté
            if (ofp.state.from != null && isBattle == true) {
                timeline.stopAt(1);
            } else {
                //Première fois dans la battle (on charge directement la customisation de l'avatar)
                if (!scorm.parsedDatas[scorm.parsedDatas.length - 1][3] || scorm.parsedDatas[scorm.parsedDatas.length - 1][3] == "0") {
                    timeline.stopAt(1);
                    timeline.play("customize-in", true);
                } else {
                    timeline.play(0);
                }
                timeline.play(0);
            }
        }, 1);
    } else {
        //Standard
        ofp.loader.hide();
        if (navigation.current == 1) {
            timeline.play(0);
        } else {
            timeline.stopAt(navigation.current - 1);
        }
    }

}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    IMAGES FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadImages(num, showLoader) {
    if (showLoader) {
        ofp.loader.show();
    }
    var section = getSection(num);
    if (section && section.getAttribute("loaded") == "false") {
        section.setAttribute("loaded", "true");
        var imgs = section.querySelectorAll("img"),
            total = 0, count = 0;
        for (var i = 1; i <= imgs.length; i++) {
            var img = imgs[i - 1],
                dataSrc = img.getAttribute("data-src");
            if (dataSrc) {
                total++;
                img.src = dataSrc;
                img.addEventListener("load", function () {
                    if (showLoader) {
                        count++;
                        if (count >= total) {
                            ofp.loader.hide();
                        }
                    }
                })
            }
        }
    }
    //TEMP
    ofp.loader.hide();
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////    VIDEO FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

var quality = "high",
    videoFormat = preferWEBM() ? 'webm' : 'mp4',
    videoQuality = quality == "high" ? '' : '_480p';

function initVideo() {
    if (typeof videosData === "undefined") {
        return false;
    }

    videoManager = new VideoManager({
        container: mainDom.querySelector("#" + videosData.containerId),
        src: videosData.src + languageManager.language + "." + videoFormat,
        onEnded: videosData.onEnded,
        onTimeUpdate: videosData.onTimeUpdate
    });
}

function getSource(src) {
    var rawData = preloader.getResult(src, true);
    return rawData instanceof File ? URL.createObjectURL(rawData) : src;
}

function preferWEBM() {
    return document.createElement('video').canPlayType('video/webm') !== '';
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////   TRANSLATION FUNCTIONS    //////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setPopupLanguage(el) {
    var flags = languagesDom.querySelector("#languages-popup").querySelectorAll("div");
    for (var f = 1; f <= flags.length; f++) {
        var flag = flags[f - 1],
            language = languageManager.languages[f - 1];
        if (language) {
            flag.style["background-image"] = "url(../../common/content/img/" + language + ".png)";
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
    /*
    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        title: languageManager.jsonObj["footer-title-module"]
        getPartsDatas()
    });
    */
    sendToMenu({
        type: MessagesConstants.MENU_UPDATE,
        texts: languageManager.getTextsFromJSON("menu-"),
        language: languageManager.language
    });
}

function changeLanguage(l) {
    scorm.parsedDatas[6] = l;
    ofp.lang = l;
    languageManager.setLanguage({
        language: l,
        callback: function () {
            languageManager.render();
        }
    });
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

function updateFooter() {
    var datas = getPartsDatas();
    sendToFooter({
        type: MessagesConstants.FOOTER_UPDATE,
        progress: Math.round(navigation.current / navigation.total * 100) + "%",
        title: datas.part,
        part: datas.subpart,
        isBattle: isBattle
    });
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
            case MessagesConstants.CONTENT_CHAT_OPEN:
                usersM.open();
                break;
        }
    });
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////    LOADING FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

function initLoadings() {
    if (videoManager) {
        Promise.all([
            languageManager.loadJSON(languageManager.jsonURL + languageManager.language + ".json"),
            videoManager.addEvents()
        ])
            .then(function (reply) {
                initLesson();
            })
            .catch(function (err) {
                console.warn(err);
            })
    } else {
        //S'il s'agit de la battle, loading différent
        //console.warn(ofp.state.from,isBattle);
        if (ofp.player.actualFile.type == "battle") {
            battleLoading();
        } else {
            const user = ofp.getUser();
            const api = new APIClient({ ...parent.env, token: parent.ofp.token });
            const rankingLoading = api.getUserRanking(user.identifier)
                .then(function (response) {
                    if ('error' in response) {
                        return Promise.reject(response.error);
                    } else {
                        console.warn('.then :: ', response.result.length);
                        if (response.result.length) {
                            var data = response.result.shift();
                            receiveUserRanking(data);
                        }
                    }
                })
            Promise.all([
                languageManager.loadJSON(languageManager.jsonURL + languageManager.language + ".json"),
                rankingLoading
            ])
                .then(function (reply) {
                    initLesson();
                });
        }
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////     BATTLE FUNCTIONS    /////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function () {
    var app;

    function initBattleCalls() {
        if (isBattle == true) {
            return;
        }
        const popupChallengeAcceptButton = document.querySelector("#popup-challenge-button-accept");
        const popupChallengeRefuseButton = document.querySelector("#popup-challenge-button-refuse");
        const popupChatAcceptButton = document.querySelector("#popup-chat-button-accept");
        const popupChatRefuseButton = document.querySelector("#popup-chat-button-refuse");
        popupChallengeAcceptButton.addEventListener(Constants.CLICK_TOUCH, function () {
            app.acceptChallenge();
            ofp.loader.show();
            ofp.goToGame();
        });
        popupChallengeRefuseButton.addEventListener(Constants.CLICK_TOUCH, function () {
            app.declineChallenge();
            popupChallengeHide();
        });
        popupChatAcceptButton.addEventListener(Constants.CLICK_TOUCH, function () {
            app.acceptChat();
            popupChatHide();
            usersM.goToChat();
        });
        popupChatRefuseButton.addEventListener(Constants.CLICK_TOUCH, function () {
            app.declineChat();
            popupChatHide();
        });
        const handlers = {
            onDisconnect: function () {
                disconnection();
            },
            onChallenge(challenger) {
                console.warn('🚀 :: onChallenge :: challenger:', challenger);
                popupChallengeShow(challenger);
            },
            onChallengeEmitterDisconnected() {
                console.warn('🚀 :: onChallengeEmitterDisconnected ::');
                popupChallengeHide();
            },
            onChallengeReceiverDisconnected() {
                popupChallengeHide();
                console.warn('🚀 :: onChallengeReceiverDisconnected ::');
            },
            onDisconnectedFromChallenger() {
                console.warn('🚀 :: onDisconnectedFromChallenger ::');
                popupChallengeHide();
                // client.app.setFreeToPlay(false);
            },
            onChallengeAccepted: function () {
                console.warn('🚀 :: onChallengeAccepted ::');
                ofp.loader.show();
                ofp.goToGame();
            },
            onChallengeCanceled() {
                console.warn('🚀 :: onChallengeCanceled ::');
                popupChallengeHide();
                if (usersM.status == "open") {
                    usersM.proposalRefused();
                }
            },
            onChallengeRefused: function () {
                console.warn('🚀 :: onChallengeRefused ::');
                popupChallengeHide();
                if (usersM.status == "open") {
                    usersM.proposalRefused();
                }
            },
            onReceiveAllPeersInRoom: function (roomId, peers) { },
            onReceiveAllPeers: function (peers) {
                console.warn('🚀 :: onReceiveAllPeers :: ' + peers);
                usersM.renderList(peers);
                usersM.listScrollable.reset();
            },
            onPeerConnection: (data) => {
                console.warn('🚀 :: onPeerConnection :: ');
                console.warn(data);
                usersM.delayedUpdate();
            },
            onPeerDataChange: (data) => {
                console.warn('🚀 :: onPeerDataChange :: ');
                console.warn(data);
                usersM.delayedUpdate();
            },
            onPeerDisconnection: (data) => {
                console.warn('🚀 :: onPeerDisconnection :: ');
                console.warn(data);
                app.getAllPeers();
            },
            onChat: function (userData) {
                console.warn('🚀 :: onChat ::');
                usersM.user = userData;
                popupChatShow(userData);
            },
            onChatCanceled: function () {
                console.warn('🚀 :: onChatCanceled ::');
                if (usersM.mode == "chat-receiver") {
                    popupChatHide();
                } else {
                    usersM.proposalRefused();
                    //Safety
                    const popupChatWrap = document.querySelector("#popup-chat-wrap");
                    if (!popupChatWrap.classList.contains("hidden")) {
                        popupChatWrap.classList.add("hidden");
                    }
                }
            },
            onChatAccepted: function () {
                console.warn('🚀 :: onChatAccepted ::');
                usersM.proposalAccepted();
            },
            onChatRefused: function () {
                console.warn('🚀 :: onChatRefused ::');
                usersM.proposalRefused();
            },
            onChatPeerAlreadySet: function () { },
            onDisconnectedFromChatPeer: function () {
                console.warn('🚀 :: onDisconnectedFromChatPeer ::');
                chatDisconnected();
            },
            onChatEmitterDisconnected: function () {
                console.warn('🚀 :: onChatEmitterDisconnected ::');
            },
            onChatReceiverDisconnected: function () {
                console.warn('🚀 :: onChatReceiverDisconnected ::');
            },
            onReceiveChatMessage: function (message) {
                console.warn('🚀 :: onReceiveChatMessage :: ' + message);
                usersM.updateChat(message, usersM.user);
            }
        };
        app = new App(parent.ofp.socket, handlers);
        usersM.app = app;

        return app;
    }

    function getCompletionPoints() {
        if (scorm.isFileCompleted() === false || isBattle) {
            return false;
        }

        var fileScormData = scorm.parsedDatas[currentFileId - 1];
        var pointsGranted = fileScormData[3];

        console.log(typeof pointsGranted);

        if (pointsGranted === "1") {
            return false;
        }

        fileScormData[3] = "1";

        //RAJOUTER EN FONCTION DATE DE FIN OBTENTION POINTS
        const obj = { "battle-popup-in": 0 };
        const points = 500;
        app.value(points, "module");
        score += points;
        let levelO = level;
        level = getLevelByScore();
        if (level > levelO) {
            const levelEl = document.getElementById("battle-popup").querySelector("#battle-popup-level-wrap");
            const unlockEl = document.getElementById("battle-popup").querySelector("#battle-popup-unlock-wrap");
            const unlockElImg = unlockEl.querySelector(".unlocked");
            levelEl.querySelector("#battle-popup-level-previous").querySelector("p").innerHTML = levelO;
            levelEl.querySelector("#battle-popup-level-new").querySelector("p").innerHTML = level;
            const itemNew = getItemByLevel(level);
            if (itemNew) {
                unlockElImg.src = "../battle/imgs/avatar/" + itemNew.type + "/" + itemNew.item.src + ".png";
            }
            obj["battle-popup-level-up"] = 1500;
        }

        const buttonOK = document.getElementById("battle-popup").querySelector("#battle-popup-button-ok");
        $(buttonOK).off().on(Constants.CLICK_TOUCH, function () {
            if (timeline.status == "normal") {
                timeline.play("battle-popup-out", true, true);
            }
        })
        timeline.play(obj, true, true);
    }

    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////       CHAT FUNCTIONS    /////////////////////////////////////////////
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function initUsersM() {
        usersM = new UsersManager({
            element: document.querySelector("#chat-wrap")
        })
    }

    //@ Utilise Constants
    class UsersManager {
        constructor(props) {
            var defaultOptions = {
                element: document.createElement("div")
            }
            this.options = Object.assign(defaultOptions, props);

            if (!this.options.element) {
                return;
            }

            this.chatEl = this.options.element.querySelector("#chat");
            this.chatListWrapEl = this.chatEl.querySelector("#chat-list-wrap");
            this.usersConnectedEl = this.chatListWrapEl.querySelector(".users-connected");
            this.chatListContainerEl = this.chatListWrapEl.querySelector("#chat-list-container");
            this.chatListScrollableEl = this.chatListContainerEl.querySelector("#chat-list-scrollable");
            this.chatListScrollCursor = this.chatEl.querySelector("#chat-list-cursor");
            this.chatConversationWrapEl = this.chatEl.querySelector("#chat-conversation-wrap");
            this.chatConversationUserIdEl = this.chatConversationWrapEl.querySelector(".user-id");
            this.chatConversationPhotoEl = this.chatConversationWrapEl.querySelector(".user-photo");
            this.chatConversationBattleButtonEl = this.chatConversationWrapEl.querySelector("#chat-conversation-button-battle");
            this.chatConversationContainerEl = this.chatConversationWrapEl.querySelector("#chat-conversation-container");
            this.chatConversationScrollableEl = this.chatConversationWrapEl.querySelector("#chat-conversation-scrollable");
            this.chatConversationScrollCursor = this.chatConversationWrapEl.querySelector("#chat-conversation-cursor");
            this.chatConversationMessageEl = this.chatConversationWrapEl.querySelector("#chat-conversation-message-txt");
            this.chatConversationButtonSendEl = this.chatConversationWrapEl.querySelector("#chat-conversation-message-button-send");
            this.chatButtonsEl = this.chatEl.querySelector("#chat-buttons");
            this.chatButtonHideEl = this.chatButtonsEl.querySelector("#chat-button-hide")
            this.chatButtonQuitEl = this.chatButtonsEl.querySelector("#chat-button-quit");
            this.app;
            this.mode = "normal";
            this.status = null;
            this.displayer = "list";
            this.messages = [];
            this.unread = 0;
            this.users = [];
            this.user = null;
            this.item = null;
            this.delayOut = null;
            this.updateDelay = 5 * 1000;
            this.lastUpdatedAt = 0;

            this.handleTransitionEnd = this.onTransitionEnd.bind(this);
            this.handleClose = this.close.bind(this);
            this.handleHide = this.hide.bind(this);
            this.handleSendChallenge = this.sendChallenge.bind(this);
            this.handleSend = this.sendMessage.bind(this);

            this.addEvents();
        }

        addEvents() {
            this.chatEl.addEventListener("transitionend", this.handleTransitionEnd);
            this.chatEl.addEventListener("transitioncancel", this.handleTransitionEnd);
            this.chatButtonQuitEl.addEventListener(Constants.CLICK_TOUCH, this.handleClose);
            this.chatButtonHideEl.addEventListener(Constants.CLICK_TOUCH, this.handleHide);
            this.chatConversationBattleButtonEl.addEventListener(Constants.CLICK_TOUCH, this.handleSendChallenge);
            this.chatConversationButtonSendEl.addEventListener(Constants.CLICK_TOUCH, this.handleSend);
            this.listScrollable = new Scrollable({
                scrollable: this.chatListScrollableEl,
                cursor: this.chatListScrollCursor
            });
            this.conversationScrollable = new Scrollable({
                scrollable: this.chatConversationScrollableEl,
                cursor: this.chatConversationScrollCursor
            });
        }

        display() {
            this.chatListWrapEl.classList.add("hidden");
            this.chatConversationWrapEl.classList.add("hidden");
            if (this.displayer == "list") {
                this.displayList();
            } else {
                this.displayChat();
            }
        }

        renderList(users) {
            this.users = users;
            const itemContent = "\
                <img src='../../common/content/img/chat-item.svg' class='widthAll'>\
                <div class='widthAll heightAll absolute lt0 flexXStart'>\
                    <div class='width20 heightAll flexXStart relative'>\
                        <img class='photo'>\
                        <div class='battle-level absolute lt0'>\
                            <img class='widthAll' src='../battle/imgs/customize-level.png'>\
                            <div class='absolute lt0 widthAll flexCenter'>\
                                <p class='WebbEllisCup-Heavy'></p>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='width50 heightAll flexXStart relative'>\
                        <p class='pseudo WebbEllisCup-Bold' color='blue'>Angela</p>\
                        <div class='chat-asking asking absolute flexYEnd'><p class='WebbEllisCup'>Demande de chat en cours</p><div class='dots-jumping flex'><div class='dot'></div><div class='dot'></div><div class='dot'></div></div></div>\
                        <div class='battle-asking asking absolute flexYEnd'><p class='WebbEllisCup'>Demande de battle en cours</p><div class='dots-jumping flex'><div class='dot'></div><div class='dot'></div><div class='dot'></div></div></div>\
                        <div class='refused-asking asking absolute flexYEnd'><p class='WebbEllisCup'>Demande non aboutie</p></div>\
                        </div>\
                    <div class='buttons width30 heightAll flexXStart'>\
                        <div class='chat-ask relative' ask='chat'>\
                            <img src='../../common/content/img/chat-red.svg'>\
                        </div>\
                        <div class='battle-ask relative' ask='battle'>\
                            <img src='../../common/content/img/battle-red.svg'>\
                        </div>\
                    </div>\
                </div>";


            this.chatListScrollableEl.innerHTML = "";

            let id = 1;

            this.users.forEach(user => {
                const item = document.createElement("div");
                item.className = "chat-list-item relative";
                item.id = "chat-list-item-" + id;
                item.innerHTML = itemContent;
                item.user = user;
                item.querySelector(".photo").src = `/apprenant/photo.php?guid=${user.identifier}`;
                item.querySelector(".pseudo").innerHTML = user.pseudo;
                item.querySelector(".battle-level").querySelector("p").innerHTML = getLevelByScore(user.score);
                item.querySelector(".chat-ask").addEventListener(Constants.CLICK_TOUCH, this.sendProposal.bind(this, item));
                item.querySelector(".battle-ask").addEventListener(Constants.CLICK_TOUCH, this.sendProposal.bind(this, item));

                this.chatListScrollableEl.appendChild(item);

                id++;
            });

            this.usersConnectedEl.innerHTML = "Utilisateurs connectés : " + this.users.length;

        }

        displayList() {
            this.chatListWrapEl.classList.remove("hidden");
            this.listScrollable.reset();
        }

        updateList() {
            let id = 1;
            if (this.item) {
                this.chatListScrollCursor.parentNode.classList.add("unavailable");

                const boxContainer = this.chatListContainerEl.getBoundingClientRect();
                const boxItem = this.item.getBoundingClientRect();

                if ((boxItem.bottom + 50) > boxContainer.bottom) {
                    this.item.setAttribute("asking-pos", "up");
                } else {
                    this.item.removeAttribute("asking-pos");
                }

                this.users.forEach(user => {
                    const item = this.chatListScrollableEl.querySelector("#chat-list-item-" + id);
                    if (item.id != this.item.id) {
                        item.classList.add("unavailable");
                    }
                    id++;
                });
            } else {
                this.chatListScrollCursor.parentNode.classList.remove("unavailable");
                this.users.forEach(user => {
                    const item = this.chatListScrollableEl.querySelector("#chat-list-item-" + id);
                    item.classList.remove("unavailable");
                    item.removeAttribute("asking");
                    id++;
                });
            }

        }

        displayChat() {
            this.chatConversationWrapEl.classList.remove("hidden");
            this.conversationScrollable.reset();
            this.chatConversationUserIdEl.innerHTML = this.user.pseudo;
            this.chatConversationPhotoEl.src = `/apprenant/photo.php?guid=${this.user.identifier}`;
        }

        updateChat(message, user) {
            this.messages.push(message);
            const messageContent = "\
                <img class='photo'>\
                <div>\
                    <p class='pseudo WebbEllisCup-Bold'>Batman</p>\
                    <div class='bubble'><p class='WebbEllisCup'>Voici un texte</p></div>\
                </div>";

            const messageEl = document.createElement("div");
            messageEl.className = "chat-conversation-message";
            messageEl.id = "chat-conversation-message-" + this.messages.length;
            messageEl.innerHTML = messageContent;
            messageEl.setAttribute("type", user.identifier == this.user.identifier ? "user" : "you");
            messageEl.querySelector(".photo").src = `/apprenant/photo.php?guid=${user.identifier}`;
            messageEl.querySelector(".pseudo").innerHTML = user.pseudo;
            messageEl.querySelector(".bubble").querySelector("p").innerHTML = message;
            this.chatConversationScrollableEl.appendChild(messageEl);
            this.conversationScrollable.reset();
            this.conversationScrollable.goTo(100);

            //Si usersM is hidden
            if (this.status == "hide" && user.identifier == this.user.identifier) {
                this.unread++;
                sendToFooter({
                    type: MessagesConstants.FOOTER_SHOW,
                    status: "messages",
                    unread: this.unread
                });
            }
        }

        goToChat() {
            this.displayer = "chat";
            if (this.status == "open") {
                this.display();
            } else {
                this.open();
            }
            this.mode = "chatting";
        }

        sendMessage() {
            const text = this.chatConversationMessageEl.value;
            //Message vide non envoyé
            if (text.length > 0) {
                this.app.sendChatMessage(text);
                this.updateChat(text, ofp.getUser());
                this.chatConversationMessageEl.value = "";
            }
        }

        sendProposal(item, e) {
            this.item = item;
            this.user = this.item.user;
            const type = e.target.getAttribute("ask");
            this.mode = type + "-asker";
            item.setAttribute("asking", type);
            this.updateList();
            switch (type) {
                case "chat":
                    this.app.sendChatProposalTo(item.user.identifier);
                    break;

                case "battle":
                    this.app.sendChallengeTo(item.user.identifier);
                    break;
            }
        }

        sendChallenge() {
            this.mode = "battle-asker";
            this.app.sendChallengeTo(this.user.identifier);
            this.chatConversationWrapEl.setAttribute("asking", "true");
        }

        proposalAccepted() {
            switch (this.mode) {
                case "chat-asker":
                    this.goToChat();
                    break;

                case "battle-asker":
                    break;
            }
        }

        proposalRefused() {
            const self = this;
            if (this.mode == "battle-asker" && this.displayer == "chat") {
                this.chatConversationWrapEl.removeAttribute("asking");
                this.mode = "chatting";
            }
            else if (this.mode == "chatting") {
                this.chatConversationWrapEl.removeAttribute("asking");
            } else {
                if (this.item) {
                    this.item.setAttribute("asking", "refused");
                }
            }
            setTimeout(function () {
                if (self.mode != "chatting") {
                    self.mode = "normal";
                    if (self.item) {
                        self.item.removeAttribute("asking");
                    }
                    self.item = null;
                    self.user = null;
                    self.updateList();
                }
            }, 1200);
        }

        break() {
            this.user = null;
            this.messages = [];
            this.item = null;
            this.unread = 0;
            this.mode = "normal";
            this.displayer = "list";
            this.chatConversationScrollableEl.innerHTML = "";
            this.updateList();
        }

        open(e) {
            const self = this;
            this.unread = 0;
            this.options.element.classList.remove("unavailable");
            this.setStatus("open");
            sendToFooter({
                type: MessagesConstants.FOOTER_HIDE
            });
            if (this.displayer == "list") {
                this.app.getAllPeers();
            }
            this.display();
        }

        hide(e) {
            clearTimeout(this.delayOut);
            this.setStatus("hide");
            sendToFooter({
                type: MessagesConstants.FOOTER_SHOW,
                status: "hide"
            });
        }

        close(e, not) {
            clearTimeout(this.delayOut);
            this.setStatus("close");
            if (this.user) {
                this.app.disconnectFromChatPeer();
            }
            setTimeout(function () {
                if (this.status == "close" && !this.options.element.classList.contains("unavailable")) {
                    this.options.element.classList.add("unavailable");
                }
            }.bind(this), 600);
        }

        setStatus(status) {
            this.status = status;
            this.chatEl.setAttribute("status", status);
        }

        onTransitionEnd(e) {
            if (this.status && this.status != "open") {
                this.options.element.classList.add("unavailable");
            }

            if (this.status == "close" && !this.unclose) {
                sendToFooter({
                    type: MessagesConstants.FOOTER_SHOW,
                    status: "close"
                });
            }

            if (this.unclose) {
                this.unclose = null;
            }
        }

        delayedUpdate() {
            clearTimeout(this.delayOut);
            if (this.status != "open") {
                return;
            }
            console.log('🚀 :: delayedUpdate');
            const elapsed = new Date().getTime() - this.lastUpdatedAt;
            if (elapsed > this.updateDelay) {
                this.app.getAllPeers();
            } else {
                this.delayOut = setTimeout(this.delayedUpdate, this.updateDelay - elapsed);
            }
        }
    }

    function chatDisconnected() {
        usersM.break();
        usersM.display();
        if (usersM.status == "hide") {
            sendToFooter({
                type: MessagesConstants.FOOTER_SHOW,
                status: "hide"
            });
        }
    }

    window.initBattleCalls = initBattleCalls;
    window.getCompletionPoints = getCompletionPoints;
    window.initUsersM = initUsersM;
    window.chatDisconnected = chatDisconnected;
})();

function getLevelByScore(num) {
    let sc = typeof num == "number" ? num : score;
    const reversedKeys = Object.keys(levels).reverse();
    for (const lvl of reversedKeys) {
        if (levels[lvl] <= sc) {
            return parseInt(lvl)
        }
    }
}

function receiveUserRanking(ranking) {
    if (ranking) {
        score = parseFloat(ranking.score);
        level = getLevelByScore();
    } else {
        score = 0;
        level = 1;
    }
}

function getItemByLevel(lvl) {
    for (var prop in items) {
        for (var el of items[prop]) {
            if (el.level == lvl) {
                return { item: el, type: prop };
            }
        }
    }
}

function isBattleEnded() {
    const dateN = new Date(dateNow);
    const dateEnd = new Date(dataP.dateEnd);
    return (dateN >= dateEnd)
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////    UTILITIES FUNCTIONS    ////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////


// -> Déconnexion du serveur
function disconnection() {
    ofpWin.document.querySelector("#customDisconnection").classList.remove("unavailable")
}

// -> Récupère toutes les sections et les cache
function setSections() {
    sections = mainDom.querySelectorAll(".section");
    for (var s = 1; s <= sections.length; s++) {
        var section = sections[s - 1];
        section.classList.add("hidden");
        var els = section.children;
        var children = getChildren(section),
            screenMin = 100, screenMax = 1;
        for (var c = 1; c <= children.length; c++) {
            var child = children[c - 1],
                id = child.id;
            if (id) {
                num = id.match(/s\d*-/).join("").replace(/\D/g, "");
                screenMin = Math.min(screenMin, num);
                screenMax = Math.max(screenMax, num);
            }
        }
        section.setAttribute("screenMin", screenMin);
        section.setAttribute("screenMax", screenMax);
        section.setAttribute("loaded", false);
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

function getSection(num) {
    for (var s = 1; s <= sections.length; s++) {
        var section = sections[s - 1],
            min = parseInt(section.getAttribute("screenMin")),
            max = parseInt(section.getAttribute("screenMax"));
        if (num >= min && num <= max) {
            return section;
        }
    }
}

function getChildren(parent) {
    var children = [];
    for (var e = 1; e <= parent.children.length; e++) {
        var child = parent.children[e - 1],
            id = child.id;
        if (child.id.indexOf("-content") != -1) {
            var moreChildren = getChildren(child);
            children = children.concat(moreChildren);
        }
        children.push(child);
    }
    return children;
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
    $(document).find(".btLoad").on(Constants.CLICK_TOUCH, function () {
        if (timeline.status == "normal") {
            navigation.load(this.getAttribute("screen-load"), true, typeof this.getAttribute("screen-load-playing") == "string");
        }
    });
    $(document).find(".btQuit").on(Constants.CLICK_TOUCH, function () {
        ofp.close();
    });
    $(document).find(".btMenu").on(Constants.CLICK_TOUCH, function () {
        sendToMenu({
            type: MessagesConstants.MENU_TOGGLE,
            animated: true,
            byFooter: true,
            condition: "closed"
        });
    });
    $(document).find(".btPopupQuit").on(Constants.CLICK_TOUCH, function () {
        //openPopup(buildPopup(languageManager.getTextFromJSON("popupQuit_txt_1")+"<br><span style='text-transform:none;font-size:2vh;'>"+languageManager.getTextFromJSON("popupQuit_txt_2")+"</span>"),function(){ofp.close()});
    });
}

// -> Récupère les données de la partie de la leçon selon l'écran en cours
function getPartsDatas() {
    var toReturn = { part: "", subpart: "" };
    if (typeof parts === "undefined") {
        return false;
    }
    var num = getBetweenInt(navigation.current, Object.keys(parts)),
        part = parts[num];
    if (part) {
        toReturn.part = part.title;
        var num = getBetweenInt(navigation.current, Object.keys(part.subparts));
        toReturn.subpart = part.subparts[num];
    }
    return toReturn;
}

function popupChallengeShow(user) {
    const popupChallengeWrap = document.querySelector("#popup-challenge-wrap");
    const popupChallenge = popupChallengeWrap.querySelector("#popup-challenge");
    const popupChallengeTxt = popupChallenge.querySelector("#popup-challenge-txt");
    popupChallengeTxt.innerHTML = user.pseudo + "<br>veut vous défier!";
    popupChallengeWrap.classList.remove("hidden");
    setTimeout(function () {
        popupChallenge.classList.add("show");
    }, 10);
}

function popupChallengeHide(cb) {
    const popupChallengeWrap = document.querySelector("#popup-challenge-wrap");
    const popupChallenge = popupChallengeWrap.querySelector("#popup-challenge");
    popupChallenge.classList.remove("show");
    setTimeout(function () {
        if (typeof cb == "function") {
            cb();
        }
        popupChallengeWrap.classList.add("hidden");
    }, 500);
}

function popupChatShow(user) {
    usersM.mode = "chat-receiver";
    const popupChatWrap = document.querySelector("#popup-chat-wrap");
    const popupChat = popupChatWrap.querySelector("#popup-chat");
    const popupChatTxt = popupChat.querySelector("#popup-chat-txt");
    popupChatTxt.innerHTML = user.pseudo + " vous envoie une demande de chat!";
    popupChatWrap.classList.remove("hidden");
    setTimeout(function () {
        popupChat.classList.add("show");
    }, 10);
}

function popupChatHide(cb) {
    usersM.mode = "normal";
    const popupChatWrap = document.querySelector("#popup-chat-wrap");
    const popupChat = popupChatWrap.querySelector("#popup-chat");
    popupChat.classList.remove("show");
    setTimeout(function () {
        if (typeof cb == "function") {
            cb();
        }
        popupChatWrap.classList.add("hidden");
    }, 500);
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

// -> retourne le nombre, d'une range donnée, le plus proche d'un nombre donné
function getBetweenInt(num, range) {
    for (var r = range.length; r >= 1; r--) {
        var ran = parseInt(range[r - 1]);
        if (num >= ran) {
            return ran;
        }
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
                }
                navigation.prev(true);
                break;
            case DebugMode.RIGHT:
                if (timeline) {
                    timeline.stopPlaying();
                }
                navigation.current = navigation.current + 1;
                updateFooter();
                loadImages((navigation.current + 1));
                timeline.stopAt(navigation.current - 1);
                save();
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
