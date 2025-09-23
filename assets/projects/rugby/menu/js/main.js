var ofp, ofpWin;
var ofpConstants = InterfaceFinder.searchConstants();

(function (win) {
    var menu = null;
    var message = new Message();
    var api = null;
    
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

    function sendToGlossary(datas) {
        var frame = ofpWin.document.querySelector('#glossary');

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

    function init() {

        menu = new Menu();
        api = new APIClient({ ...parent.env, token: parent.ofp.token });
        api.getTime().then(function(result){
            menu.time = result;
        });
        //Événements
        menu.on(Menu.OPEN_PART, function (datas) {
            sendToContent({
                type: MessagesConstants.CONTENT_CHANGE,
                id:datas.data
            });
        });
        
        //Messages de l'iframe
        message.listen(function (datas,test) {
            if (datas.type === MessagesConstants.MENU_BLUR) {
                blurMe();
            }

            if (datas.type === MessagesConstants.MENU_TOGGLE) {
                var condition = typeof datas.condition == "string" ? datas.condition==menu.state : true;
                if(condition==true){
                    if(menu.state=="closed"){
                        show();
                        menu.show(datas.animated,datas.byFooter);
                        if(datas.byFooter){
                            sendToFooter({
                                type: MessagesConstants.FOOTER_UPDATE,
                                byFooter: "open"
                            });
                        }
                    } else {
                        menu.hide(hide,datas.animated,datas.byFooter);
                        if(datas.byFooter){
                            sendToFooter({
                                type: MessagesConstants.FOOTER_UPDATE,
                                byFooter: "close"
                            });
                        }
                    }  
                }
            }

            if (datas.type === MessagesConstants.MENU_UPDATE) {
                menu.update(datas);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', handleLoaded);
})(window);
