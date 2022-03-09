const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);

  const baseUrl = "/api/stock-prices";

  test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(baseUrl)
      .query()
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.fail("NotImplemented");
        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(baseUrl)
      .query()
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.fail("NotImplemented");
        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(baseUrl)
      .query()
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.fail("NotImplemented");
        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(baseUrl)
      .query()
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.fail("NotImplemented");
        done();
      });
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
    chai
      .request(server)
      .get(baseUrl)
      .query()
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.fail("NotImplemented");
        done();
      });
  });
});
