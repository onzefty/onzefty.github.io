function screen11(app, data, components)  {
    const { screen, init } = data;
    const screenElement = screen.element;

    const items = screen.utils.getElementsFrom(".enable", screenElement);
    const circleButtons = screen.utils.getElementsFrom(".completed", screenElement); // Correction ici aussi (getElementsFrom au pluriel)

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
            circleButton.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleCircleButtonClick); // Ici, on enlève l'écouteur
        });
    });

    screen.enableNext();
    init();
}

export default screen11;
