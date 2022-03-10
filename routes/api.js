"use strict";

const { StockController } = require("../controllers");

module.exports = function (app) {
  const stockController = new StockController();

  /**
   * GET
   * /api/stock-prices?[stock]&[like]
   *    or
   * /api/stock-prices?[stock1,stock2]&[like]
   *
   * Fetch the requested stock information and add the like status if the user like them per IP.
   *
   * Responses:
   * -  200 Success
   * -  502 Bad Gateway (external api error)
   */
  app.route("/api/stock-prices").get(async function (req, res, next) {
    try {
      const [stock1, stock2] = Array.isArray(req.query.stock)
        ? [req.query.stock[0].toUpperCase(), req.query.stock[1].toUpperCase()]
        : [req.query.stock.toUpperCase(), null];
      const like = req.query.like === "true";

      const stockResult1 = await stockController.fetchStock(
        stock1,
        req.ip,
        like
      );
      let result = stockResult1;

      if (stock2) {
        const stockResult2 = await stockController.fetchStock(
          stock2,
          req.ip,
          like
        );
        result = [
          { ...stockResult1, rel_likes: stockResult1.likes, likes: undefined },
          { ...stockResult2, rel_likes: stockResult2.likes, likes: undefined },
        ];
      }

      res.json({ stockData: result });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
};
