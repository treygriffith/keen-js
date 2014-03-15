  /*! 
  * -----------------
  * Keen IO Query JS
  * -----------------
  */
  
  
  // -------------------------------
  // Inject <client>.query Method
  // -------------------------------
  
  Keen.prototype.query = function(query, success, error) {
    var queries = [];
    if ( Object.prototype.toString.call(query) === '[object Array]' ) {
      queries = query;
    } else {
      queries.push(query);
    }
    return new Keen.Query(this, queries, success, error);
  };
  
  
  // -------------------------------
  // Keen.Query
  // -------------------------------
  
  Keen.Query = function(instance, queries, success, error){
    this.data = {};
    this.configure(instance, queries, success, error);
  };
  _extend(Keen.Query.prototype, Events);
    
  Keen.Query.prototype.configure = function(instance, analyses, success, error){
    this.instance = instance;
    this.analyses = analyses;
    this.success = success;
    this.error = error;
    
    this.refresh();
    return this;
  };
  
  Keen.Query.prototype.refresh = function(){
    
    var self = this,
        completions = 0,
        response = [];
        //meta = [];
    
    var handleSuccess = function(res, req){
      response[req.sequence] = res;      
      
      // Trigger completion event on analysis 
      self.analyses[req.sequence].trigger('complete', res);
      
      // Increment completion count
      completions++;
      
      if (completions == self.analyses.length) {
        
        // Attach response/meta data to query
        if (self.analyses.length == 1) {
          self.data = response[0];
          //self.data.meta = meta[0];
        } else {
          self.data = response;
          //self.data.meta = meta;
        }
        
        // Trigger completion event on query
        self.trigger('complete', self.data); 
        
        // Fire callback
        if (self.success) self.success(self.data);
      }
       
    };
    
    var handleFailure = function(res, req){
      var response = JSON.parse(res.responseText);
      Keen.log(res.statusText + ' (' + response.error_code + '): ' + response.message);
      if (self.error) self.error(res, req);
    };
    
    for (var i = 0; i < this.analyses.length; i++) {
      var url = null;
      if (this.analyses[i] instanceof Keen.Analysis || this.analyses[i] instanceof Keen.Funnel) {
        url = _build_url.apply(this.instance, [this.analyses[i].path]);
        url += "?api_key=" + this.instance.client.readKey;
        url += _build_query_string.apply(this.instance, [this.analyses[i].params]);
        
      } else if ( Object.prototype.toString.call(this.analyses[i]) === '[object String]' ) {
        url = _build_url.apply(this.instance, ['/saved_queries/' + encodeURIComponent(this.analyses[i]) + '/result']);
        url += "?api_key=" + this.instance.client.readKey;
        
      } else {
        var res = {
          statusText: 'Bad Request',
          responseText: { message: 'Error: Query ' + (i+1) + ' of ' + this.analyses.length + ' for project ' + this.instance.client.projectId + ' is not a valid request' }
        };
        Keen.log(res.responseText.message);
        Keen.log('Check out our JavaScript SDK Usage Guide for Data Analysis:');
        Keen.log('https://keen.io/docs/clients/javascript/usage-guide/#analyze-and-visualize');
        if (this.error) this.error(res.responseText.message);
      }
      if (url) _send_query.apply(this.instance, [url, i, handleSuccess, handleFailure]);
    }
    
    return this;
  };
  
  
  // -------------------------------
  // Keen.Analysis
  // -------------------------------
  
  Keen.Analysis = function(){
    this.data = {};
  };
  _extend(Keen.Analysis.prototype, Events);
  
  Keen.Analysis.prototype.configure = function(eventCollection, options) {
    this.path = '/queries/' + options.analysisType;
    this.params = {
      event_collection: eventCollection,
      target_property: options.targetProperty,
      group_by: options.groupBy,
      filters: options.filters,
      timeframe: options.timeframe,
      interval: options.interval,
      timezone: (options.timezone || _build_timezone_offset()),
      latest: options.latest
    };
    return this;
  };
  
  Keen.Analysis.prototype.addFilter = function(property, operator, value) {
    this.params.filters.push({
      "property_name": property,
      "operator": operator,
      "property_value": value
    });
    return this;
  };
  
  
  // -------------------------------
  // Keen.Analysis Types
  // -------------------------------

  Keen.Sum = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'sum';
    if (options.targetProperty === undefined) return options;
    if (!eventCollection || !options.targetProperty) return options;
    this.configure(eventCollection, options);
  };
  Keen.Sum.prototype = new Keen.Analysis();
  
  
  Keen.Count = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'count';
    if (!eventCollection) return options;
    this.configure(eventCollection, options);
  };
  Keen.Count.prototype = new Keen.Analysis();
  
  
  Keen.CountUnique = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'count_unique';
    if (!eventCollection || !options.targetProperty) return options;
    this.configure(eventCollection, options);
  };
  Keen.CountUnique.prototype = new Keen.Analysis();
  
  
  Keen.Minimum = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'minimum';
    if (!eventCollection || !options.targetProperty) return options;
    this.configure(eventCollection, options);
  };
  Keen.Minimum.prototype = new Keen.Analysis();
  
  
  Keen.Maximum = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'maximum';
    if (!eventCollection || !options.targetProperty) return options;
    this.configure(eventCollection, options);
  };
  Keen.Maximum.prototype = new Keen.Analysis();
  
  
  Keen.Average = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'average';
    if (!eventCollection || !options.targetProperty) return options;
    this.configure(eventCollection, options);
  };
  Keen.Average.prototype = new Keen.Analysis();
  
  
  Keen.SelectUnique = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'select_unique';
    if (!eventCollection || !options.targetProperty) return options;
    this.configure(eventCollection, options);
  };
  Keen.SelectUnique.prototype = new Keen.Analysis();
  
  
  Keen.Extraction = function(eventCollection, config){
    var options = (config || {});
    options.analysisType = 'extraction';
    if (!eventCollection) return options;
    this.configure(eventCollection, options);
  };
  Keen.Extraction.prototype = new Keen.Analysis();
  
  
  Keen.Funnel = function(config){
    var options = (config || {});
    options.analysisType = 'funnel';
    if (!options.steps) throw Error('Please configure an array of steps for this funnel');
    this.configure(options);
  };
  Keen.Funnel.prototype = new Keen.Analysis();
  Keen.Funnel.prototype.configure = function(options){
    this.path = '/queries/' + options.analysisType;
    this.params = {
      steps: [],
      timeframe: options.timeframe,
      timezone: (options.timezone || _build_timezone_offset())
    };
    for (var i = 0; i < options.steps.length; i++){
      var step = {};
      if (!options.steps[i].eventCollection) throw Error('Please provide an eventCollection value for step #' + (i+1));
      step.event_collection = options.steps[i].eventCollection;
      
      if (!options.steps[i].actorProperty) throw Error('Please provide an actorProperty value for step #' + (i+1));
      step.actor_property = options.steps[i].actorProperty;
      
      if (options.steps[i].filters) step.filters = options.steps[i].filters;
      if (options.steps[i].timeframe) step.timeframe = options.steps[i].timeframe;
      if (options.steps[i].timezone) step.timezone = options.steps[i].timezone;
      
      this.params.steps.push(step);
    }
    return this;
  };
  
  
  
  // Private
  // --------------------------------
  
  function _build_timezone_offset(){
    return new Date().getTimezoneOffset() * -60;
  };
  
  function _build_query_string(params){
    var query = [];
    for (var key in params) {
      if (params[key]) {
        var value = params[key];
        if (Object.prototype.toString.call(value) !== '[object String]') {
          value = JSON.stringify(value);
        }
        value = encodeURIComponent(value);
        query.push(key + '=' + value);
      }
    }
    return "&" + query.join('&');
  };
  
  function _send_query(url, sequence, success, error){
    switch(this.client.requestType){
      case 'xhr':
        _request.xhr.apply(this, ["GET", url, null, null, this.client.readKey, success, error, sequence]);
        break;
      case 'jsonp':
      case 'beacon':
        _request.jsonp.apply(this, [url, this.client.readKey, success, error, sequence])
        break;
    }
  };
  