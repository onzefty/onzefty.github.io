function screen5(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const btPrev = screenElement.querySelector(".slider-button-previous");
    const btNext = screenElement.querySelector(".slider-button-next");
    const progress = screenElement.querySelector(".slider-dots");
    const sliderLeft = screenElement.querySelector(".slider-left");
    const sliderRight = screenElement.querySelector(".slider-right");
    const sliderCurrent = screenElement.querySelector(".slider-right-current");

    const slider = new components.Slider({
        btNext,
        btPrev,
        progress,
        list: [{ element: sliderLeft, axis: "y", reverse:true }, { element: sliderRight, axis: "y" }]
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
    slider.on(slider.events.EACHSTART, (event) => {
        sliderCurrent.innerHTML = event.data.current;
    });

    screen.addDisposer(() => {
        slider.dispose();
        sliderCurrent.innerHTML = 1;
    });

    init();
}

export default screen5;