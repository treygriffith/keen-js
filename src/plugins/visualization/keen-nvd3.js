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
        this.on("update", function(data){
          this.update(data);
        });
        console.log('nvd3:initialize', this);
        this.render();
      },
      
      transform: function(input) {
        var output = 'data';
        return output;
      },
      
      render: function(){
        console.log('nvd3:render', this.el, document);
        var wrapper = document.getElementById(this.el);
        wrapper.innerHTML = 'cHaRtZ!';
        return this;
      },
      
      update: function(){
        console.log('nvd3:update');
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
  