function screen1(app, data) {
    const { screen, init } = data;

    app.sendTo("menu", {
        type: app.messagesConstants.MENU_TOGGLE,
        condition:"opened"
    });

    app.sendTo("footer", {
        type: app.messagesConstants.FOOTER_UPDATE,
        menu: false
    });

    init();

    screen.enableNext();
}

export default screen1;