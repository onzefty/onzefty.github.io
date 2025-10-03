function screen23(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const storedDatas = screen.getStoredScormDatas();

    const datas = [
        {answer:false},
        {answer:true},
        {answer:false}
    ];

    const buttons = screen.utils.getElementsFrom(".quiz-clickable", screenElement);
    const btNext = screen.utils.getElementFrom(".quiz-button-next", screenElement);
    const handleNext = () => {
        app.navigation.next();
    };

    btNext.addEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);

    const interaction = new components.Clickables({
        datas,
        buttons,
        // btValidate,
        // noCorrection: true
    });

    interaction.on(interaction.events.END, async () => {
        storedDatas["content-1-question-1"] = interaction.success;
        await screen.storeScormDatas(storedDatas);

        btNext.classList.remove("disabled");
    });

    screen.addDisposer(() => {
        interaction.dispose();
        btNext.removeEventListener(screen.utils.EVENTS.CLICK_TOUCH, handleNext);
    });

    btNext.classList.add("disabled");

    init();

    screen.disableNavigation();

    screen.soundManager.play("sound-"+screen.id);
}

export default screen23;