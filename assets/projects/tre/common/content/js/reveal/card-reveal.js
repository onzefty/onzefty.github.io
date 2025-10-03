import EmitterMixin from "../emitter/emitter-mixin.js";
import { EVENTS, getElementsFrom, getElementFrom, getMousePosition } from "../utils/utils.js";

export default class CardReveal extends EmitterMixin {
    #boundHandleClick;
    #boundHandlePointerDown;
    #boundHandlePointerUp;
    #boundHandleResize;
    #boundHandleTick;
    #boundHandleNextClick;
    #boundHandlePreviousClick;

    static REVEAL = "CardReveal.reveal";
    static UNREVEAL = "CardReveal.unreveal";
    static UPDATE = "CardReveal.update";
    static PREVIOUS = "CardReveal.next";
    static NEXT = "CardReveal.next";
    static DONE = "CardReveal.done";
    static DESTROY = "CardReveal.destroy";

    constructor(container, options = {}) {
        super();

        this.container = container;
        this.config = {
            cardWrapperSelector: ".card-reveal-wrapper",
            cardSelector: ".card-reveal",
            nextButtonSelector: ".card-reveal-next",
            previousButtonSelector: ".card-reveal-previous",
            bulletsWrapperSelector: ".card-reveal-bullets",
            bulletSelector: ".card-reveal-bullet",
            clickCardReveal: true,
            clickToUnreveal: false,
            autoReveal: false,
            allowNotCurrentReveal: false,
            allowSwipe: true,
            swipeThreshold: 70,
            autoSize: true,
            autoInit: true,
            ...options,
            cardPlacement: {
                deep: 240,
                x: 70,
                ...options?.cardPlacement,
            },
        };

        this.elements = {};
        this.currentIndex = -1;
        this.current = null;
        this.datas = {};

        if (this.config.autoInit) {
            this.init();
        }
    }

