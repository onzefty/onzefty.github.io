import Clickables from "../../../common/content/js/components/clickables.js";
import Checkboxes from "../../../common/content/js/components/checkboxes.js";
import DragDrop from "../../../common/content/js/components/drag-drop.js";
import VideoWrapper from "../../../common/content/js/videoplayer/video-wrapper.js";
import CardSwipe from "../../../common/content/js/swipe/card-swipe.js";
import Slider from "../../../common/content/js/components/slider.js";
import DisplayableManager from "../../../common/content/js/components/displayable-manager.js";

export default function register() {
    return {
        Clickables, Checkboxes, DragDrop, VideoWrapper, CardSwipe, Slider, DisplayableManager
    };
}
