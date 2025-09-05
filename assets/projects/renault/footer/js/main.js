import { FrameView, FrameCorrespondent } from "../../common/content/js/frames/frame-view.js";
import MESSAGES from "../../common/content/js/components/message-constants.js";
import Footer from "./footer.js";
import FRAMESCONSTANTS from "../../common/content/js/frames/frame-constants.js";

const frameView = new FrameView({
    focusable: false
});
let footer = null;

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
        if (datas.type === MESSAGES.FOOTER_UPDATE) {
            addContentCorrespondent();
            footer.update(datas);
        }
    });
}

function init() {
    frameView.parent.classList.add("loaded");
    footer = new Footer();
    //Événements
    footer.on(Footer.NEXT_CLICKED, (event) => {
        const {data} = event;
        frameView.sendTo("content", {
            type: MESSAGES.CONTENT_NEXT,
            value:data,
            fromFooter: true
        });
    });
    footer.on(Footer.PREVIOUS_CLICKED, (event) => {
        const {data} = event;
        frameView.sendTo("content", {
            type: MESSAGES.CONTENT_PREVIOUS,
            value:data,
            fromFooter: true
        });
    });
    footer.on(Footer.FOOTER_OPEN_PART, (datas) => {
        frameView.sendTo("content", {
            type: MESSAGES.CONTENT_CHANGE,
            id:datas.data,
            fromFooter: true
        });
    });

    footer.on(Footer.FOOTER_LANGUAGE, () => {
        frameView.sendTo("content", {
            type: MESSAGES.CONTENT_SWITCH_LANGUAGE,
            language:footer.language
        });
    });

    footer.on(Footer.MENU_TOGGLE, () => {
        frameView.sendTo("menu", {
            type: MESSAGES.MENU_TOGGLE
        });
    });
    
    addContentCorrespondent();
    listenMessages();
}
frameView.on(FrameView.LOADED, init);

