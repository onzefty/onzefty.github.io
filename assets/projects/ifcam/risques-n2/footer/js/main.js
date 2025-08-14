var ofp, ofpWin;
var ofpConstants = InterfaceFinder.searchConstants();

(function (win) {
    var footer = null;
    var message = new Message();

    /*  Fix suite au fait que l'iframe est directement
        créee dans l'index.html de l'interface
        de ce fait elle est potentiellement loader avant
        que ofp soit initialisé.    
    */
    function handleLoaded() {
        ofp = InterfaceFinder.searchOfp();
        ofpWin = InterfaceFinder.searchOfpWindow();

        if (ofp && ofp.ready) {
            init();
        } else {
            win.parent.addEventListener(ofpConstants.READY, handleLoaded);
        }
    }

    function sendToMenu(datas) {
        var menuFrame = ofpWin.document.querySelector('#menuFrame');

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

    function enableNavigation() {
    }

    function disableNavigation() {
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
            type: MessagesConstants.CONTENT_FOCUS,
        });
    }

    function switchLanguage(){
        sendToContent({
            type: MessagesConstants.CONTENT_SWITCH_LANGUAGE,
            language:footer.language
        });
    }

    function init() {

        footer = new Footer();
        //Événements
        //Événements
        footer.on(Footer.NEXT_CLICKED, function () {
            sendToContent({
                type: MessagesConstants.CONTENT_NEXT,
                value:footer.nextValue
            });
            footer.nextValue = 1;
            footer.prevValue = -1;
            footer.update({duration:0});
        });
        footer.on(Footer.PREVIOUS_CLICKED, function () {
            sendToContent({
                type: MessagesConstants.CONTENT_PREVIOUS,
                value:footer.prevValue
            });
            footer.nextValue = 1;
            footer.prevValue = -1;
            footer.update({duration:0});
        });
        footer.on(Footer.VOLUME_CHANGED, function (event) {
            sendToContent({
                type: MessagesConstants.CONTENT_VOLUME,
                value: footer.volume,
            });
        });
        footer.on(Footer.MENU_TOGGLE, function (event) {
            sendToMenu({
                type: MessagesConstants.MENU_TOGGLE,
                animated:true,
                byFooter:true
            });
        });
        footer.on(Footer.SUBTITLES_OFF, function (event) {
            sendToContent({
                type: MessagesConstants.SUBTITLES_OFF,
                byFooter:true
            });
        });
        footer.on(Footer.SUBTITLES_ON, function (event) {
            sendToContent({
                type: MessagesConstants.SUBTITLES_ON,
                byFooter:true
            });
        });
        //Messages de l'iframe
        message.listen(function (datas,test) {
            if (datas.type === MessagesConstants.FOOTER_BLUR) {
                blurMe();
            }

            if (datas.type === MessagesConstants.FOOTER_SHOW) {
                show();
            }

            if (datas.type === MessagesConstants.FOOTER_HIDE) {
                hide();
            }

            if (datas.type === MessagesConstants.FOOTER_UPDATE) {
                footer.update(datas);
            }
            if (datas.type === MessagesConstants.FOOTER_ON) {
                footer.handleOn(datas.which);
            }

            if (datas.type === MessagesConstants.FOOTER_OFF) {
                footer.handleOff(datas.which);
            }

            if (datas.type === MessagesConstants.FOOTER_NEXT_CHANGED) {
                footer.nextValue = datas.number;
            }

            if (datas.type === MessagesConstants.FOOTER_PREV_CHANGED) {
                footer.prevValue = datas.number;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', handleLoaded);
})(window);
