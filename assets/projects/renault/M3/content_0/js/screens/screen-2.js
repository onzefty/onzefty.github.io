function screen2(app, data) {
    const { screen, init } = data;

    app.sendTo("menu", {
        type: app.messagesConstants.MENU_TOGGLE,
        condition:"closed"
    });

    app.sendTo("menu", {
        type: app.messagesConstants.MENU_OFF
    });

    app.sendTo("footer", {
        type: app.messagesConstants.FOOTER_UPDATE,
        menu: false
    });

    init();

    screen.enableNext();
}

export default screen2;