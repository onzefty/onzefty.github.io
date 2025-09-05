function screen4(app, data) {
    const { screen, init } = data;

    app.sendTo("footer", {
        type: app.messagesConstants.FOOTER_UPDATE,
        menu: false
    });

    screen.enableNext();

    init();
}

export default screen4;