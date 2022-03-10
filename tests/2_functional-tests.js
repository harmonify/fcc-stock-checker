const chaiHttp = require("chai-http");
const chai = require("chai");

const assert = chai.assert;

const server = require("../server");
const { Stock } = require("../models");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);

  const baseUrl = "/api/stock-prices";

  // reset database before and after this suite runs
  before(async function () {
    await Stock.deleteMany({});
  });

  after(async function () {
    await Stock.deleteMany({});
  });

  test("Viewing one stock: GET request to /api/stock-prices/", function (done) {
    const query = {
      stock: "goog",
    };

    chai
      .request(server)
      .get(baseUrl)
      .query(query)
      .end(function (err, res) {
        if (err) done(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.property(res.body.stockData, "price");
        assert.equal(res.body.stockData.likes, 0);
        done();
      });
  });

  test("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
    const query = {
      stock: "goog",
      like: "true",
    };

    chai
      .request(server)
      .get(baseUrl)
      .query(query)
      .end(function (err, res) {
        if (err) done(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.property(res.body.stockData, "price");
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
    const query = {
      stock: "goog",
      like: "true",
    };

    chai
      .request(server)
      .get(baseUrl)
      .query(query)
      .end(function (err, res) {
        if (err) done(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.property(res.body.stockData, "price");
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
    const query = {
      stock: ["btc", "msft"],
    };

    chai
      .request(server)
      .get(baseUrl)
      .query(query)
      .end(function (err, res) {
        if (err) done(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData[0].stock, "BTC");
        assert.property(res.body.stockData[0], "price");
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[1].stock, "MSFT");
        assert.property(res.body.stockData[1], "price");
        assert.equal(res.body.stockData[1].rel_likes, 0);
        done();
      });
  });

  test("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
    const query = {
      stock: ["btc", "msft"],
      like: "true",
    };

    chai
      .request(server)
      .get(baseUrl)
      .query(query)
      .end(function (err, res) {
        if (err) done(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData[0].stock, "BTC");
        assert.property(res.body.stockData[0], "price");
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[1].stock, "MSFT");
        assert.property(res.body.stockData[1], "price");
        assert.equal(res.body.stockData[1].rel_likes, 0);
        done();
      });
  });
});
