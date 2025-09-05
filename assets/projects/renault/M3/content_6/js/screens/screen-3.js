function screen3(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const dropWrapper = screenElement.querySelector('.drop-wrapper');
    const progress = screenElement.querySelector('.slider-dots');
    const slider = screenElement.querySelector('.slider');
    const boundariesElement = screen.utils.getElementFrom(".screen-content", screenElement);
    const drags = screen.utils.getElementsFrom(".drag", screenElement);
    const drops = screen.utils.getElementsFrom(".drop", screenElement);
    const hint = screen.utils.getElementFrom(".card-swipe-hint", screenElement);
    let current = 1;
    const answers = [
        {answer:2}, {answer:3}, {answer:4}, {answer:2}, {answer:4}, {answer:3}
    ]
    const total = answers.length;

    function update(){
        interaction.disabled = true;
        dropWrapper.classList.add("right");
    }

    const sliderM = new components.Slider({
        progress,
        list:[
            {element: slider}
        ]
    });

    sliderM.on(sliderM.events.PREVIOUS, () => {
        progress.classList.add("reverse");
    });
    sliderM.on(sliderM.events.NEXT, () => {
        progress.classList.remove("reverse");
    });
    sliderM.on(sliderM.events.EACH, () => {
        interaction.disabled = false;
    });

    const interaction = new components.DragDrop({
        drags,
        drops,
        dropDatas:[answers[current-1]],
        validateOnDrop: true,
        boundariesElement
    });

    interaction.on(interaction.events.DOWN, () => {
        hint.classList.remove("show");
    });

    interaction.on(interaction.events.WRONG, (event) => {
        const { drag, drop } = event.data;

        if (!drag || !drop) {
            return;
        }

        screen.stopDelayedExecute("hide-drop-wrong");

        drop.element.classList.add("wrong");

        screen.executeDelayed(
            () => {
                drop.element.classList.remove("wrong");
            },
            1000,
            "hide-drop-wrong"
        );
    });

    interaction.on(interaction.events.END, () => {
        drops.forEach((drop) => {
            drop.classList.remove("wrong");
        });
        update();
    });

    hint.classList.add("show");

    dropWrapper.onanimationend = (event) => {
        if (event.target !== event.currentTarget) return;
        dropWrapper.classList.remove("right");
        if(current < total){
            current++;
            interaction.drops[0].answer = [answers[current-1].answer];
            interaction.reset();
            sliderM.nextSlide();
        } else {
            screen.enableNext();
        }
    }

    screen.addDisposer(() => {
        dropWrapper.classList.remove("right");
        hint.classList.remove("show");
        interaction.dispose();
        interaction.unresize();
        sliderM.dispose();
    });

    init();
}

export default screen3;