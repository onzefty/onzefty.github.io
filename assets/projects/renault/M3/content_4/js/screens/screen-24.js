function screen24(_, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const buttonNext = screen.utils.getElementFrom(".button-next", screenElement);
    const handleNext = () => {
        buttonNext.classList.add("disabled");
        screenBloc.classList.add("changed");
        screen.enableNext();
    }
    const screenBloc = screen.utils.getElementFrom(".bloc", screenElement);

    buttonNext.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);

    screen.addDisposer(() => {
        buttonNext.classList.remove("disabled");
        buttonNext.classList.remove("show");
        buttonNext.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);
        screenBloc.classList.remove("changed");
    });

    init();
}

export default screen24;
