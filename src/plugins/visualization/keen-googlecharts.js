  /*! 
  * ------------------------
  * Keen IO + Google Charts
  * Visualization Adapter
  * ------------------------
  */
  
  (function(name, context){
    
    var Keen = context[name];

    //var google = context['google'];
    
    // Assurance
    // ------------------------------
    if (!Keen || !Keen.Visualization) {
      throw Error('Keen.Visualization is not available');
    }
    
    // Library Namespace
    // ------------------------------
    Keen.GOOGLECHARTS = Keen.GOOGLECHARTS || {};
    
    
    
    
    // Line Chart
    // ------------------------------
    
    Keen.GOOGLECHARTS.LineChart = Keen.Visualization.extend({
      
      initialize: function(){
        console.log('googlecharts:initialize', this);
        
        this.on("update", function(){
          console.log("triggered to update");
          this.update();
        });
        
        google.setOnLoadCallback(this.render());
        return this;
      },
      
      transform: function(input) {
        console.log('googlecharts:transform', this);
        if (typeof this.query.data == 'object') {
          this.data = _keen_to_datatable.call(this);
        } else if (typeof data == 'array') {
          for (var i = 0; i < data.length; i++) {
            // different spin on the data table 
          }
        }
        return this.data;
      },
      
      render: function(){
        console.log('googlecharts:render', this);
        
        if (google.visualization) {
          var data = this.transform();
          this.el = document.getElementById(this.selector.replace("#", ""));
          this.config.width = this.el.offsetWidth;
          
          var chart = new google.visualization.LineChart(this.el);
          chart.draw(data, this.config);
        }
        
        return this;
      },
      
      update: function(){
        console.log('googlecharts:update');
        this.render();
      }
      // , remove: function(){}
    });
    
    
    
    // Pie Chart
    // ------------------------------
    
    Keen.GOOGLECHARTS.PieChart = Keen.Visualization.extend({
      
      initialize: function(){
        console.log('googlecharts:initialize', this);
        
        this.on("update", function(){
          console.log("triggered to update");
          this.update();
        });
        
        google.setOnLoadCallback(this.render());
        return this;
      },
      
      transform: function(input) {
        console.log('googlecharts:transform', this);
        if (typeof this.query.data == 'object') {
          this.data = _keen_to_datatable.call(this);
        } else if (typeof data == 'array') {
          for (var i = 0; i < data.length; i++) {
            // different spin on the data table 
          }
        }
        return this.data;
      },
      
      render: function(){
        console.log('googlecharts:render', this);
        
        if (google.visualization) {
          var data = this.transform();
          this.el = document.getElementById(this.selector.replace("#", ""));
          this.config.width = this.el.offsetWidth;
          
          var chart = new google.visualization.PieChart(this.el);
          chart.draw(data, this.config);
        }
        
        return this;
      },
      
      update: function(){
        console.log('googlecharts:update');
        this.render();
      }
      // , remove: function(){}
    });
    
    
    
    function _keen_to_datatable(){
      
      if (!this.query.data) return this;
      
      console.log('_keen_to_datatable', this);
      
      var datatable = [];
      var header = [];
      
      var data = this.query.data;
      var analyses = this.query.analyses;
      
      if (data.result instanceof Array) {
        // SERIES
        
        if (analyses[0] instanceof Keen.Extraction) {
          console.log('extraction');
        }
        
        if (analyses[0].params.group_by) {
          
          var group_by = analyses[0].params.group_by;
          
          if (analyses[0].params.interval) {
            // TIMELINE
            
            header.push(analyses[0].params.interval);
            
            for (var i = 0; i < data.result[0]['value'].length; i++){
              if (typeof data.result[0]['value'][i][group_by] !== 'array') {
                header.push((data.result[0]['value'][i][group_by] || ''));
              } else {
                // not chartable
              }
            }
            
            datatable.push(header);
            
            for (var i = 0; i < data.result.length; i++){
              datatable.push([]);
              datatable[i+1].push(new Date(data.result[i]['timeframe']['start']));
              for (var j = 0; j < data.result[i]['value'].length; j++){
                datatable[i+1].push(data.result[i]['value'][j]['result']);
              }
            }
            
            
          } else {
            // STRAIGHT LINE, BAR CHART, PIE CHART

            datatable.push([ analyses[0].params.event_collection, 'result' ]); // change 'result' to anaysis_type
            for (var i = 0; i < data.result.length; i++){
              datatable.push([ data.result[i][group_by], data.result[i]['result'] ]);
            }
            
          }
          
          
        }
        
        
        
      } else if (typeof data.result == 'number') {
        // METRIC
        // unchartable
        console.log('METRIC', data.result);
        
      }
      

      
      /*
        
        
        
        // typeof data == Object -> single analysis
        
          if typeof data.result == 'number -> metric
          
            
          
          if typeof data.result == 'array' -> series
            
            if analyses[0].params.analysis_type == 'extraction' -> 
              not chartable by default
              
              bubble chart ->
                type: 'bubble', map: ['x_scale_property', 'y_scale_property', 'categorical_color_property', 'sizing_property']
                column for each of 4 required arguments
                row for each data.result[i]
              
            
            if analyses[0].params.groupBy?
            
              grouping_property = analyses[i].params.groupBy;
            
              if analyses[0].params.interval? -> timeline
                if typeof data.result[i].value[j][grouping_property] !== 'array' (complex select_unique)
                  column for each data.result[i].value[j][grouping_property]
                  row for each via analyses[0].params.timeframe
                else
                  return not chartable
                
              else -> straight line, pie chart, stacked chart
                if typeof data.result[i].result !== 'array'
                  column for each data.result[i][grouping_property]
                  row for each data.result[i].result
                else
                  return not chartable
            
            else
              column for 
              row for each data.result[i].value
          
            if analyses[0].params.interval?
              row for each timeline via analyses[0].params.timeframe
            else
              single floating data point
            
            
        
        // typeof data == Array -> multi
          
          // for each data[i] Run single analysis computation
            // for each typeof data.result == Number -> metric
            // for each typeof data.result == Array -> series
            // ...etc
        
        */
      
      console.log(datatable);
      return new google.visualization.arrayToDataTable(datatable);
      
      
    }
    
    
    // Register Library Methods
    // ------------------------------
    
    Keen.Visualization.register("google", {
      "line": Keen.GOOGLECHARTS.LineChart,
      "pie": Keen.GOOGLECHARTS.PieChart
    });
    
    return Keen;
    
  })('Keen', this);
  