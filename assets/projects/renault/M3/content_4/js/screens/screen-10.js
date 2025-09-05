function screen10(app, data, components) {
    const { screen, init } = data;
    const screenElement = screen.element;

    const sliderWrapper = screenElement.querySelector('.slider-wrapper');
    const progress = screenElement.querySelector('.slider-dots');
    const slider = screenElement.querySelector('.slider');
    const categoriesWrapper = screenElement.querySelector('.blocs');
    const categories = categoriesWrapper.querySelectorAll('.bloc');

    let current = 1;
    const total = categories.length;

    const sliderM = new components.Slider({
        progress,
        list:[
            {element: slider}
        ]
    });

    sliderM.on(sliderM.events.PREVIOUS, () => {
        progress.classList.add("reverse");
    });
    sliderM.on(sliderM.events.NEXT, () => {
        progress.classList.remove("reverse");
    });

    function validate(event){
        const {currentTarget} = event;
        const value = currentTarget.getAttribute("data-value");
        const slide = sliderM.slides[0];
        const {element} = slide;
        const textElement = element.querySelector("p");
        const textElementClass = textElement.className;
        categoriesWrapper.style["pointer-events"] = "none";
        if(textElementClass === value){
            sliderWrapper.classList.add("right");
            currentTarget.classList.add("corrected");
            sliderWrapper.onanimationend = () => {
                categoriesWrapper.style["pointer-events"] = "";
                sliderWrapper.classList.remove("right");
                if(current < total){
                    categories[current-1].classList.remove("current");
                    current++;
                    categories[current-1].classList.add("current");
                    sliderM.exclude(sliderM.current);
                } else {
                    screen.enableNext();
                }
            }
        } else {
            sliderWrapper.classList.add("wrong");
            sliderWrapper.onanimationend = () => {
                categoriesWrapper.style["pointer-events"] = "";
                sliderWrapper.classList.remove("wrong");
            }
        }
    }

    screen.addDisposer(() => {
        sliderM.dispose();
        for(let i=0; i<categories.length; i++){
            categories[i].classList.remove("corrected");
            categories[i].removeEventListener(screen.utils.EVENTS.CLICK_TOUCH,validate);
        }
        categoriesWrapper.style["pointer-events"] = "";
    });

    sliderWrapper.classList.remove("wrong");
    sliderWrapper.classList.remove("right");
    for(let i=0; i<categories.length; i++){
        categories[i].classList.remove("corrected");
        categories[i].addEventListener(screen.utils.EVENTS.CLICK_TOUCH,validate);
    }

    init();

}

export default screen10;