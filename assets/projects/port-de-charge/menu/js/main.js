var ofp, ofpWin;
var ofpConstants = InterfaceFinder.searchConstants();

(function (win) {
    var menu = null;
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
        var headerFrame = ofpWin.document.querySelector('#header');

        if (headerFrame) {
            message.sendTo(headerFrame.contentWindow, datas);
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
            menu.show();
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

    // -> ouvre la popup de confirmation
    function openPopup(content,onClickYesFunction){
        ofp.popupConfirmation.domElement.innerHTML=content;
        ofp.popupConfirmation.show();

        var popup=ofp.popupConfirmation.domElement;

        popup.querySelector(".yesHitArea").addEventListener(Constants.CLICK_TOUCH, function(){
            onClickYesFunction.call();
        });
        popup.querySelector(".popupContent").addEventListener(Constants.CLICK_TOUCH, function(){
            closePopup();
        });
        //resizeHtmlElement(popup.find(".popupContentWrapper"));
    }

    // -> Ferme la popup et vide son contenu
    function closePopup(){
        ofp.popupConfirmation.domElement.innerHTML="";
        ofp.popupConfirmation.hide();
    }

    // -> génère la popup de confirmation
    function buildPopup(messageHTML){
      return '<div class="popupContent noselectable">'+
        '<div class="popupContentWrapper">'+
            '<div class="up flexCenter"><p>'+messageHTML+'</p></div>'+
            '<div class="down flexCenter">'+
            '<div class="button flexCenter yesHitArea"><p>oui</p></div>'+
            '<div class="button flexCenter noHitArea"><p>non</p></div>'+
            '</div>'+
        '</div>'+
      '</div>';
    }

    function init() {

        menu = new Menu();
        //Événements
        menu.on(Menu.MENU_CLICK_HIDE, function () {
            sendToContent({
                type: MessagesConstants.CONTENT_SOUND_CLOSE,
            });
            menu.hide();
        });
        menu.on(Menu.MENU_HIDE, function () {
            hide();
        });
        menu.on(Menu.MENU_QUIT, function(){
            openPopup(buildPopup("Voulez-vous quitter la formation ?<br><span style='text-transform:none;font-size:2vh;'></span>"),function(){ofp.close()});
        });

        menu.on(Menu.MENU_GO, function () {
            sendToContent({
                type: MessagesConstants.CONTENT_CHANGE,
                id:menu.idClicked
            });
            hide();
        });

        //Messages de l'iframe
        message.listen(function (datas,test) {
            if (datas.type === MessagesConstants.MENU_BLUR) {
                blurMe();
            }

            if (datas.type === MessagesConstants.MENU_SHOW) {
                sendToContent({
                    type: MessagesConstants.CONTENT_SOUND_OPEN,
                });
                show();
            }

            if (datas.type === MessagesConstants.MENU_HIDE) {
                sendToContent({
                    type: MessagesConstants.CONTENT_SOUND_CLOSE,
                });
                hide();
            }

            if (datas.type === MessagesConstants.MENU_CLICK_HIDE) {
                sendToContent({
                    type: MessagesConstants.CONTENT_SOUND_CLOSE,
                });
                menu.hide();
            }

            if (datas.type === MessagesConstants.MENU_CONTENT_CHANGED) {
            }

            if (datas.type === MessagesConstants.MENU_UPDATE) {
                menu.update(datas);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', handleLoaded);
})(window);
