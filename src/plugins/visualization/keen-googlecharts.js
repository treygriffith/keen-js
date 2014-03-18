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
    Keen.GoogleCharts = Keen.GoogleCharts || {};
    
    
    // Area Chart
    // ------------------------------
    
    Keen.GoogleCharts.AreaChart = Keen.Visualization.extend({
      
      initialize: function(){
        this.on("update", function(){
          this.render();
        });
        google.setOnLoadCallback(this.render());
      },
      
      render: function(){
        if (google.visualization) {
          _keen_to_datatable.call(this);
          if (this.data) {
            var chart = new google.visualization.AreaChart(this.el);
            chart.draw(this.data, this.options);
          } else {
            this.error();
          }
        }
        return this;
      }
    });
    
    
    // Bar Chart
    // ------------------------------
    
    Keen.GoogleCharts.BarChart = Keen.Visualization.extend({
      
      initialize: function(){
        this.on("update", function(){
          this.render();
        });
        google.setOnLoadCallback(this.render());
      },
      
      render: function(){
        if (google.visualization) {
          _keen_to_datatable.call(this);          
          if (this.data) {
            var chart = new google.visualization.BarChart(this.el);
            chart.draw(this.data, this.options);
          } else {
            this.error();
          }
        }
        return this;
      }
    
    });
    
    
    // Column Chart
    // ------------------------------
    
    Keen.GoogleCharts.ColumnChart = Keen.Visualization.extend({
      
      initialize: function(){
        this.on("update", function(){
          this.render();
        });
        google.setOnLoadCallback(this.render());
      },
      
      render: function(){
        if (google.visualization) {
          _keen_to_datatable.call(this);
          //var csv = google.visualization.dataTableToCsv(this.data);
          //console.log(csv);
          if (this.data) {
            var chart = new google.visualization.ColumnChart(this.el);
            chart.draw(this.data, this.options);
          } else {
            this.error();
          }
        }
        return this;
      }
    
    });
    
    
    // Line Chart
    // ------------------------------
    
    Keen.GoogleCharts.LineChart = Keen.Visualization.extend({
      
      initialize: function(){
        this.on("update", function(){
          this.render();
        });
        google.setOnLoadCallback(this.render());
        return this;
      },
      
      render: function(){
        if (google.visualization) {
          _keen_to_datatable.call(this);
          if (this.data) {
            var chart = new google.visualization.LineChart(this.el);
            chart.draw(this.data, this.options);
          } else {
            this.error();
          }
        }
        return this;
      },
      
    });
    
    
    
    // Pie Chart
    // ------------------------------
    
    Keen.GoogleCharts.PieChart = Keen.Visualization.extend({
      
      initialize: function(){
        this.on("update", function(){
          this.render();
        });
        google.setOnLoadCallback(this.render());
        return this;
      },
      
      transform: function(input) {
        if (this.query.data.result == void 0) return false;
        var group_by = this.query.analyses[0].params.group_by || false;
        this.data = (!group_by) ? false : (function(context){
          var datatable = [ [ group_by, 'value' ] ];
          var data = context.query.data.result;
          data.sort(function (a, b) {
            return b.result - a.result;
          });
          for ( var i = 0; i < data.length; i++ ) {          
            if (context.options.labels && context.options.labels[data[i][group_by]]) {
              datatable.push([ String(context.options.labels[data[i][group_by]]), data[i]['result'] ]);
            } else {
              datatable.push([ String(data[i][group_by]), data[i]['result'] ]);
            }
          }
          return new google.visualization.arrayToDataTable(datatable);
        })(this);
        return this;
      },
      
      render: function(){
        if (google.visualization) {
          this.transform();
          if (this.data) {
            var chart = new google.visualization.PieChart(this.el);
            chart.draw(this.data, this.options);
          } else {
            this.error();
          }
        }
        return this;
      }

    });
    
    
    
    Keen.GoogleCharts.Table = Keen.Visualization.extend({
      
      initialize: function(){
        this.on("update", function(){
          this.render();
        });
        google.setOnLoadCallback(this.render());
        return this;
      },
      
      render: function(){
        if (google.visualization) {
          _keen_to_datatable.call(this);
          if (this.data) {
            var chart = new google.visualization.Table(this.el);
            chart.draw(this.data, this.options);
          } else {
            this.error();
          }
        }
        return this;
      }
    
    });
    
    
    
    
    // Private methods
    // ---------------------------
    
    function _label(value){
      if (this.options.labels) {
        return this.options.labels[value] || value
      }
    }
    
    function _keen_to_datatable(){
      
      if (this.query.data == void 0 || this.capable.indexOf(this.type) < 0) {
        return this.data = false;
      }
      
      var datatable = [];
      var analyses = this.query.analyses;
      var dataset = (this.query.data instanceof Array) ? this.query.data : [this.query.data];
      var analysis, collection, group_by, interval;
      
      for (var a = 0; a < analyses.length; a++) {
        
        analysis = analyses[a];
        data = dataset[a];
        
        collection = analysis.params.event_collection;
        group_by = (analysis.params.group_by) ? analysis.params.group_by : false;
        interval = (analysis.params.interval) ? analysis.params.interval : false;
        
        if (data.result instanceof Array) {
          // SERIES
        
          if (analysis instanceof Keen.Extraction) {
            console.log('extraction');
            // https://developers.google.com/chart/interactive/docs/gallery/bubblechart?csw=1
          }
                    
          datatable.push([]);
          
          if (interval) {
            datatable[0].push(interval);
          }
          
          if (group_by && !interval) {
            datatable[0].push(group_by);
          }
          
          if (!group_by && !interval) {
            datatable[0].push([collection, 'result']);
          }
          
          if (group_by) {
            for (var i = 0; i < data.result[0]['value'].length; i++) {
              datatable[0].push(( _label.call(this, data.result[0]['value'][i][group_by]) || ''));
            }
          }
          
          // Rows
          for (var i = 0; i < data.result.length; i++){
            datatable.push([]);
            
            if (interval) {
              datatable[i+1].push(new Date(data.result[i]['timeframe']['start']));
            }
            
            if (data.result[i]['value'] instanceof Array) {
              for (var j = 0; j < data.result[i]['value'].length; j++){
                datatable[i+1].push(data.result[i]['value'][j]['result']);
              }
            } else {
              datatable[i+1].push(data.result[i]['value'] || '');
            }
            
          }
          
          
          
        } else if (typeof data.result == 'number') {
          // METRIC
          datatable.push([ 'collection', 'result'], [ collection , data.result ]);
          this.capable = ['text'];
        }
        
      }
      
      var dt = new google.visualization.arrayToDataTable(datatable);
      var csv = google.visualization.dataTableToCsv(dt);
      //console.log(csv);
      
      this.data = google.visualization.arrayToDataTable(datatable);
      return this;
    }
    
    
    // Register Library Methods
    // ------------------------------
    
    Keen.Visualization.register("google", {
      "area"  : Keen.GoogleCharts.AreaChart,
      "bar"   : Keen.GoogleCharts.BarChart,
      "column": Keen.GoogleCharts.ColumnChart,
      "line"  : Keen.GoogleCharts.LineChart,
      "pie"   : Keen.GoogleCharts.PieChart,
      "table" : Keen.GoogleCharts.Table
    });
    
    return Keen;
    
  })('Keen', this);
  