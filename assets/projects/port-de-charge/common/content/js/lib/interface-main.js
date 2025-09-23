(function () {
    function execOnLoad() {
        var wrapper = document.querySelector('#mainWrapper');
        var scaleLoader = document.querySelector('#scaleLoader');

        new InterfaceResizer(wrapper);

        if (scaleLoader != null) {
            scaleLoader.classList.add('hide');
        }
    }

    if (document.readyState === 'complete') {
        execOnLoad();
    } else {
        window.addEventListener('load', function () {
            execOnLoad();
        });
    }
})();
