function screen14(app, data, components)  {
    const { screen, init } = data;
    const screenElement = screen.element;

    const items = screen.utils.getElementsFrom(".enable", screenElement);
    const circleButtons = screen.utils.getElementsFrom(".completed", screenElement); 

    const handleItemClick = () => {
        screen.goToNext();
    };

    const handleCircleButtonClick = (event) => {
        const nextValue = Number(event.currentTarget.getAttribute("data-next"));

        if (Number.isNaN(nextValue)) {
            return;
        }

        app.navigation.goTo(nextValue);
    };

    items.forEach((item) => {
        item.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
    });

    circleButtons.forEach((circleButton) => {
        circleButton.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleCircleButtonClick);
    });

    screen.addDisposer(() => {
        items.forEach((item) => {
            item.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
        });

        circleButtons.forEach((circleButton) => {
            circleButton.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleCircleButtonClick);
        });
    });

    screen.enableNext();
    init();
}

export default screen14;
