  /*! 
  * ---------------------
  * Keen IO Visualize JS
  * ---------------------
  */
  
  
  // -------------------------------
  // Inject <query>.draw Method
  // -------------------------------
  
  Keen.Query.prototype.draw = function(selector, config) {
    this.visual = this.visual || new Keen.Visualization(this, selector, config);
    return this;
  };
  
  
  // -------------------------------
  // Keen.Visualization
  // -------------------------------
  
  Keen.Visualization = function(query, selector, config){
    
    var defaults = { 
      library: 'nvd3', 
      type: 'line' 
    };
    
    var options = (config) ? _extend(defaults, config) : defaults;
    
    if (Keen.Visualization.Libraries[options.library]) {
      
      if (Keen.Visualization.Libraries[options.library][options.type]) {
        
        return new Keen.Visualization.Libraries[options.library]['line'](query, selector, options);
        
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
    var _this = this;
    _this.query = query;
    _this.config = config;
    _this.selector = selector;
    
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
  
  Keen.Adapter.prototype.render = function() {
    console.log('chart:render');
  };
  
  Keen.Adapter.prototype.update = function() {
    console.log('chart:update');
  };
  
  Keen.Adapter.prototype.remove = function() {
    console.log('chart:remove');
  };
  
