import InterfaceFinder from "../../common/content/js/lib/interface-finder.js";
import Message from "../../common/content/js/components/message.js";
import MESSAGES from "../../common/content/js/components/message-constants.js";
import Footer from "./footer.js";

const ofpConstants = InterfaceFinder.searchConstants();
const message = new Message()
let ofp = null
let ofpWin = null
let footer = null

// /*  Fix suite au fait que l'iframe est directement
//     créee dans l'index.html de l'interface
//     de ce fait elle est potentiellement loader avant
//     que ofp soit initialisé.    
// */
function handleLoaded() {
    ofp = InterfaceFinder.searchOfp();
    ofpWin = InterfaceFinder.searchOfpWindow();
    if (ofp && ofp.ready) {
        init();
    } else {
        ofpWin.parent.addEventListener(ofpConstants.READY, handleLoaded);
    }
}

function sendToMenu(datas) {
    var menuFrame = ofpWin.document.querySelector('#menu');

    if (menuFrame) {
        message.sendTo(menuFrame.contentWindow, datas);
    }
}

function sendToContent(datas) {
    var contentFrame = ofp.content.domElement.querySelector('iframe');

    if (contentFrame) {
        message.sendTo(contentFrame.contentWindow, datas);
    }
}

function show() {
    if (frameElement.style.display !== 'block') {
        frameElement.style.display = 'block';
        footer.show();
    }
}

function hide() {
    if (frameElement.style.display !== 'none') {
        footer.hide();
        frameElement.style.display = "none";
    }
}

function blurMe() {
    if (frameElement) {
        frameElement.blur();
    }

    window.blur();
    document.body.blur();
}

function focused() {
    blurMe();

    sendToContent({
        type: MESSAGES.CONTENT_FOCUS,
    });
}

function switchLanguage(){
    sendToContent({
        type: MESSAGES.CONTENT_SWITCH_LANGUAGE,
        language:footer.language
    });
}

function init() {
    footer = new Footer();
    //Événements
    footer.on(Footer.SHOW_MENU, () => {
        sendToContent({
            type: MESSAGES.MENU_SHOW
        });
        footer.update({menu:"open"})
    });
    footer.on(Footer.HIDE_MENU, () => {
        sendToContent({
            type: MESSAGES.MENU_HIDE
        });
        footer.update({menu:"close"})
    });

    //Messages de l'iframe
    message.listen((datas) => {
        if (datas.type === MESSAGES.FOOTER_BLUR) {
            blurMe();
        }

        if (datas.type === MESSAGES.FOOTER_SHOW) {
            show();
        }

        if (datas.type === MESSAGES.FOOTER_HIDE) {
            hide();
        }

        if (datas.type === MESSAGES.FOOTER_UPDATE) {
            footer.update(datas);
        }
    });
}

document.addEventListener('DOMContentLoaded', handleLoaded);

