function screen8(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();

    const datas = [{ answer: false }, { answer: false }, { aswer: true }];

    const buttons = screen.utils.getElementsFrom(".question-clickable", screenElement);

    const interaction = new components.Clickables({
        datas,
        buttons,
    });

    interaction.on(interaction.events.END, async () => {
        storedDatas["content-7-question-7"] = interaction.success;
        await screen.storeScormDatas(storedDatas);

        app.navigation.next();
    });

    screen.addDisposer(() => {
        interaction.dispose();
    });

    init();

    screen.disableNavigation();
}

export default screen8;
