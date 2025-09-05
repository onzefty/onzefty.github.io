async function screen13(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const buttonQuit = screenElement.querySelector(".button-continue");

    const handleQuit = () => {
        app.scormInterface.scorm.quit();
    };

    buttonQuit.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleQuit);

    screen.addDisposer(() => {
        buttonQuit.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleQuit);
    });

    init();
}

export default screen13;
