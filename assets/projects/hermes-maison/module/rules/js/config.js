import { cbNext, cbPrev, cbNone } from "./main.js";

export default {
    language:"fr",
    jsons:[
        "./json/${language}.json",
        "../../common/content/jsons/${language}.json"
    ],
    navigation:{cbNext,cbPrev,cbNone}
};