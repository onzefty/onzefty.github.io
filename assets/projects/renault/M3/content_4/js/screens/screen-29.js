function screen29(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();

    const dropDatas = [{ answer: 3 }, { answer: 1 }, { answer: 2 }, { answer: 0 }];

    const screenContent = screen.utils.getElementFrom(".screen-content", screenElement);
    const drags = screen.utils.getElementsFrom(".drag", screenElement);
    const drops = screen.utils.getElementsFrom(".drop", screenElement);
    const btValidate = screen.utils.getElementFrom(".button-validate", screenElement);
    const dragCounter = screen.utils.getElementFrom(".drags-counter", screenElement);
    const dragDatas = screen.utils.shuffleValue(drags);
    const dragCounterHTML = dragCounter ? dragCounter.innerHTML : "";

    drags.forEach((drag, index) => {
        drag.dataset.id = index;
    });

    dragDatas.forEach((drag, index) => {
        const realID = Number(drag.dataset.id);

        dropDatas[realID].answer = index + 1;

        drag.parentElement.prepend(drag);
    });

    const interaction = new components.DragDrop({
        drags: dragDatas,
        drops,
        dropDatas,
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
        
        storedDatas["content-4-question-1"] = interaction.success;
        await screen.storeScormDatas(storedDatas);

        app.navigation.next();
    });

    interaction.on(interaction.events.DROPPED, () => {
        updateDragCounter();
    });

    interaction.on(interaction.events.RETURNED, () => {
        updateDragCounter();
    });

    updateDragCounter();

    screen.addDisposer(() => {
        if (dragCounter) {
            dragCounter.innerHTML = dragCounterHTML;
        }

        drags.forEach((drag) => {
            drag.parentElement.appendChild(drag);
        });

        interaction.dispose();
        interaction.unresize();
    });

    init();

    screen.disableNavigation();
}

export default screen29;