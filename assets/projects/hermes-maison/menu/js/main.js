import InterfaceFinder from "../../common/content/js/lib/interface-finder.js";
import Message from "../../common/content/js/components/message.js";
import MESSAGES from "../../common/content/js/components/message-constants.js";
import Menu from "./menu.js";

const ofpConstants = InterfaceFinder.searchConstants();
const message = new Message()
let ofp = null
let ofpWin = null
let menu = null

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

function sendToFooter(datas) {
    var footer = ofpWin.document.querySelector('#footer');

    if (footer) {
        message.sendTo(footer.contentWindow, datas);
    }
}

function sendToContent(datas) {
    var contentFrame = ofp.content.domElement.querySelector('iframe');

    if (contentFrame) {
        message.sendTo(contentFrame.contentWindow, datas);
    }
}

function show() {
    if (frameElement.parentNode.classList.contains("unavailable")) {
        frameElement.parentNode.classList.remove("unavailable");
    }
}

function hide() {
    if (!frameElement.parentNode.classList.contains("unavailable")) {
        frameElement.parentNode.classList.add("unavailable");
        if(menu){
            menu.hide()
        }
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

function init() {
    menu = new Menu();
    //Événements
    menu.on(Menu.OPEN_PART, (datas) => {
        sendToContent({
            type: MESSAGES.CONTENT_CHANGE,
            id:datas.data
        });
    });

    menu.on(Menu.SWITCH_LANGUAGE, () => {
        sendToContent({
            type: MESSAGES.CONTENT_SWITCH_LANGUAGE,
            language:menu.language
        });
    });
    
    //Messages de l'iframe
    message.listen((datas) => {
        if (datas.type === MESSAGES.MENU_TOGGLE) {
            const condition = typeof datas.condition === "string" ? datas.condition===menu.state : true;
            if(condition===true){
                if(menu.state==="closed"){
                    show();
                    menu.show(datas);
                    if(datas.byFooter){
                        sendToFooter({
                            type: MESSAGES.FOOTER_UPDATE,
                            menu: "open"
                        });
                    }
                } else {
                    hide();
                    menu.hide(hide,datas.animated);
                    if(datas.byFooter){
                        sendToFooter({
                            type: MESSAGES.FOOTER_UPDATE,
                            menu: "close"
                        });
                    }
                }  
            }
        }

        if (datas.type === MESSAGES.MENU_BLUR) {
            blurMe();
        }

        if (datas.type === MESSAGES.MENU_SHOW) {
            show();
            if(menu){
                menu.show(datas);
            }
        }

        if (datas.type === MESSAGES.MENU_HIDE) {
            hide()
        }

        if (datas.type === MESSAGES.MENU_UPDATE) {
            menu.update(datas);
        }
    });
}

document.addEventListener('DOMContentLoaded', handleLoaded);

