import EmitterMixin from "../../lib/emitter-mixin.js";
import Composition from "./composition.js";

export default class ShelfManager extends EmitterMixin {
    static get SHELF_ISCLICKED(){
        return 'ShelfManager.shelfIsClicked';
    }
    static get SHELF_MOVE(){
        return 'ShelfManager.shelfMove';
    }
    static get SHELF_DROPPED(){
        return 'ShelfManager.shelfDropped';
    }
    constructor(props = {}){
        super()
        this.options = {
            elements:[],
            view:null,
            ...props
        }
        this.element = this.options.elements[0].parentNode;
        this.shelves = new Map();
        this.composition = null;

        this.init();
    }

    get enabled(){
        return this.element.style["pointer-events"] != "none";
    }

    set enabled(boolean){
        if(typeof boolean === "boolean"){
            if(boolean === true){
                this.element.style["pointer-events"] = "";
            } else {
                this.element.style["pointer-events"] = "none";
            }
        }
    }

    init(){
        for(let a=1; a<=this.options.elements.length; a++){
            const element = this.options.elements[a-1];
            const composition = new Composition({element});
            composition.on(composition.events.DOWN,()=>{
                this.composition = composition;
            });
            composition.on(composition.events.NOMOVE,()=>{
                this.composition = composition;
                this.emit(ShelfManager.SHELF_ISCLICKED);
            });
            composition.on(composition.events.MOVE,()=>{
                this.emit(ShelfManager.SHELF_MOVE);
            });
            composition.on(composition.events.DROPPED,()=>{
                this.emit(ShelfManager.SHELF_DROPPED);
            });
            this.shelves.set(element.id,composition);
        }
    }

    clear(){
        for(const [key,composition] of this.shelves){
            composition.clear();
        }
    }
}