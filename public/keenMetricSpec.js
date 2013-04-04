describe("Keen.Metric.draw", function() {

  beforeEach(function() {
    jasmine.util.extend(this, new KeenSpecHelper());

    this.eventCollection = "purchases";

    Keen.configure(this.projectId, this.apiKey, {
      keenUrl: this.keenUrl
    });

    this.server = sinon.fakeServer.create();
    window.XMLHttpRequest.prototype.withCredentials = false;

    var self = this;
    this.respondWith = function(code, body) {
      self.server.respondWith(new RegExp(this.keenUrl),
        [code, { "Content-Type": "application/json"}, body]);
    }
  });

  afterEach(function() {
    this.server.restore();
    this.cleanUp($("#metric"));
  });

  it("should draw a google chart", function() {
    this.waitForChart.call(this, function() {
      return new Keen.Metric("purchases", {
        analysisType: "sum",
        targetProperty: "item.price",
        groupBy: "item.id"
      });
    });
      
    runs(function() {
      expect($("#metric")).toBeVisible();
    });
  });
});

