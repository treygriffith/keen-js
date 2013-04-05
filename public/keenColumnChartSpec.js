describe("Column Charts", function() {
  beforeEach(function() {
    jasmine.util.extend(this, new KeenSpecHelper());
  });

  afterEach(function() {
    this.cleanUp($("#columnChart"));
  });

  describe("Keen.ColumnChart", function() {
    it("should draw a google column chart and invoke the callback", function() {
      
      // Make KeenSpecHelper available inside onChartsReady
      var that = this;

      $("<div>", {
        id: "columnChart"
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


        var newChart = new Keen.ColumnChart(query, options);
        newChart.draw($("#columnChart")[0], that.fakeData, function() {
          callbackCalled = true;
        });

        chartsLoaded = true;
      });

      runs(function() {
        var label = $("svg g:eq(1) g:eq(1) text:first-child").text() 
        expect(callbackCalled).toBeTruthy();
        expect($("#columnChart")).toExist();
        expect(label).toBe("sum - purchases");
      });
    });

    it("should not require a callback", function() {

      // Make KeenSpechelper available inside onChartsReady
      var that = this;

      $("<div>", {
        id: "columnChart"
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

        var newChart = new Keen.ColumnChart(query, options);
        newChart.draw($("#columnChart")[0], that.fakeData);

        chartsLoaded = true;
      });

      runs(function() {
        expect($("#columnChart")).toExist();
      });
    });
  });
});

