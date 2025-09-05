import { clamp } from "../lib/utils.js";

const NAVVALUES = {
	current: 1,
	total: 10,
	maxReached: 1,
}

export default class NavigationManager {
	constructor(props = {}){
		this.options = {
			current: 1,
			total: 10,
			maxReached: 1,
            activeIfCompleted: true,
			initiliaze: false,
			cbChange: ()=>{},
			cbNext: ()=>{},
			cbPrev: ()=>{},
			cbLoad: ()=>{},
			cbAfterMax: ()=>{},
			cbBeforeMin: ()=>{},
			cbOn: ()=>{},
			cbOff: ()=>{},
			cbSave: ()=>{},
			cbNone: ()=>{},
            ...props
        }
		this.nextLock = false;
		this.prevLock = false;

		if(this.options.initiliaze){
			this.total = this.options.total;
			this.current = this.options.current;
		}	
	}

	get current(){
		return NAVVALUES.current;
	}

	set current(number){
		if(typeof number === "number"){
			const current = NAVVALUES.current;
			if(current===this.total && number===this.total){
				return this.options.cbAfterMax();
			}
			else if(current===1 && number===1){
				return this.options.cbBeforeMin();
			}
			NAVVALUES.current = clamp( 1, number, this.total);
			this.maxReached = NAVVALUES.current;
			if(number === (current+1)){
				this.isOff();
        		this.options.cbNext(NAVVALUES.current);
			}
			else if(number === (current-1)){
				this.isOff();
        		this.options.cbPrev(NAVVALUES.current);
			} 
			else if(number !== current) {
				this.isOff();
				this.options.cbLoad(NAVVALUES.current);
			} else {
				this.options.cbNone(number);
			}
			this.options.cbChange();
		}
	}

	get maxReached(){
		return NAVVALUES.maxReached;
	}

	set maxReached(number){
		if(typeof number === "number"){
			NAVVALUES.maxReached = clamp( NAVVALUES.maxReached, number, this.total);
		}
	}

	next(){
		this.current = this.current+1;
	}

	prev(){
		this.current = this.current-1;
	}

	isOn(param,already,same){
		const check = already ? (this.maxReached>this.current||same&&this.maxReached>=this.current) ? true : false : true;
		if(param==="next" || param==="suivant"){
			if(check){
				this.nextLock = false;	
			} else {
				this.nextLock = true;
			}
			this.options.cbOn(param,already,check);
		}
		else if(param==="prev" || param==="precedent"){
			this.prevLock = false;
			this.options.cbOn(param,already,check);
		}
		else {
			if(check){
				this.nextLock = false;	
			} else {
				this.nextLock = true;
			}
			this.prevLock = false;
			this.options.cbOn("",check);
		}
	}
	isOff(param){
		if(param==="next" || param==="suivant"){
			this.nextLock = true;
			this.options.cbOff(param);
		}
		else if(param==="prev" || param==="precedent"){
			this.prevLock = true;
			this.options.cbOff(param);
		}
		else {
			this.nextLock = true;
			this.prevLock = true;
			this.options.cbOff();
		}
	}
}