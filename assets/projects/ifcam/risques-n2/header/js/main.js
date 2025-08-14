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
        if (frameElement.style.display !== 'block') {
            frameElement.style.display = 'block';
            header.show();
        }
    }

    function hide() {
        if (frameElement.style.display !== 'none') {
            header.hide();
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

        header = new Header();

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

            if (datas.type === MessagesConstants.HEADER_UPDATE) {
                header.update(datas);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', handleLoaded);
})(window);
