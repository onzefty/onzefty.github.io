function screen13(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const items = screen.utils.getElementsFrom(".circle.enable", screenElement);
    const circleButtons = screen.utils.getElementsFrom(".completed", screenElement);
    const physicalButton = screen.utils.getElementFrom("#physique-btn", screenElement);
    const digitalButton = screen.utils.getElementFrom("#digital-btn", screenElement);
    const physique = screen.utils.getElementFrom("#physique", screenElement);
    const digital = screen.utils.getElementFrom("#digital", screenElement);
    const circle5 = screen.utils.getElementFrom("#circle-5", screenElement);
    const heading = screen.utils.getElementFrom(".easy", screenElement);

    const handleDigitalButtonClick = () => {
        digitalButton.classList.add("active");
        physicalButton.classList.remove("active");
        physique.style.display = "none";
        digital.style.display = "flex";
        digitalButton.removeAttribute('data-pulse');

        circle5.setAttribute('data-pulse', 'main-3');
        circle5.classList.remove("disabled");
        circle5.classList.add("enable");
        heading.style.display = "block";


        circle5.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);

        screen.enableNext();

        items.forEach(item => item.setAttribute('data-pulse', 'main-3'));
    };

    const handlePhysicalButtonClick = () => {
        physicalButton.classList.add("active");
        digitalButton.classList.remove("active");
        digital.style.display = "none";
        physique.style.display = "flex";
        heading.style.display = "none";

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

        if (circle5) {
            circle5.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleItemClick);
        }
    });

    resetScreen(); // Très important avant init !
    init();
}

export default screen13;
