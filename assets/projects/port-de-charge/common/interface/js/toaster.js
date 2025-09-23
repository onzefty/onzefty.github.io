/**
 * Toaster basé sur le composant Toast de Materialize (dépendance à materialize)
 * Options et Properties Materialize listées en commentaires en fin de ce fichier
 * @class Toaster
 */
function Toaster() {}

Toaster.instances = [];

/**
 * toast - Affiche un toast
 * @param {String} message : le texte du message ( HTML supporté )
 * @param {Object} options : mix entre les options du composant Toast de Materialize et d'autres ajoutées
 * @return {object} Toaster instance
 */
Toaster.toast = function (message, options) {
    options = options || {};
    var id = this.utils.getUUID();
    var icon = options.icon || '';
    var html = Object.prototype.hasOwnProperty.call(options,  'icon') ? this.utils.getIcon(options.icon)  + '&nbsp;&nbsp;' + message : message;
    delete options.icon;

    var classes = id + ' ' + icon + ' ' + (options.classes || '');
    delete options.classes;

    var callback = options.completeCallback;
    var completeCallback = function () {
        (callback || function () {}).call();
        var toast = Toaster.instances.find(function (instance) { return instance.id === id; });
        if (toast) {
            Toaster.instances.splice(Toaster.instances.indexOf(toast), 1);
        }
    };
    delete options.completeCallback;

    var config = Object.assign(this.DEFAULT_OPTIONS, options, {
        html: html,
        classes: classes,
        completeCallback: completeCallback
    });
    var instance = window.M.toast(config);
    instance.id = id;
    Toaster.instances.push(instance);
    return instance;
};

/**
 * getById - Retourne un toast actuellement présent dans les instances
 * @param {String} id   The toast id
 * @return {Object}     The toast instance
 */
Toaster.getById = function (id) {
    return this.instances.find(function (toast) { return toast.id === id; });
};

/**
 * dismissAll - Masque/supprime tous les toasts
 * @return {Object} Toaster static class for chaining
 */
Toaster.dismissAll = function () {
    window.M.Toast.dismissAll();
    return this;
};


/**
 * Toaster DEFAULT_OPTIONS
 */
Toaster.DEFAULT_OPTIONS = {
    displayLength: 6000
};


/**
 * Toaster - utils
 */
Toaster.utils = {};
Toaster.utils.getUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
    );
};

/**
 * getIcon - retourne une icone au format HTML/SVG (provenant de Font Awesome)
 * @param {String} type     Le type de message associé
 * @return {String}         Le HTML/SVG de l'icone
 */
Toaster.utils.getIcon = function (type) {
    switch (type) {
    case 'info' :
        return '<i class=""><svg aria-hidden="true" data-prefix="fas" data-icon="info-circle" class="svg-inline--fa fa-info-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg></i>';

    case 'question' :
        return '<i class=""><svg aria-hidden="true" data-prefix="fas" data-icon="question-circle" class="svg-inline--fa fa-question-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg></i>';

    case 'warning' :
        return '<i class=""><svg aria-hidden="true" data-prefix="fas" data-icon="exclamation-circle" class="svg-inline--fa fa-exclamation-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg></i>';

    case 'error' :
        return '<i class=""><svg aria-hidden="true" data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg></i>';

    default :
        return '';
    }
};


/*
OPTIONS :
¯¯¯¯¯¯¯
    NAME 	          TYPE 	      DEFAULT 	   DESCRIPTION
    html 	          String 	   '' 	       The HTML content of the Toast.
    displayLength 	  Number 	   4000 	   Length in ms the Toast stays before dismissal.
    inDuration 	      Number       300 	       Transition in duration in milliseconds.
    outDuration 	  Number       375 	       Transition out duration in milliseconds.
    classes 	      String       '' 	       Classes to be added to the toast element.
    completeCallback  Function 	   null 	   Callback function called when toast is dismissed.
    activationPercent Number 	   0.8 	       The percentage of the toast's width it takes for a drag to dismiss a Toast.

PROPERTIES :
¯¯¯¯¯¯¯¯¯¯
    NAME 	       TYPE 	DESCRIPTION
    el 	           Element 	The toast element.
    options 	   Object 	The options the instance was initialized with.
    panning 	   Boolean 	Describes the current pan state of the Toast.
    timeRemaining  Number 	The remaining amount of time in ms that the toast will stay before dismissal.


Dismiss a Toast
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
    instance.dismiss();

    OR

    Get toast DOM Element, get instance, then call dismiss function
      var toastElement = document.querySelector('.toast');
      var toastInstance = M.Toast.getInstance(toastElement);
      toastInstance.dismiss();

Dismiss all Toasts
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯
    M.Toast.dismissAll();
*/
