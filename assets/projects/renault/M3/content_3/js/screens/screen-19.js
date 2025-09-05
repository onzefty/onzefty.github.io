function screen19(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();

    const dropDatas = [
        {answer:[1,2]},
        {answer:[1,2]},
        {answer:[1,2]},
        {answer:[3,4]},
        {answer:[3,4]},
        {answer:[3,4]},
        {answer:[5]},
        {answer:[5]},
        {answer:[5]},
    ];

    const dropDatasClone = [];

    const screenContent = screen.utils.getElementFrom(".screen-content", screenElement);
    const drags = screen.utils.getElementsFrom(".drag", screenElement);
    const drops = screen.utils.getElementsFrom(".drop", screenElement);
    const btValidate = screen.utils.getElementFrom(".button-validate", screenElement);
    const dragCounter = screen.utils.getElementFrom(".drags-counter", screenElement);
    const dragDatas = screen.utils.shuffleValue(drags);

    drags.forEach((drag, index) => {
        drag.dataset.id = index;
    });

    dropDatas.forEach((drop, index) => {
        dropDatasClone[index] = { answer: [] };
    });

    dragDatas.forEach((drag, index) => {
        const realID = Number(drag.dataset.id) + 1;

        dropDatas.forEach((drop, index2) => {
            if(drop.answer.includes(realID)) {
                dropDatasClone[index2].answer.push(index + 1);
            }
        });

        drag.parentElement.prepend(drag);
    });

    const interaction = new components.DragDrop({
        drags: dragDatas,
        drops,
        dropDatas:dropDatasClone,
        boundariesElement: screenContent,
        btValidate,
        noCorrection: true,
        classesNames: {
            right:"quiz-right",
            wrong:"quiz-wrong"
        }
    });

    const updateDragCounter = () => {
        if (!dragCounter || !interaction) {
            return;
        }

        const placedDrags = interaction.drags.filter((drag) => drag.placed !== 0);

        dragCounter.innerText = interaction.drags.length - placedDrags.length;
    };

    interaction.on(interaction.events.END, async () => {
        updateDragCounter();
        storedDatas["content-3-question-3"] = interaction.success;
        await screen.storeScormDatas(storedDatas);
        app.navigation.next();
    });

    interaction.on(interaction.events.RETURNED, () => {
        updateDragCounter();
    });

    interaction.on(interaction.events.DROPPED, () => {
        updateDragCounter();
    });

    updateDragCounter();

    screen.addDisposer(() => {
        drags.forEach((drag) => {
            drag.parentElement.appendChild(drag);
        });
        drops.forEach((drop) => {
            drop.classList.remove("wrong");
        });
        interaction.dispose();
        interaction.unresize();
    });

    init();

    screen.disableNavigation();
}

export default screen19;