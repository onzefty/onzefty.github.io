function screen5(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    init();

    screen.enableNext();
}

export default screen5;