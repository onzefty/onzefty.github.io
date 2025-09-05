function screen9(_, data) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const items = screen.utils.getElementsFrom(".button", screenElement);

    const handleItemClick = () => {
        screen.goToNext();
    };

    items.forEach((item) => {
        item.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
    });

    screen.addDisposer(() => {
        items.forEach((item) => {
            item.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
        });

        items.length = 0;
    });
    screen.enableNext();

    init();
}

export default screen9;
