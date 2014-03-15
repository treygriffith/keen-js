  /*! 
  * ----------------------
  * Keen IO + NVD3.js
  * Visualization Adapter
  * ----------------------
  */
  
  (function(name, context){
    
    var Keen = context[name];

    var d3 = context['d3'];
    var nv = context['nv'];
    
    // Assurance
    // ------------------------------
    if (!Keen || !Keen.Visualization) {
      throw Error('Keen.Visualization is not available');
    }
    
    // Library Namespace
    // ------------------------------
    Keen.NVD3 = Keen.NVD3 || {};
    
    
    // Line Chart
    // ------------------------------
    
    Keen.NVD3.LineChart = Keen.Visualization.extend({
      
      initialize: function(){
        console.log('nvd3:initialize', this);
        
        this.on("update", function(){
          console.log("triggered to update");
          this.update();
        });
        
        this.render();
      },
      
      transform: function(input) {
        var output = 'data';
        return output;
      },
      
      render: function(){
        console.log('nvd3:render', this);
        this.el = d3.select(this.selector).append("div");
        this.update();
        return this;
      },
      
      update: function(){
        console.log('nvd3:update');
        if (this.query && this.query.data.meta) {
          this.el.text(this.selector + ', ' + this.query.data.meta.query.params.event_collection);
        }
      }
      
      // , remove: function(){}
      
    });
    
    
    // Register Library Methods
    // ------------------------------
    
    Keen.Visualization.register("nvd3", {
      "line": Keen.NVD3.LineChart
    });
    
    return Keen;
    
  })('Keen', this);
  