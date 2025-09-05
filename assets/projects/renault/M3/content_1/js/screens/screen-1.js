function screen1(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const button = screen.utils.getElementFrom(".screen-quiz-button-start", screenElement);

    const handleItemClick = (event) => {
        app.navigation.next();
    };

    button.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);

    screen.addDisposer(() => {
        button.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
    });


    init();
}

export default screen1;