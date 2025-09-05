function screen3(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();

    const datas = [{ answer: true }, { answer: false }, { answer: true }, { answer: true }, { answer: false }, { answer: true }];

    const buttons = screen.utils.getElementsFrom(".question-clickable", screenElement);
    const btValidate = screen.utils.getElementFrom(".button-validate", screenElement);

    const interaction = new components.Clickables({
        datas,
        buttons,
        btValidate
    });

    interaction.on(interaction.events.END, async () => {
        storedDatas["content-7-question-2"] = interaction.success;
        await screen.storeScormDatas(storedDatas);

        app.navigation.next();
    });

    screen.addDisposer(() => {
        interaction.dispose();
    });

    init();

    screen.disableNavigation();
}

export default screen3;
