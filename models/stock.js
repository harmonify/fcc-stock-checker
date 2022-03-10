"use strict";

const { model, Schema, SchemaTypes } = require("mongoose");

const stockSchema = new Schema(
  {
    symbol: {
      type: SchemaTypes.String,
      required: [true, "Stock symbol is required"],
      index: true,
      unique: true,
    },
    likes_by_ip: {
      type: [
        {
          type: SchemaTypes.String,
          index: true,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Stock = model("Stock", stockSchema);

Stock.mock = function mock(symbol, likes) {
  return {
    symbol: symbol,
    likes: likes ? likes : Math.floor(Math.random() * 100),
  };
};

module.exports = {
  Stock,
  stockSchema,
};
