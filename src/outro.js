
  // ----------------------
  // Utility Methods
  // ----------------------
  
  Keen.domReady = (typeof $ == 'function') ? $ : function(cb){ cb(); };
  
  Keen.ready = function(callback){
    Keen.on('ready', Keen.domReady(function(){
      callback();
    }));
  };
  
  Keen.trigger('ready');
  
  Keen.log = function(message) {
    console.log('[Keen IO]', message)
  };
  
  return Keen;
});