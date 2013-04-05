describe("Bar Charts", function() {
  beforeEach(function() {
    jasmine.util.extend(this, new KeenSpecHelper());
  });

  afterEach(function() {
    this.cleanUp($("#barChart"));
  });

  describe("Keen.BarChart", function() {
    it("should draw a google bar chart and invoke the callback", function() {
      
      // Make KeenSpecHelper available inside onChartsReady
      var that = this;

      $("<div>", {
        id: "barChart"
      }).appendTo(document.body)
     
      var chartsLoaded;
      waitsFor(function() {
        return chartsLoaded;
      }, "Chart never loaded", 2000);
      
      
      Keen.onChartsReady(function() {
        var query = {
          attributes: {
            analysisType: "sum",
            eventCollection: "purchases",
            groupBy: "result",
            label: "result"
          }
        };
        // Make sure all options work
        var options = {
          title: "testChart",
          yAxisLabel: "myStatsBih",
          height: 500,
          width: 900,
          backgroundColor: "gray",
          colors: ["blue"],
          fontColor: "pink",
          xAxisLabel: "timmy",
          chartAreaLeft: 200,
          chartAreaWidth: 500,
          chartAreaHeight: 400,
          xAxisLabelColor: "red",
          yAxisLabelColor: "pink"
        };

        var newChart = new Keen.BarChart(query, options);
        newChart.draw($("#barChart")[0], that.fakeData, function() {
          callbackCalled = true;
        });

        chartsLoaded = true;
      });

      runs(function() {
        var label = $("svg g:eq(2) g text:first-child").text(); 
        expect(label).toBe("sum - purchases");
        expect(callbackCalled).toBeTruthy();
        expect($("svg defs rect")).toExist();
      });
    });

    it("should not require a callback", function() {

      // Make KeenSpecHelper available inside onChartsReady
      var that = this;

      $("<div>", {
        id: "barChart"
      }).appendTo(document.body)
     
      var chartsLoaded;
      waitsFor(function() {
        return chartsLoaded;
      }, "Chart never loaded", 2000);

      Keen.onChartsReady(function() {
        var query = {
          attributes: {
            analysisType: "sum",
            eventCollection: "purchases",
            groupBy: "result",
            label: "result"
          }
        };
        var options = {
          title: "testChart"
        };

        var newChart = new Keen.BarChart(query, options);
        newChart.draw($("#barChart")[0], that.fakeData);

        chartsLoaded = true;
      });

      runs(function() {
        expect($("svg defs rect")).toExist();
      });
    });
  });
});

