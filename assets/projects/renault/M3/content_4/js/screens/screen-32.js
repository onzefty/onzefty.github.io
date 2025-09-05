function screen32(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();

    const datas = [{ answer: true }, { answer: false }];

    const buttons = screen.utils.getElementsFrom(".question-clickable", screenElement);

    const interaction = new components.Clickables({
        datas,
        buttons,
    });

    interaction.on(interaction.events.END, async () => {
        storedDatas["content-4-question-4"] = interaction.success;
        await screen.storeScormDatas(storedDatas);

        app.navigation.next();
    });

    screen.addDisposer(() => {
        interaction.dispose();
    });

    init();

    screen.disableNavigation();
}

export default screen32;