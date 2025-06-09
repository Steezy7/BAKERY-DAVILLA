const mongoose = require("mongoose");

const confirmedOrderSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phone_no: String,
  address: String,
  totalprice: Number,
  orders: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ConfirmedOrder", confirmedOrderSchema);
