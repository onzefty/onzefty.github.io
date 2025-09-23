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
        /*
        if (frameElement.style.display !== 'block') {
            frameElement.style.display = 'block';
            footer.show().then(noop).catch(noop);
        }
        */
    }

    function hide() {
        /*
        if (frameElement.style.display !== 'none') {
            footer
                .hide()
                .then(function () {
                    frameElement.style.display = 'none';
                })
                .catch(noop);
        }
        */
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

    function init() {

        footer = new Footer();
        //Événements
        footer.on(Footer.NEXT_CLICKED, function () {
            sendToContent({
                type: MessagesConstants.CONTENT_NEXT,
                value:footer.nextValue
            });
            footer.nextValue = 1;
            footer.prevValue = -1;
        });
        footer.on(Footer.PREVIOUS_CLICKED, function () {
            sendToContent({
                type: MessagesConstants.CONTENT_PREVIOUS,
                value:footer.prevValue
            });
            footer.nextValue = 1;
            footer.prevValue = -1;
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

            if (datas.type === MessagesConstants.FOOTER_CONTENT_CHANGED) {
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
