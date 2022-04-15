"use strict";

const axios = require("axios").default;
const { Stock } = require("../models");
const { ErrorStatus } = require("../utilities");

class StockController {
  async fetchStock(symbol, ip, like = false) {
    // fetch stock data
    if (!symbol) return null;

    const stockData = await this.fetchStockExternal(symbol);
    const stock = like
      ? await this.fetchStockDbAndLike(symbol, ip)
      : await this.fetchStockDb(symbol);

    return {
      stock: symbol,
      price: stockData.latestPrice,
      likes: stock.likes_by_ip.length,
    };
  }

  async fetchStockExternal(symbol) {
    // fetch stock data from external api
    try {
      const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;
      const stock = await axios.get(url);
      return stock.data;
    } catch (error) {
      throw new ErrorStatus(error.response.data, 502);
    }
  }

  async fetchStockDb(symbol) {
    // find one stock by symbol or create a new one
    let stock;
    stock = await Stock.findOne({ symbol }).exec();
    if (!stock) {
      stock = await Stock.create({ symbol });
    }
    return stock;
  }

  async fetchStockDbAndLike(symbol, ip) {
    const truncatedIp = ip.substring(0, 15);
    const stock = await this.fetchStockDb(symbol);

    // push `truncatedIp` to `likes_by_ip` array if it's not already in there
    if (stock.likes_by_ip.includes(truncatedIp)) return stock;

    // update `likes_by_ip` array
    stock.likes_by_ip.push(truncatedIp);
    await stock.save();
    return stock;
  }
}

module.exports = StockController;
