(function (win) {
    var STATICS = {
        PORTRAIT: {
            get: function () {
                return 'portrait';
            },
        },
        LANDSCAPE: {
            get: function () {
                return 'landscape';
            },
        },
        UNINDENTIFIED: {
            get: function () {
                return 'unknown';
            },
        },
    };

    setStatic(STATICS, Device);

    function Device() {
        this.os = getOS();
        this.mobile = mobileCheck();
        this.tablet = tabletCheck();

        Object.defineProperty(this, 'orientation', {
            get: function () {
                if (isPortrait()) {
                    return Device.PORTRAIT;
                }
                if (isLandscape()) {
                    return Device.LANDSCAPE;
                }
                return Device.UNINDENTIFIED;
            },
        });
    }

    function mobileCheck() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }

    function tabletCheck() {
        var innerHeight = window.innerHeight;
        var innerWidth = window.innerWidth;

        var checkDeviceSize = innerWidth >= 480 && innerHeight >= 800;
        var checkDeviceSizeRev = innerWidth >= 800 && innerHeight >= 480;

        return mobileCheck() && (checkDeviceSize || checkDeviceSizeRev);
    }

    function isPortrait() {
        var os = getOS();

        var hasOrientationChange = Object.prototype.hasOwnProperty.call(
            window,
            'onorientationchange'
        );
        var hasOrientation = Object.prototype.hasOwnProperty.call(window, 'orientation');

        if (screen.orientation && hasOrientationChange) {
            return screen.orientation.type.indexOf('portrait') > -1;
        } else if (os === 'iOS' || (os === 'Android' && hasOrientation)) {
            return Math.abs(window.orientation) !== 90;
        }

        return window.innerHeight / window.innerWidth > 1;
    }

    function isLandscape() {
        var os = getOS();
        var hasOrientationChange = Object.prototype.hasOwnProperty.call(
            window,
            'onorientationchange'
        );
        var hasOrientation = Object.prototype.hasOwnProperty.call(window, 'orientation');

        if (screen.orientation && hasOrientationChange) {
            return screen.orientation.type.indexOf('landscape') > -1;
        } else if (os === 'iOS' || (os === 'Android' && hasOrientation)) {
            return Math.abs(window.orientation) === 90;
        }

        return window.innerHeight / window.innerWidth < 1;
    }

    function getOS() {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            os = 'unknown';

        if (platform.indexOf('Mac') > -1) {
            os = 'Mac OS';
        } else if (/ip(?:[ao]d|hone)/i.test(platform)) {
            os = 'iOS';
        } else if (platform.indexOf('Win') > -1) {
            os = 'Windows';
        } else if (userAgent.indexOf('Android') > -1) {
            os = 'Android';
        } else if (/linux/i.test(platform)) {
            os = 'Linux';
        } else if (/unix/i.test(platform)) {
            os = 'UNIX';
        }

        return os;
    }

    win.Device = Device;
})(window);
