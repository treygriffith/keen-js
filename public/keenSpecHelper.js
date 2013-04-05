KeenSpecHelper = function() {
  this.projectId = "fdjlskfjdk";
  this.apiKey = "this-is-the-api-key";
  this.keenUrl = "http://web.kn:9999";
  this.eventCollection = "jasmine";
  this.eventProperties = { username: "bob", color: "blue" };
  this.successfulResponse = "{\"created\": true }";
  this.errorResponse = "{\"error\": true }";

  this.fakeData = {
    "result": [
      {
        "item.id": 664,
        "result": 664
      },
      {
        "item.id": 285,
        "result": 285
      },
      {
        "item.id": 442,
        "result": 442
      },
      {
        "item.id": 500,
        "result": 500
      }
    ]
  };

  this.postUrl =
    this.keenUrl + "/3.0/projects/" + this.projectId + "/events/" + this.eventCollection;

  this.queryUrl = function(apiKey, eventCollection, analysisType, groupBy, targetProperty) {
    var fullUrl = this.keenUrl + "/3.0/projects/" + this.projectId
                    + "/queries/" + analysisType + "?event_collection=" + eventCollection
                    + "&api_key=" + apiKey;

    if (groupBy) {
      fullUrl += "&groupBy=" + groupBy;
    }
    if (targetProperty) {
      fullUrl += "&targetProperty=" + targetProperty;
    }
    
    return fullUrl;

  };

  this.cleanUp = function(id) {
    $(id).remove();
  };

  this.waitForChart = function(metricFunc) {
    
    $("<div>", {
      id: "metric"
    }).appendTo(document.body);

    this.respondWith(200, JSON.stringify(this.fakeData));

    var chartsLoaded;
    waitsFor(function(){
      return chartsLoaded;
    }, "Charts never loaded", 2000);

    Keen.onChartsReady((function() {
      var metric = metricFunc();
      metric.drawBarChart($("#metric")[0], {
          title: "testChart",
          yAxisLabel: "myStatsBih",
          height: 500,
          width: 900,
          backgroundColor: "gray",
          colors: ["blue"],
          fontColor: "pink",
          xAxisLabel: "xLabel",
          chartAreaLeft: 200,
          chartAreaWidth: 500,
          chartAreaHeight: 400,
          xAxisLabelColor: "red",
          yAxisLabelColor: "pink",
          useVerticalBarChart: true
      }, function(){
        chartsLoaded = true;
      }); 

      this.server.respond();
    }).bind(this));

  };

}

