// instanciation du player video
function initVideoPlayer(container,src,playerOptions) {
    var defaultPlayerOptions = {
      src: src,
      container: container,
      currentTime: 0,
      allowSeekingForward: false,
      //defaultQuality: quality,
      defaultQuality: "high",
      vttSource: null, // source WebVTT (.vtt, .srt, .webvtt)
      multiformat: false, // true si la video disponible en MP4 et WEBM
      has480p: false, // true si la/les video(s) est/sont disponible(s) en version 480p (filename_480p.ext)
      noRightClick: true,
      /*mediaElementOptions: {
        features: VideoPlayer.MEDIAELEMENT_DEFAULT_FEATURES.replace('fullscreen', '').split(' ')
      },*/
      handlers: {
        onLoadedMetaData: function(data) {},
        onPlaying: function(time) {},
        onPause: function() {},
        onEnded: function() {},
        onError: function(error) {}
      }
    };
    playerOptions = playerOptions ? cUts.o.assign(defaultPlayerOptions, playerOptions ) : defaultPlayerOptions;
    window.player = new VideoPlayer( playerOptions );
    /*
    var quality = 'low';
    // test de la bande passante en download pour déterminer quelle source sera sélectionnée par défaut
    new Bandwidth({
      testFileUrl: '../../common/content/videoplayer/1mo.jpg'
    })
    .download()
    .then(function(results){
      if (results.Mo >= 1) {
        quality = 'high';
      }
      window.player = new VideoPlayer( playerOptions );
    })
    .catch(function(err){
      //console.log('main.js: err', err);
      window.player = new VideoPlayer( playerOptions );
    });
    */
}
