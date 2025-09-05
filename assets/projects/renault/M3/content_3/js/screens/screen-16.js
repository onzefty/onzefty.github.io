function screen16(_, data) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const nextBtn = screen.utils.getElementFrom(".screen-quiz-button-start", screenElement);

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

export default screen16;
