function screen17(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();
    const datas = [
        { answer: true },
        { answer: true },
        { answer: false },
        { answer: true }
    ];
    const buttons = screen.utils.getElementsFrom(".question-checkbox", screenElement);
    const btValidate = screen.utils.getElementFrom(".button-validate", screenElement);

    const interaction = new components.Clickables({
        datas,
        buttons,
        btValidate,
        noCorrection: true
    });

    interaction.on(interaction.events.END, async () => {
        storedDatas["content-3-question-1"] = interaction.success;
        await screen.storeScormDatas(storedDatas);
        screen.goToNext();
    });

    screen.addDisposer(() => {
        interaction.dispose();
    });

    init();

    screen.disableNavigation();
}

export default screen17;