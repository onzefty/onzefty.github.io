function screen16(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const items = screen.utils.getElementsFrom(".summary-item:not(.disabled)", screenElement);

    const handleItemClick = (event) => {
        const nextValue = Number(event.currentTarget.getAttribute("data-next"));

        if (Number.isNaN(nextValue)) {
            return;
        }

        app.navigation.goTo(nextValue);
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

    init();
}

export default screen16;
