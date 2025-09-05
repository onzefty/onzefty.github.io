function screen12(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const items = screen.utils.getElementsFrom(".circle.enable", screenElement);
    const circleButtons = screen.utils.getElementsFrom(".completed", screenElement);
    const physicalButton = screen.utils.getElementFrom("#physique-btn", screenElement);
    const digitalButton = screen.utils.getElementFrom("#digital-btn", screenElement);
    const physique = screen.utils.getElementFrom("#physique", screenElement);
    const digital = screen.utils.getElementFrom("#digital", screenElement);
    const circle4 = screen.utils.getElementFrom("#circle-4", screenElement);

    const handleDigitalButtonClick = () => {
        digitalButton.classList.add("active");
        physicalButton.classList.remove("active");
        physique.style.display = "none";
        digital.style.display = "flex";
        digitalButton.removeAttribute('data-pulse');

        circle4.setAttribute('data-pulse', 'main-3');
        circle4.classList.remove("disabled");
        circle4.classList.add("enable");

        circle4.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);

        screen.enableNext();

        items.forEach(item => item.setAttribute('data-pulse', 'main-3'));
    };

    const handlePhysicalButtonClick = () => {
        physicalButton.classList.add("active");
        digitalButton.classList.remove("active");
        digital.style.display = "none";
        physique.style.display = "flex";
    };

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

    const resetScreen = () => {
        // Reset affichage physique/digital
        physique.style.display = "flex";
        digital.style.display = "none";

        // Activer physique-btn par défaut
        physicalButton.classList.add("active");
        digitalButton.classList.remove("active");



        // Reset items data-pulse
        items.forEach(item => {
            item.removeAttribute('data-pulse');
        });
    };

    items.forEach((item) => {
        item.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
    });

    circleButtons.forEach((circleButton) => {
        circleButton.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleCircleButtonClick);
    });

    if (digitalButton) {
        digitalButton.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleDigitalButtonClick);
    }

    if (physicalButton) {
        physicalButton.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handlePhysicalButtonClick);
    }

    screen.addDisposer(() => {
        items.forEach((item) => {
            item.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
        });

        circleButtons.forEach((circleButton) => {
            circleButton.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleCircleButtonClick);
        });

        if (digitalButton) {
            digitalButton.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleDigitalButtonClick);
        }

        if (physicalButton) {
            physicalButton.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handlePhysicalButtonClick);
        }

        if (circle4) {
            circle4.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
        }
    });

    resetScreen(); // Très important avant init !
    init();
}

export default screen12;
