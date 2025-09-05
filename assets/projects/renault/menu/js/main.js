import { FrameView, FrameCorrespondent } from "../../common/content/js/frames/frame-view.js";
import MESSAGES from "../../common/content/js/components/message-constants.js";
import Menu from "./menu.js";
import FRAMESCONSTANTS from "../../common/content/js/frames/frame-constants.js";

const frameView = new FrameView({
    focusable: false
});
let menu = null;

function addContentCorrespondent() {
    for (const key in FRAMESCONSTANTS) {
        const correspondent = frameView.getCorrespondent(key);
        const contentFrame = key === "content" ? frameView.scormInterface.currentFile.frame : frameView.scormInterface.contextDocument.querySelector(FRAMESCONSTANTS[key]);
        if (!correspondent) {
            frameView.addCorrespondent(new FrameCorrespondent(key, contentFrame));
        } else {
            correspondent.update(contentFrame);
        }
    }
}

function listenMessages() {
    frameView.listenMessages((datas) => {
        if(datas.type === Menu.MENU_CONTENT) {
            menu.addContent(datas);
        }
        if (datas.type === MESSAGES.MENU_TOGGLE) {
            addContentCorrespondent();
            const condition = typeof datas.condition === "string" ? datas.condition===menu.state : true;
            if(condition===true){
                if(menu.state==="closed"){
                    show();
                    menu.show(datas);
                    frameView.sendTo("footer", {
                        type: MESSAGES.FOOTER_UPDATE,
                        state: "opened"
                    });
                } else {
                    menu.hide().then(() => {
                        hide();
                    });
                    frameView.sendTo("footer", {
                        type: MESSAGES.FOOTER_UPDATE,
                        state: "closed"
                    });
                }  
            }
        }


        if (datas.type === MESSAGES.MENU_SHOW) {
            show();
            if(menu){
                menu.show(datas);
                frameView.sendTo("footer", {
                    type: MESSAGES.FOOTER_UPDATE,
                    state: "opened"
                });
            }
        }

        if (datas.type === MESSAGES.MENU_HIDE) {
            menu.hide(false);
            hide();
            frameView.sendTo("footer", {
                type: MESSAGES.FOOTER_UPDATE,
                state: "closed"
            });
        }

        if (datas.type === MESSAGES.MENU_UPDATE) {
            menu.update(datas);
        }

        if(datas.type === MESSAGES.MENU_OFF){
            menu.enabled = false;
        }

        if(datas.type === MESSAGES.MENU_ON){
            menu.enabled = true;
        }
    });
}

function init() {
    frameView.parent.classList.add("loaded");
    menu = new Menu();
    //Événements
    menu.on(Menu.OPEN_PART, (datas) => {
        frameView.sendTo("content", {
            type: MESSAGES.CONTENT_CHANGE,
            id:datas.data,
            fromMenu: true
        });
    });

    menu.on(Menu.SWITCH_LANGUAGE, () => {
        frameView.sendTo("content", {
            type: MESSAGES.CONTENT_SWITCH_LANGUAGE,
            language:menu.language
        });
    });
    
    addContentCorrespondent();
    listenMessages();
    hide();
}

function show() {
    //frameElement.parentNode.style.display = "block";
    frameElement.parentNode.style.opacity = "1";
    frameElement.parentNode.style.pointerEvents = "auto";
    frameElement.parentNode.style.visibility = "";
}

function hide() {
    //frameElement.parentNode.style.display = "none";
    frameElement.parentNode.style.opacity = "0";
    frameElement.parentNode.style.pointerEvents = "none";
    frameElement.parentNode.style.visibility = "hidden";
}

frameView.on(FrameView.LOADED, init);
