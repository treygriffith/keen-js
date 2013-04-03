describe("Column Charts", function() {
  beforeEach(function() {
    jasmine.util.extend(this, new KeenSpecHelper());
  });
  afterEach(function() {
    this.cleanUp($("#columnChart"));
  });
  var fakeData = {
    "result" : [ 
      {
        "item.id": 664,
        "result" : 664
      },
      {
        "item.id": 324,
        "result" : 324
      },
      {
        "item.id": 440,
        "result" : 440
      },
      {
        "item.id": 220,
        "result" : 220
      }
    ]
  };   
  describe("Keen.ColumnChart", function() {
    it("should draw a google column chart and invoke the callback", function() {
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
          title: "testChart",
          yAxisLabel: "myStatsBih",
          height: 500,
          width: 600,
          backgroundColor: "red",
          colors: ["green"],
          fontColor: "orange"

        };

        var newChart = new Keen.ColumnChart(query, options);
        newChart.draw($("#columnChart")[0], fakeData, function() {
          callbackCalled = true;
        });

        chartsLoaded = true;
      });

      runs(function() {
        var label = "";
        label += $("svg g:eq(1) g:eq(1) text:first-child").text() 
        label += " ";
        label += $("svg g:eq(1) g:eq(1) text:last-child").text()
        expect($("#columnChart")).toExist();
        expect(label).toBe("sum - purchases");
      });
    });
    it("should not require a callback", function() {
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
        newChart.draw($("#columnChart")[0], fakeData);

        chartsLoaded = true;
      });

      runs(function() {
        expect($("#columnChart")).toExist();
      });
    });
  });
});

