function screen1(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const videoContainer = screenElement.querySelector(".screen-video");

    const interaction = new components.VideoWrapper(
            {
                container: videoContainer,
                video: {
                    fileUrl: "./assets/videos/renault-ambassadeur-01.mp4",
                    autoplay: true,
                },
                end: () => {
                    screen.enableNext();

                },
                play: () => {


                },
                pause: () => {


                },
                load: (loadData) => {
                }
            }
    );

    screen.addDisposer(() => {
        interaction.destroy();
    });

    init();

    screen.enableNext();

    
}

export default screen1;