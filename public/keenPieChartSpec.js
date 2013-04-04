describe("Pie Charts", function() {

  beforeEach(function() {
    jasmine.util.extend(this, new KeenSpecHelper());
  });

  afterEach(function() {
    this.cleanUp($("#pieChart"));
  });

  function assertSvg() {
    expect($('#pieChart')).toBeVisible();
    expect($("svg g:eq(1) g text:eq(0)").text()).toBe("664");
    expect($("svg g:eq(1) g text:eq(2)").text()).toBe("440");
    expect($("svg g:eq(1) g text:eq(3)").text()).toBe("220");
    expect($("svg g:eq(1) g text:eq(1)").text()).toBe("324");
  }

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
  }

  describe("Keen.PieChart", function() {
    it("should draw a google chart and invoke the callback", function() {
      $('<div>', {
        id: 'pieChart'
      }).appendTo(document.body);

      var chartsLoaded, callbackCalled;
      waitsFor(function() {
        return chartsLoaded;
      }, "Chart never loaded", 2000);

      Keen.onChartsReady(function() {
        var query = {
          attributes: {
            groupBy: "item.id"
          }
        };
        var options = {
          title: "testChart"
        };
        var newChart = new Keen.PieChart(query, options);
        newChart.draw($("#pieChart")[0], fakeData, function() {
          callbackCalled = true;
        });

        chartsLoaded = true;
      });

      runs(function() {
        expect(callbackCalled).toBeTruthy();
        assertSvg();
      });
    });
    
    it("should not require a callback", function() {
      $("<div>", {
        id: "pieChart"
      }).appendTo(document.body);
      
      var chartsLoaded;
      waitsFor(function() {
        return chartsLoaded;
      }, "Chart never loaded", 2000);

      Keen.onChartsReady(function() {
        var query = {
          attributes: {
            groupBy: "item.id"
          }
        };
        var options = {
          title: "testChart"
        };

        var newChart = new Keen.PieChart(query, options);
        newChart.draw($("#pieChart")[0], fakeData)

        chartsLoaded = true;
      });

      runs(function() {
        assertSvg();
      });
    });
  });
});

