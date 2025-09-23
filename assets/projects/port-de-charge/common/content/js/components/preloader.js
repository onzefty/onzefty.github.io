;( function( root, cjs /* createjs de PreloadJS */ ) {
    'use strict';

    /**
     * Preloader (dependance à PreloadJS)
     */
    function Preloader( options ) {
        var defautOptions = {
            // preferXHR: true,
            preferXHR: root.location.href.toLowerCase().indexOf('file://') == -1,
            basePath: '',
            crossOrigin: true
        };
        this.options =  Object.assign( {}, defautOptions, options );

        // PreloadJS Queue
        this.preload = new cjs.LoadQueue( this.options.preferXHR, this.options.basePath, this.options.crossOrigin );
        this.preload.installPlugin( cjs.Sound );

        // définir le nombre max de connexions simultanées
        // this.preload.setMaxConnections(5);

        this.manifest = null;
        this.progress = null;

        this.addListeners();
    };

    Preloader.prototype.addListeners = function() {
        Preloader.EVENTS.forEach( function( eventName ) {
            this.preload.on( eventName, function( e ) {
                // if ( [ 'fileload', 'error' ].indexOf( eventName ) > -1 ) {
                if ( [ 'fileload' ].indexOf( eventName ) > -1 ) {
                    this.progress.increment();
                }
                this.emit( eventName,  { event: e, progress: this.progress.get() } );
            }.bind(this));
        }.bind( this ) );
        return this;
    };

    Preloader.prototype.removeListeners = function() {
        Preloader.EVENTS.forEach( function( eventName ) {
            this.preload.off( eventName );
        }.bind( this ) );
        return this;
    };

    Preloader.prototype.load = function( manifest ) {
        this.stop();
        this.manifest = manifest;
        this.progress = new Progress( manifest.length );
        this.preload.loadManifest( this.manifest );
        return this;
    };

    Preloader.prototype.stop = function() {
        if ( this.preload != null ) {
            this.preload.close();
        }
        return this;
    };

    Preloader.prototype.getResult = function( src, raw ) {
        return this.preload.getResult( src, raw );
    };

    //Utility.mix( Preloader, EmitterMixin );
    mix( Preloader, EmitterMixin );


    Preloader.EVENTS = [
        'fileload',
        'fileprogress',
        'error',
        'progress',
        'complete'
    ];

    if ( !root.Preloader ) {
        root.Preloader = Preloader;
    }



    function Progress( length ) {
        this.loaded = 0;
        this.total = length;
    };
    Progress.prototype.increment = function(){
        this.loaded++;
        return this;
    };
    Progress.prototype.get = function(){
        return Math.round( ( this.loaded / this.total ) * 100 );
    };

})( typeof window === 'undefined' ? this : window, createjs );
