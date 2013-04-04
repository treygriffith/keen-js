describe("Bar Charts", function() {
  beforeEach(function() {
    jasmine.util.extend(this, new KeenSpecHelper());
  });
  afterEach(function() {
    this.cleanUp($("#barChart"));
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
  describe("Keen.BarChart", function() {
    it("should draw a google bar chart and invoke the callback", function() {
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
          title: "testChart",
          yAxisLabel: "myStatsBih",
          height: 500,
          width: 600,
          backgroundColor: "red",
          colors: ["green"],
          fontColor: "orange"
        };

        var newChart = new Keen.BarChart(query, options);
        newChart.draw($("#barChart")[0], fakeData, function() {
          callbackCalled = true;
        });

        chartsLoaded = true;
      });

      runs(function() {
        // Google Charts adds string cacatenation issue
        var label = "";
        label += $("svg g:eq(2) g text:first-child").text(); 
        label += " ";
        label += $("svg g:eq(2) g text:last-child").text();
        expect(label).toBe("sum - purchases");
        expect(callbackCalled).toBeTruthy();
        expect($("svg defs rect")).toExist();
      });
    });
    it("should not require a callback", function() {
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
            groupBy: "result",
            label: "result"
          }
        };
        var options = {
          title: "testChart"
        };

        var newChart = new Keen.BarChart(query, options);
        newChart.draw($("#barChart")[0], fakeData);

        chartsLoaded = true;
      });

      runs(function() {
        expect($("svg defs rect")).toExist();
      });
    });
  });
});

