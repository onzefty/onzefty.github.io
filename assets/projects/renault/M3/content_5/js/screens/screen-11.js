function screen11(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const btPrev = screenElement.querySelector(".slider-button-previous");
    const btNext = screenElement.querySelector(".slider-button-next");
    const progress = screenElement.querySelector(".slider-dots");
    const sliderLeft = screenElement.querySelector(".slider-wrapper-left");
    const sliderRight = screenElement.querySelector(".slider-wrapper-right > .slider");

    const slider = new components.Slider({
        btNext,
        btPrev,
        progress,
        list: [{ element: sliderLeft, axis: "y" }, { element: sliderRight }]
    });

    slider.on(slider.events.PREVIOUS, () => {
        progress.classList.add("reverse");
    });
    slider.on(slider.events.NEXT, () => {
        progress.classList.remove("reverse");
    });
    slider.on(slider.events.END, () => {
        screen.enableNext();
    });

    screen.addDisposer(() => {
        slider.dispose();
    });

    init();
}

export default screen11;
