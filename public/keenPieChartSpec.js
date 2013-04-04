describe("Pie Charts", function() {

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
      var canvas = document.createElement("div")
      canvas.setAttribute("id", "pieChart");
      canvas.setAttribute("style", "width: 100px;");
      document.body.appendChild(canvas);
      
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
        newChart.draw(canvas, fakeData, function() {
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
      var canvas = document.createElement("div")
      canvas.setAttribute("id", "pieChart");
      canvas.setAttribute("style", "width: 100px;");
      document.body.appendChild(canvas);
      
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
        newChart.draw(canvas, fakeData)

        chartsLoaded = true;
      });

      runs(function() {
        assertSvg();
      });
    });
  });
});

