var ofp, ofpWin;
var ofpConstants = InterfaceFinder.searchConstants();

(function (win) {
    var glossary = null;
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

    function sendToHeader(datas) {
        var frame = ofpWin.document.querySelector('#header');

        if (frame) {
            message.sendTo(frame.contentWindow, datas);
        }
    }

    function sendToFooter(datas) {
        var frame = ofpWin.document.querySelector('#footer');

        if (frame) {
            message.sendTo(frame.contentWindow, datas);
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
            sendToHeader({
                type: MessagesConstants.MENU_HIDE,
            });
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
            type: MessagesConstants.CONTENT_FOCUS,
        });
    }

    function init() {

        glossary = new Glossary();
        //Événements
        glossary.on(Glossary.HIDE, function (datas) {
            glossary.hide(hide,true);
        });
        
        //Messages de l'iframe
        message.listen(function (datas,test) {
            if (datas.type === MessagesConstants.GLOSSARY_SHOW) {
                show();
                glossary.show(true);
            }

            if (datas.type === MessagesConstants.GLOSSARY_UPDATE) {
                glossary.update(datas);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', handleLoaded);
})(window);
