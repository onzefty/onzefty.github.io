/**
 * Gestion de l'écran 3 avec le composant de swipe des cartes
 * @param {Object} app - Instance principale de l'application
 * @param {Object} data - Données de l'écran
 * @param {Object} components - Composants disponibles
 */
function screen3(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;


    // Sélection des éléments du DOM
    const cardContainerFeedback = screen.element.querySelector(".card-game-placeholder .card-feedback");
    const swipeTutorial = screen.element.querySelector(".card-swipe-hint");
    const left = components.CardSwipe.DIRECTIONS.LEFT;
    const right = components.CardSwipe.DIRECTIONS.RIGHT;
    const feedback = screenElement.querySelector(".feedback");
    const correctFeedback = screenElement.querySelector(".feedback .correct")
    const incorrectcorrectFeedback = screenElement.querySelector(".feedback .incorrect")





    // cardPlaced.style.opacity = "1";

    // Initialisation du composant CardSwipe avec rotation et réponses attendues
    const cardSwipe = new components.CardSwipe(screen.element, {
        rotation: 4,
        answers: [right],
    });

    // Gestion de la validation d'une carte
    cardSwipe.on(components.CardSwipe.VALIDATE, (event) => {
        const target = event.target;
        const data = event.data;
        const correct = data.correct;
        feedback.style.visibility = "visible";
        swipeTutorial.classList.remove("show");


        let cardFeedback = target.current.querySelector(".card-feedback");

        // Gestion du feed
        // back visuel (correct/incorrect)
        if (!cardSwipe.isElementVisible(target.elements.leftArea)) {
            cardFeedback = cardContainerFeedback;

            screen.stopDelayedExecute("hide-feedback");
            screen.stopDelayedExecute("clean-feedback");
        }


        cardFeedback.classList.remove("correct");
        cardFeedback.classList.remove("incorrect");


        // Application des classes pour lefmov feedback
        cardFeedback.classList.remove("correct", "incorrect");
        if (correct) {
            cardFeedback.classList.add("correct");
            correctFeedback.style.display = "inline";
            incorrectcorrectFeedback.style.display = "none";
        } else {
            cardFeedback.classList.add("incorrect");
            incorrectcorrectFeedback.style.display = "inline";
            correctFeedback.style.display = "none";
        }
        cardFeedback.classList.add("show");

        // Minuteurs pour masquer le feedback
        screen.executeDelayed(
            () => {
                cardFeedback.classList.remove("show");
                screen.executeDelayed(
                    () => {
                        cardFeedback.classList.remove("correct", "incorrect");
                    },
                    1000,
                    "clean-feedback"
                );
            },
            4000,
            "hide-feedback"
        );
    });

    // Gestion du mouvement des cartes
    cardSwipe.on(components.CardSwipe.MOVE, (event) => {
        const target = event.target;
        const data = event.data;
        const cardFeedback = target.current.querySelector(".card-feedback");
        if (cardFeedback) {
            cardFeedback.classList.remove("correct", "incorrect");
            cardFeedback.classList.remove("show");
        }


        if (target.current.classList.contains('active')) {
            const placedCard = screen.element.querySelector('.card-placeholder-content .card.placed');
            if (placedCard) {
                placedCard.style.opacity = '0';
            }
        }


        // Animation de déplacement selon la direction
        if (!cardSwipe.isElementVisible(target.elements.leftArea)) {
            if (data.swipeDirection === left) {
                if (!target.current.classList.contains("move-to-left")) {
                    target.current.classList.remove("move-to-right");
                    target.current.classList.add("move-to-left");
                }
            } else if (data.swipeDirection === right) {
                if (!target.current.classList.contains("move-to-right")) {
                    target.current.classList.remove("move-to-left");
                    target.current.classList.add("move-to-right");
                }
            } else {
                target.current.classList.remove("move-to-left", "move-to-right");
            }
        }

        swipeTutorial.classList.remove("show");
    });

    // Réinitialisation de la position lors du relâchement
    cardSwipe.on(components.CardSwipe.UP, (event) => {
        const target = event.target;
        target.current.classList.remove("move-to-left", "move-to-right");


        feedback.style.visibility = "hidden";


        const showElement = feedback.querySelector('.show');
        if (showElement) {
            const nextSpan = showElement.nextElementSibling;
            if (nextSpan) {
                showElement.classList.remove('show');
                nextSpan.classList.add('show');
            } else {
                showElement.classList.remove('show');
            }
        } else {
            feedback.querySelector('span:first-child')?.classList.add('show');
        }

    });

    // Nettoyage lors de la destruction du composant
    cardSwipe.on(components.CardSwipe.DESTROY, (event) => {
        const target = event.target;
        target.elements.cards.forEach((card) => {
            const cardFeedback = card.querySelector(".card-feedback");
            card.classList.remove("move-to-left", "move-to-right");
            cardFeedback.classList.remove("correct", "incorrect", "show");
        });

        cardContainerFeedback.classList.remove("correct", "incorrect", "show");
    });

    // Activation du bouton suivant une fois terminé
    cardSwipe.on(components.CardSwipe.DONE, () => {
        screen.enableNext();
    });

    // Nettoyage à la fermeture de l'écran
    screen.addDisposer(() => {
        feedback.style.visibility = "hidden";
        cardSwipe.destroy();
    });

    // Affichage du tutoriel de swipe
    swipeTutorial.classList.add("show");

    init();
}

export default screen3;