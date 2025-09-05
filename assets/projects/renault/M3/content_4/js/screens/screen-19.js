function screen19(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const buttonNext = screen.utils.getElementFrom(".button-next", screenElement);
    const handleNext = () => {
        app.navigation.next();
    }

    buttonNext.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);

    screen.addDisposer(() => {
        buttonNext.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);
    });

    init();
}

export default screen19;