    addListeners() {
        this.#boundHandleClick = this.handleClick.bind(this);
        this.#boundHandleResize = this.handleResize.bind(this);
        this.#boundHandleTick = this.tick.bind(this);
        this.#boundHandleNextClick = this.nextCard.bind(this);
        this.#boundHandlePreviousClick = this.previousCard.bind(this);
        this.#boundHandlePointerDown = this.handlePointerDown.bind(this);
        this.#boundHandlePointerUp = this.handlePointerUp.bind(this);

        if (this.config.allowSwipe) {
            this.elements.cardWrapper.addEventListener(EVENTS.DOWN_TOUCHSTART, this.#boundHandlePointerDown);
        }

        if (this.config.clickCardReveal) {
            this.elements.cards.forEach((card) => {
                card.addEventListener(EVENTS.CLICK_TOUCH, this.#boundHandleClick);
            });
        }

        if (this.config.autoSize) {
            this.tick();

            window.addEventListener(EVENTS.RESIZE, this.#boundHandleResize);
        }

        if (this.elements.nextButton) {
            this.elements.nextButton.addEventListener(EVENTS.CLICK_TOUCH, this.#boundHandleNextClick);
        }

        if (this.elements.previousButton) {
            this.elements.previousButton.addEventListener(EVENTS.CLICK_TOUCH, this.#boundHandlePreviousClick);
        }
    }

    removeListeners() {
        if (this.config.allowSwipe) {
            this.elements.cardWrapper.removeEventListener(EVENTS.DOWN_TOUCHSTART, this.#boundHandlePointerDown);
            window.removeEventListener(EVENTS.UP_TOUCHEND, this.#boundHandlePointerUp);
        }

        if (this.config.clickCardReveal) {
            this.elements.cards.forEach((card) => {
                card.removeEventListener(EVENTS.CLICK_TOUCH, this.#boundHandleClick);
            });
        }

        if (this.config.autoSize) {
            window.removeEventListener(EVENTS.RESIZE, this.#boundHandleResize);
            cancelAnimationFrame(this.datas.rafId);
        }

        if (this.elements.nextButton) {
            this.elements.nextButton.removeEventListener(EVENTS.CLICK_TOUCH, this.#boundHandleNextClick);
        }

        if (this.elements.previousButton) {
            this.elements.previousButton.removeEventListener(EVENTS.CLICK_TOUCH, this.#boundHandlePreviousClick);
        }
    }

    init() {
        const cardWrapper = getElementFrom(this.config.cardWrapperSelector, this.container);
        const cards = getElementsFrom(this.config.cardSelector, this.container);
        const bullets = getElementsFrom(this.config.bulletSelector, this.container);
        const nextButton = getElementFrom(this.config.nextButtonSelector, this.container);
        const previousButton = getElementFrom(this.config.previousButtonSelector, this.container);
        const bulletsWrapper = getElementFrom(this.config.bulletsWrapperSelector, this.container);

        this.elements.cardWrapper = cardWrapper;
        this.elements.cards = cards;
        this.elements.bullets = bullets;
        this.elements.nextButton = nextButton;
        this.elements.previousButton = previousButton;
        this.elements.bulletsWrapper = bulletsWrapper;

        this.datas.revealed = [];

        this.elements.cards.forEach((card, index) => {
            card.dataset.index = index;
            this.datas.revealed[index] = false;
        });

        this.resizeCards();
        this.addListeners();
        this.nextCard();
    }

    getModIndex(index) {
        const cardLength = this.elements.cards.length;

        return ((index % cardLength) + cardLength) % cardLength;
    }

    updateCards() {
        const previousIndex = this.getModIndex(this.currentIndex - 1);
        const nextIndex = this.getModIndex(this.currentIndex + 1);
        const deep = this.config.cardPlacement.deep;
        const xValue = this.config.cardPlacement.x;

        const getTranslate = (value) => {
            if (typeof value === "string") {
                return value;
            } else if (typeof value === "number") {
                return `${value}%`;
            }
        };

        const getDeep = (value) => {
            if (typeof value === "string") {
                return value;
            } else if (typeof value === "number") {
                return `${value}px`;
            }
        };

        this.elements.cards.forEach((card, index) => {
            const isCurrent = index === this.currentIndex;
            const isPrevious = index === previousIndex;
            const isNext = index === nextIndex;

            if (isCurrent) {
                card.classList.add("active");
                card.style.translate = "0 0 0";
            } else {
                card.classList.remove("active");
            }

            if (isPrevious) {
                card.style.translate = `calc(-1 * ${getTranslate(xValue)}) 0 calc(-1 * ${getDeep(deep)})`;
            }

            if (isNext) {
                card.style.translate = `${getTranslate(xValue)} 0 calc(-1 * ${getDeep(deep)})`;
            }

            if (!isCurrent && !isPrevious && !isNext) {
                card.style.translate = `0 0 calc(-1 * ${getDeep(deep)})`;
                card.classList.add("invisible");
            } else {
                card.classList.remove("invisible");
            }
        });

        this.emit(CardReveal.UPDATE, {
            index: this.currentIndex,
            previousIndex: previousIndex,
            nextIndex: nextIndex,
        });
    }

    updateActiveBullet() {
        this.elements.bullets.forEach((bullet, index) => {
            if (this.datas.revealed[index] && !bullet.classList.contains("done")) {
                bullet.classList.add("done");
            }

            if (index !== this.currentIndex) {
                bullet.classList.remove("active");
            } else {
                bullet.classList.add("active");
            }
        });
    }

    nextCard() {
        const baseIndex = this.currentIndex;

        this.currentIndex = this.getModIndex(this.currentIndex + 1);

        const card = this.elements.cards[this.currentIndex];

        this.elements.cardWrapper.classList.add("next");
        this.elements.cardWrapper.classList.remove("previous");

        if (!this.config.clickCardReveal) {
            const cardIndex = Number(card.dataset.index);
            this.shadowReveal(card, cardIndex);
        }

        if (this.config.autoReveal) {
            this.revealCard(card);
        }

        if (this.elements.bulletsWrapper) {
            if (baseIndex !== this.elements.cards.length - 1) {
                this.elements.bulletsWrapper.classList.remove("first");
                this.elements.bulletsWrapper.classList.remove("last");
                this.elements.bulletsWrapper.classList.remove("previous");
                this.elements.bulletsWrapper.classList.add("next");
            } else {
                this.elements.bulletsWrapper.classList.remove("first");
                this.elements.bulletsWrapper.classList.remove("next");
                this.elements.bulletsWrapper.classList.remove("previous");
                this.elements.bulletsWrapper.classList.add("last");
            }
        }

        this.updateActiveBullet();
        this.updateCards();

        this.emit(CardReveal.NEXT, {
            index: this.currentIndex,
        });
    }

    previousCard() {
        const baseIndex = this.currentIndex;

        this.currentIndex = this.getModIndex(this.currentIndex - 1);

        const card = this.elements.cards[this.currentIndex];

        this.elements.cardWrapper.classList.remove("next");
        this.elements.cardWrapper.classList.add("previous");

        if (!this.config.clickCardReveal) {
            const cardIndex = Number(card.dataset.index);
            this.shadowReveal(card, cardIndex);
        }

        if (this.config.autoReveal) {
            this.revealCard(this.elements.cards[this.currentIndex]);
        }

        if (this.elements.bulletsWrapper) {
            if (baseIndex !== 0) {
                this.elements.bulletsWrapper.classList.remove("first");
                this.elements.bulletsWrapper.classList.remove("last");
                this.elements.bulletsWrapper.classList.remove("next");
                this.elements.bulletsWrapper.classList.add("previous");
            } else {
                this.elements.bulletsWrapper.classList.remove("next");
                this.elements.bulletsWrapper.classList.remove("last");
                this.elements.bulletsWrapper.classList.remove("previous");
                this.elements.bulletsWrapper.classList.add("first");
            }
        }

        this.updateActiveBullet();
        this.updateCards();

        this.emit(CardReveal.PREVIOUS, {
            index: this.currentIndex,
        });
    }

    resizeCards() {
        if (!this.config.autoSize) return;

        let maxHeight = 0;

        this.elements.cards.forEach((card) => {
            maxHeight = Math.max(maxHeight, card.scrollHeight);
        });

        this.elements.cardWrapper.style.height = `${maxHeight}px`;
    }

    shadowReveal(card, cardIndex) {
        if (isNaN(cardIndex)) return;

        if (!this.datas.revealed[cardIndex]) {
            card.classList.add("done");

            this.datas.revealed[cardIndex] = true;
            this.updateActiveBullet();
        }

        const allRevealed = this.datas.revealed.every((revealed) => revealed);

        if (allRevealed) {
            this.emit(CardReveal.DONE);
        }
    }

    revealCard(card) {
        const cardIndex = Number(card.dataset.index);

        if (isNaN(cardIndex)) return;

        if (this.currentIndex !== cardIndex && !this.config.allowNotCurrentReveal) {
            return;
        }

        const isRevealed = card.classList.contains("revealed");

        if (isRevealed && this.config.clickToUnreveal && this.datas.clicked) {
            card.classList.remove("revealed");

            this.emit(CardReveal.UNREVEAL, {
                index: this.currentIndex,
            });
        }

        if (!isRevealed) {
            card.classList.add("revealed");

            this.emit(CardReveal.REVEAL, {
                index: this.currentIndex,
            });
        }

        this.shadowReveal(card, cardIndex);
    }

    handlePointerDown = (event) => {
        const pointerPos = getMousePosition(event);

        this.datas.startX = pointerPos.clientX;
        this.datas.startY = pointerPos.clientY;

        window.addEventListener(EVENTS.UP_TOUCHEND, this.#boundHandlePointerUp);
    };

    handlePointerUp = (event) => {
        const pointerPos = getMousePosition(event);

        const dx = pointerPos.clientX - this.datas.startX;
        const dy = pointerPos.clientY - this.datas.startY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.config.swipeThreshold) {
            if (dx < 0) {
                this.nextCard();
            } else {
                this.previousCard();
            }
        }

        this.resetPointer(event);

        window.removeEventListener(EVENTS.UP_TOUCHEND, this.#boundHandlePointerUp);
    };

    resetPointer(event) {
        this.startX = 0;
        this.startY = 0;
    }

    handleResize = () => {
        if (!this.config.autoSize) return;

        this.elements.cardWrapper.style.height = "";

        this.datas.resized = true;
    };

    tick() {
        if (this.datas.resized) {
            this.resizeCards();
            this.datas.resized = false;
        }

        this.datas.rafId = requestAnimationFrame(this.#boundHandleTick);
    }

    handleClick = (event) => {
        const target = event.currentTarget || event.target;

        this.datas.clicked = true;

        this.revealCard(target);

        this.datas.clicked = false;
    };

    destroy() {
        this.emit(CardReveal.DESTROY);

        this.removeListeners();
        this.off();

        this.elements.cardWrapper.classList.remove("next");
        this.elements.cardWrapper.classList.remove("previous");

        if (this.config.autoSize) {
            this.elements.cardWrapper.style.height = "";
        }

        if (this.elements.bulletsWrapper) {
            this.elements.bulletsWrapper.classList.remove("next");
            this.elements.bulletsWrapper.classList.remove("last");
            this.elements.bulletsWrapper.classList.remove("previous");
            this.elements.bulletsWrapper.classList.remove("first");
        }

        this.elements.cards.forEach((card) => {
            card.classList.remove("revealed");
            card.classList.remove("active");
            card.classList.remove("invisible");
            card.classList.remove("done");
            card.style.translate = "";

            delete card.dataset.index;
        });

        this.elements.bullets.forEach((bullet) => {
            bullet.classList.remove("active");
            bullet.classList.remove("done");
        });

        this.elements.cards.length = 0;
        this.elements.bullets.length = 0;

        this.elements = {};
        this.datas = {};
    }
}
