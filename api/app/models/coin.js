const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  spotPrice: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  plntax: {
    type: Number,
    required: false,
  }
});

const Coin = mongoose.model('Coin', CoinSchema);

module.exports = Coin;