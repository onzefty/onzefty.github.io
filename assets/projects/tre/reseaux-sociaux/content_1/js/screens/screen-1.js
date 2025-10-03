function screen1(_, data) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const nextBtn = screen.utils.getElementFrom(".button-init", screenElement);

    const handleItemClick = () => {
        screen.goToNext();
    };

    if (nextBtn) {
        nextBtn.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
    }

    screen.addDisposer(() => {
        if (nextBtn) {
            nextBtn.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
        }
    });

    init();
}

export default screen1;
