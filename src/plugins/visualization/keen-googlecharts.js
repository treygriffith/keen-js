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
        
        this.render();
      },
      
      transform: function(input) {
        var output = 'data';
        return output;
      },
      
      render: function(){
        console.log('googlecharts:render', this);
        this.el = document.getElementById(this.selector.replace("#", ""));
        this.update();
        return this;
      },
      
      update: function(){
        console.log('googlecharts:update');
        if (this.query) {
          var collection = this.query.analyses[0].params.event_collection;
          var result = JSON.stringify(this.query.data);
          this.el.innerHTML = (this.selector + ', ' + collection + ': ' + result);
        }
      }
      
      // , remove: function(){}
      
    });
    
    
    // Register Library Methods
    // ------------------------------
    
    Keen.Visualization.register("google", {
      "line": Keen.GOOGLECHARTS.LineChart
    });
    
    return Keen;
    
  })('Keen', this);
  