function screen16(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const btPrev = screenElement.querySelector('.slider-button-previous');
    const btNext = screenElement.querySelector('.slider-button-next');
    const progress = screenElement.querySelector('.slider-dots');
    const slider = screenElement.querySelector('.s16-slider');

    const sliderM = new components.Slider({
        btNext, btPrev, progress,
        list: [
            { element: slider, axis: "x" }
        ]
    });

    sliderM.on(sliderM.events.END, (event) => {
        screen.enableNext();
    });

    sliderM.on(sliderM.events.PREVIOUS, () => {
        progress.classList.add("reverse");
    });
    sliderM.on(sliderM.events.NEXT, () => {
        progress.classList.remove("reverse");
    });

    sliderM.on(sliderM.events.EACHSTART, (event) => {
        const {data} = event;
        const {current} = data;
        screen.soundManager.play("sound-"+screen.id+"-"+current);
    });

    screen.addDisposer(() => {
        sliderM.dispose();
    });

    screen.soundManager.play("sound-"+screen.id);

    init();
}

export default screen16;