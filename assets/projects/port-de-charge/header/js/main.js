var ofp, ofpWin;
var ofpConstants = InterfaceFinder.searchConstants();

(function (win) {
    var header = null;
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
        /*
        if (frameElement.style.display !== 'block') {
            frameElement.style.display = 'block';
            header.show().then(noop).catch(noop);
        }
        */
    }

    function hide() {
        /*
        if (frameElement.style.display !== 'none') {
            header
                .hide()
                .then(function () {
                    frameElement.style.display = 'none';
                })
                .catch(noop);
        }
        */
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

    function init() {

        header = new Header();
        //Événements
        header.on(Header.TUTORING_TCHAT, function (event) {
            ofp.tutor.openChat();
        });
        header.on(Header.TUTORING_MAIL, function (event) {
            ofp.tutor.openMail();
        });
        header.on(Header.TUTORING_OPEN, function (event) {
            sendToContent({
                type: MessagesConstants.CONTENT_SOUND_OPEN,
            });
        });
        header.on(Header.TUTORING_CLOSE, function (event) {
            sendToContent({
                type: MessagesConstants.CONTENT_SOUND_CLOSE,
            });
        });
        header.on(Header.VOLUME_CHANGED, function (event) {
            sendToContent({
                type: MessagesConstants.CONTENT_VOLUME,
                value: header.volume,
            });
        });
        header.on(Header.CLICK_MENU_SHOW, function (event) {
            sendToMenu({
                type: MessagesConstants.MENU_SHOW,
            });
        });
        header.on(Header.CLICK_MENU_HIDE, function (event) {
            sendToMenu({
                type: MessagesConstants.MENU__CLICK_HIDE,
            });
        });

        //Messages de l'iframe
        message.listen(function (datas,test) {
            if (datas.type === MessagesConstants.HEADER_BLUR) {
                blurMe();
            }

            if (datas.type === MessagesConstants.HEADER_SHOW) {
                show();
            }

            if (datas.type === MessagesConstants.HEADER_HIDE) {
                hide();
            }

            if (datas.type === MessagesConstants.MENU_HIDE) {
                header.buttonMenu.classList.remove("open");
            }

            if (datas.type === MessagesConstants.HEADER_CONTENT_CHANGED) {
            }

            if (datas.type === MessagesConstants.HEADER_UPDATE) {
                header.update(datas);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', handleLoaded);
})(window);
