
  // ----------------------
  // Utility Methods
  // ----------------------

  Keen.log = function(message) {
    console.log('[Keen IO]', message)
  };

  Keen.trigger('ready');

  return Keen;
});