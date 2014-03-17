  /*! 
  * ---------------------
  * Keen IO Visualize JS
  * ---------------------
  */
  
  
  // -------------------------------
  // Inject <query>.draw Method
  // -------------------------------
  
  Keen.Query.prototype.draw = function(selector, config) {
    if ( _isUndefined(this.visual) || 
         ((config.library && config.library !== this.visual.config.library) || 
         (config.type && config.type !== this.visual.config.type)) ) {
      this.visual = new Keen.Visualization(this, selector, config);
    }
    return this;
  };
  
  
  // -------------------------------
  // Keen.Visualization
  // -------------------------------
  
  Keen.Visualization = function(query, selector, config){
    var defaults = { 
      library: 'google'
    };
    var options = (config) ? _extend(defaults, config) : defaults;
    //console.log(query.analyses);
    
    for (var i = 0; i < query.analyses.length; i++) {
      if (query.analyses[i].params.interval) { // Series
        options.capable = ['area', 'bar', 'column', 'line', 'table'];
        if (_isUndefined(options.type)) {
          options.type = 'line';
        }
      } else {
        if (query.analyses[i].params.group_by) { // Static
          options.capable = ['pie', 'table'];
          if (_isUndefined(options.type)) {
            options.type = 'pie';
          }
        } else { // Metric
          options.capable = ['text'];
          if (_isUndefined(options.type)) {
            options.type = 'text';
          }
        }
      }
    }
    
    // if (options.type && this.capable.indexOf(options.type)) -> request is going to work
    
    if (Keen.Visualization.Libraries[options.library]) {
      
      if (Keen.Visualization.Libraries[options.library][options.type]) {
        
        return new Keen.Visualization.Libraries[options.library][options.type](query, selector, options);
        
      } else {
        Keen.log('The visualization type you requested is not available for this library');
      }
    } else {
      Keen.log('The visualization library you requested is not present');
    }
    
    return this;
  };
    
  Keen.Visualization.Libraries = {};
  
  Keen.Visualization.register = function(name, methods) {
    Keen.Visualization.Libraries[name] = Keen.Visualization.Libraries[name] = {};
    for (var method in methods) {
      Keen.Visualization.Libraries[name][method] = methods[method];
    }
  };
  
  Keen.Visualization.extend = function(protoProps, staticProps){
    var parent = Keen.Adapter, Visualization;
    
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      Visualization = protoProps.constructor;
    } else {
      Visualization = function(){ return parent.apply(this, arguments); };
    }
    
    _extend(Visualization, parent, staticProps);
    
    var Surrogate = function(){ this.constructor = Visualization; };
    Surrogate.prototype = parent.prototype;
    Visualization.prototype = new Surrogate;
    
    if (protoProps) _extend(Visualization.prototype, protoProps);
    
    Visualization.__super__ = parent.prototype;
    
    return Visualization;
  };
  
  
  // -------------------------------
  // Keen.Adapter
  // -------------------------------

  Keen.Adapter = function(){
    this.configure.apply(this, arguments);
  };
  _extend(Keen.Adapter.prototype, Events);
  
  Keen.Adapter.prototype.configure = function(query, selector, config) {

    var defaults = {
      height: 400,
      width: 400
    };
    this.config = (config) ? _extend(defaults, config) : defaults;
    
    this.query = query;
    this.selector = selector;
    
    var _this = this;
    Keen.ready(function(){
      _this.initialize.apply(_this, arguments);
      
      _this.query.on("complete", function(){
        _this.trigger("update");
      });
      
      _this.query.on("remove", function(){
        _this.trigger("remove");
      });
      
    });
    
    return _this;
  };
  
  Keen.Adapter.prototype.initialize = function(query, selector, config) {
    console.log('chart:initialize', arguments);
  };
  
  Keen.Adapter.prototype.error = function(query, selector, config) {
    Keen.log('Error: The chart type you have selected does not support your query');
    Keen.log('Please try chart type(s): ' + this.config.capable.join(','));
  };
  
  Keen.Adapter.prototype.render = function() {
    console.log('chart:render');
  };
  
  Keen.Adapter.prototype.update = function() {
    console.log('chart:update');
  };
  
  Keen.Adapter.prototype.remove = function() {
    console.log('chart:remove');
  };
  
