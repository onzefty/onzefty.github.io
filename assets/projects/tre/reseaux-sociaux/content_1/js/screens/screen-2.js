function screen2(app, data) {
    const { screen, init } = data;

    init();

    screen.soundManager.play("sound-"+screen.id);

    screen.enableNext();
}

export default screen2;