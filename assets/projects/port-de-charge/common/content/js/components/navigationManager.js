// Properties
// onCustomNext - fonction customisée appelée à chaque "suivant"
// onCustomPrev - fonction customisée appelée à chaque "précédent"
// onCustomLoad - fonction customisée appelée à chaque load d'un écran en particulier
// onCustomAfterMax - fonction customisée appelée si current > total (charger écran de fin après complétion d'une formation/évaluation)
// onCustomOn - fonction customisée appelée à chaque activation
// onCustomOff - fonction customisée appelée à chaque désactivation
// onCustomSave - fonction customisée appelée à chaque sauvegarde de la navigation
// Methods
// set (c,m,t) - set les trois valeurs principales (ecran en cours, écran max vu et nombre d'écrans total)
// --> c : current
// --> m : maxReached
// --> t : total
// load (i,force,forcePlaying) - charge suivant | précédent | écran spécifique
// --> i : incrémentation à ajouter/enlever
// --> force : si true, surpasse les verrouillages de sécurité
// --> forcePlaying : (pour Edge Animate) permet d'effectuer un play() au lieu de stop()
// isOn (param) - active la navigation
// --> param : ("suivant"|"next") activation de suivant | ("precedent"|"prev") activation de précédent | activation de suivant et précédent
// isOff (param) - désactive la navigation
// --> param : ("suivant"|"next") désactivation de suivant | ("precedent"|"prev") désactivation de précédent | désactivation de suivant et précédent

function NavigationManager(props){
	this.current = props.current != undefined ? props.current : 1;
	this.total = props.total != undefined ? props.total : 10;
	this.maxReached = props.maxReached != undefined ? props.maxReached : 1;
	this.nextLock = false;
	this.prevLock = false;
	this.activeIfCompleted = props.activeIfCompleted != undefined ? props.activeIfCompleted : true;
	this.onCustomNext = props.onCustomNext != undefined && typeof props.onCustomNext == "function" ? props.onCustomNext : function(){};
	this.onCustomPrev = props.onCustomPrev != undefined && typeof props.onCustomPrev == "function" ? props.onCustomPrev : function(){};
	this.onCustomLoad = props.onCustomLoad != undefined && typeof props.onCustomLoad == "function" ? props.onCustomLoad : function(){};
	this.onCustomAfterMax = props.onCustomAfterMax != undefined && typeof props.onCustomAfterMax == "function" ? props.onCustomAfterMax : null;
	this.onCustomBeforeMin = props.onCustomBeforeMin != undefined && typeof props.onCustomBeforeMin == "function" ? props.onCustomBeforeMin : null;
	this.onCustomOn = props.onCustomOn != undefined && typeof props.onCustomOn == "function" ? props.onCustomOn : function(){};
	this.onCustomOff = props.onCustomOff != undefined && typeof props.onCustomOff == "function" ? props.onCustomOff : function(){};
	this.onCustomSave = props.onCustomSave != undefined && typeof props.onCustomSave == "function" ? props.onCustomSave : function(){};
}

NavigationManager.prototype = {
	set: function(c,m,t){
		this.current = c!=undefined ? parseInt(c) : this.current;
		this.maxReached = m!=undefined ? parseInt(m) : this.maxReached;
		this.total = t!=undefined ? parseInt(t) : this.total;
	},
	next: function(force){
		this.load(1,force);
	},
	prev: function(force,forcePlaying){
		this.load(-1,force,forcePlaying);
	},
	load: function(i,force,forcePlaying){
		force = force ? force : false;
	    var c = ( getType(i) == "String" && i.match(/(e(cran)?)?[_-]?[0-9]+/g) ) ?
		    clamp( parseInt(i.match(/[0-9]+/g)[0], 10), 1, this.total) :
		    clamp( this.current+i, 1, this.total);
		if(this.onCustomAfterMax!=null && (this.current==this.total && c==this.total)){
			this.onCustomAfterMax();
		}
		else if(this.onCustomBeforeMin!=null && (this.current==1 && c==1)){
			this.onCustomBeforeMin();
		} 
	    else if( !( this.nextLock && this.prevLock ) || Math.abs(c - this.current) > 1 || force ) {
        	if( c == this.current+1 && ( !this.nextLock || force ) && typeof i != "string" ) {
        		this.current = c;
        		this.maxReached = Math.max(this.current,this.maxReached);
        		this.isOff();
        		this.onCustomNext(this.current);
        	}
        	else if( c == this.current-1 && ( !this.prevLock || force ) && typeof i != "string") {
        		this.current = c;
        		this.maxReached = Math.max(this.current,this.maxReached);
	            this.isOff();
	        	this.onCustomPrev(this.current,forcePlaying);   
	        }
	        else if( typeof i == "string" || force ) {
	        	this.current = c;
	        	this.maxReached = Math.max(this.current,this.maxReached);
	            this.isOff();
	        	this.onCustomLoad(this.current,forcePlaying);
	        }
        }
        this.onCustomSave();
	},
	isOn: function(param,already,same){
		var check = already ? (this.maxReached>this.current||same&&this.maxReached>=this.current) ? true : false : true;
		if(param=="next" || param=="suivant"){
			if(check){
				this.nextLock = false;	
			} else {
				this.nextLock = true;
			}
			this.onCustomOn(param,already,check);
		}
		else if(param=="prev" || param=="precedent"){
			this.prevLock = false;
			this.onCustomOn(param,already,check);
		}
		else {
			if(check){
				this.nextLock = false;	
			} else {
				this.nextLock = true;
			}
			this.prevLock = false;
			this.onCustomOn("",check);
		}
	},
	isOff: function(param){
		if(param=="next" || param=="suivant"){
			this.nextLock = true;
			this.onCustomOff(param);
		}
		else if(param=="prev" || param=="precedent"){
			this.prevLock = true;
			this.onCustomOff(param);
		}
		else {
			this.nextLock = true;
			this.prevLock = true;
			this.onCustomOff();
		}
	}
}

// -> Renvoie le type d'une variable
function getType(elem) {
    return Object.prototype.toString.call(elem).slice(8, -1);
}
// -> Renvoie la valeur choisie entre un min et un max (inclus)
function clamp(value,min,max) {
    return Math.min(Math.max(value, min), max);
}