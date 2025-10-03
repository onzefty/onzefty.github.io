function screen19(app, data) {
    const { screen, init } = data;
    const screenElement = screen.element;
    const desktopWrapper = screen.utils.getElementFrom("#s19-img-wrapper-desktop", screenElement);
    const mobileWrapper = screen.utils.getElementFrom("#s19-img-wrapper-mobile", screenElement);

    screen.enableNext();

    screen.soundManager.play("sound-"+screen.id);

    screen.executeDelayed(
        () => {
            desktopWrapper.classList.add("animation");
            mobileWrapper.classList.add("animation");
        },
        300,
        "animation",
    );

    screen.addDisposer(() => {
        desktopWrapper.classList.remove("animation");
        mobileWrapper.classList.remove("animation");
    });

    init();
}

export default screen19;